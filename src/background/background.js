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
            });
            return true;

        case "getAppState":
            getMode(function(err, mode) {
                if (err) {
                    return sendResponse(null);
                }

                getItems(mode, function(err, items) {
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
//                Storage.clearActions(function() {
//                    localStateRecents = null;
//                    sendResponse();
//                })
            });
            return true;

        case "setModeAndGetItems":
            getItems(request.mode, function(err, items) {
                if (err) {
                    return sendResponse(null);
                }

                sendResponse(items);
            });

            Storage.setMode(request.mode);
            localStateMode = request.mode;
            return true;

        default:
            break;
    }
});

/**
 * @param {string} mode
 * @param {function(Object, Object=)} callback
 * @returns actions in callback or an error callback
 */
function getItems(mode, callback) {
    switch (mode) {
        case 'salesforce':
            if (localStateRecents) {
                return callback(null, localStateRecents);
            }

            getConnection(function (err, connection) {
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
            break;

        case 'chatter':

            callback('no');
            break;

        case 'google':
            chrome.topSites.get(function(mostVisitedURLs) {
                callback(null, mostVisitedURLs);
            });
            break;
    }
}

/**
 * First check if connection exist in state
 * Then check if connection exist in storage
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