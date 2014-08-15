'use strict';

var clientId = require("../../config.js").clientId;
var clientSecret = require("../../config.js").clientSecret;
var host = require("../../config.js").host;
var Auth = require("salesforce-chrome-oauth")(clientId, clientSecret, host);

var Storage = require("./storage.js");
var Api = require("./api.js")(Auth.refreshToken, Storage.upsertConnection);
var localStateRecents = null;
var localStateMode = null;
var localStateConnection = null;

// This essentially acts as a dispatcher for what function to call
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    // Note: 'return true' in each case where you want to use sendResponse asynchronously
    switch (request.type) {
        case "getConnection":
            getConnection( function(err, connection) {
                if (err) {
                    return sendResponse(null);
                }

                sendResponse(connection);

//                Storage.getMode(function(err, connection) {
//
//                })
//                Api.getRecent(connection, function (err, data) {
//                    if (err) {
//                        return sendResponse(null);
////                        return callback(err);
//                    }
//
////                    localStateRecents = data;
//                    return sendResponse({connection: connection, recent: data});
////                    callback(null, data);
//                });
            });


//            getRecent(function(err, recent) {
//                if (err) {
//                    console.error(err.message);
//                    sendResponse(null);
//                } else {
//                    sendResponse(recent);
//                }
//            });
            return true;

        case "getAppState":
            getMode(function(err, mode) {
                if (err) {
                    return sendResponse(null);
                }

                getItems(function(err, items) {
                    if (err) {
                        return sendResponse({mode: mode});
                    }

                    sendResponse({mode: mode, items: items});
                });
            });
            return true;

        case "authorize":
            getAndStoreConnection(function(err, connection) {
                if (err) {
                    console.error(err.message);
                }

                sendResponse();
            });
            return true;

        case "logout":
            Storage.clearConnection(function() {
                localStateConnection = null;
                Storage.clearActions(function() {
                    localStateRecents = null;
                    sendResponse();
                })
            });
            return true;

        case "setMode":
            Storage.setMode(request.mode);
            localStateMode = request.mode;
            return true;

//        case "launchNewTab":
//            launchNewTab(localStateConnection.instance_url + "/" + request.id);
//            return true;

        default:
            break;
    }
});

//function launchNewTab(url) {
//    // would like to use chrome.tabs.getCurrent, but this doesn't work in the background script
//    chrome.tabs.query({active: true}, function(tabs) {
//        var currentTab = tabs[0];
//        //TODO , '"index": currentTab.index + 1' isn't consistently working. Sometimes it opens in position 1
//        chrome.tabs.create({"url": url, "openerTabId": currentTab.id});
//    })
//}

/**
 * First check if actions exist in state
 * Then check if actions exist in storage
 * - if taken from storage, filter actions
 * Then finally try to get (and store) actions from server
 *
 * @param {function(Object, Object=)} callback
 * @returns actions in callback or an error callback
 */
function getItems(callback) {
    if (localStateRecents) {
        return callback(null, localStateRecents);
    }

    getConnection( function(err, connection) {
        if (err) {
            return callback(err);
        }

        Api.getRecent(connection, function (err, data) {
            if (err) {
                return callback(err);
            }

            localStateRecents = data;
            callback(null, data);
        });
    });
}

/**
 * First check if connection exist in state
 * Then check if connection exist in storage
 * Then finally authorize with server to establish connection
 *
 * @param {function(Object, Object=)} callback
 * @returns connection in callback or an error callback
 */
function getConnection(callback) {
    if (localStateConnection) {
        return callback(null, localStateConnection);
    }

    Storage.getConnection(function(err, connection) {
        if (err || connection === null) {
            return callback(err);
        } else {
            localStateConnection = connection;
            return callback(null, connection);
        }
    });
}

/**
 * First check if actions exist in state
 * Then check if actions exist in storage
 * - if taken from storage, filter actions
 * Then finally try to get (and store) actions from server
 *
 * @param {function(Object, Object=)} callback
 * @returns actions in callback or an error callback
 */
function getMode(callback) {
    if (localStateMode) {
        return callback(null, localStateMode);
    }

    Storage.getMode(function(err, mode) {
        if (err || mode === null) {
            return callback(err);
        } else {
            localStateMode = mode;
            return callback(null, mode);
        }
    });
}


/**
 * 1. launch auth flow
 * 2. store the connection
 * 3. callback with connection or error
 *
 * @param {function(Object, Object=)} callback
 */
function getAndStoreConnection(callback) {
    Auth.authenticate(function(err, connection) {
        if (err) {
            return callback(err);
        }

        Storage.upsertConnection(connection, function() {
            localStateConnection = connection;
            callback(null, connection);
        });
    });
}