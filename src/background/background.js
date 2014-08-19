'use strict';

var Storage = require("./storage.js");
var Api = require("salesforce-api-using-access-token");

var localStateMode = null;
var localStateConnection = null;
var recentsCache = null;
var chatterCache = null;
var topSitesCache = null;


chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName === 'sync') {
       if (changes.hasOwnProperty('connection')) {
           localStateConnection = changes.connection.newValue;
       } else if (changes.hasOwnProperty('mode')) {
           localStateMode = changes.mode.newValue;
       }
    }
});

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

                getConnection(function(err, connection) {
                    if (err) {
                        return sendResponse({mode: mode});
                    }

                    sendResponse({mode: mode, domain: connection.domain});
                });
            });
            return true;

        case "getSalesforceItems":
            getSalesforceItems(function(err, items) {
                if (err) {
                    return sendResponse(null);
                }

                sendResponse(items);
            });
            return true;

        case "getChatterItems":
            getChatterItems(function(err, items) {
                if (err) {
                    return sendResponse(null);
                }

                sendResponse(items);
            });
            return true;

        case "getGoogleItems":
            getGoogleItems(function(err, items) {
                if (err) {
                    return sendResponse(null);
                }

                sendResponse(items);
            });
            return true;

        case "logout":
            Storage.clearConnection(function() {
                localStateConnection = null;
                sendResponse();
            });
            return true;

        case "setMode":
            Storage.setMode(request.mode);
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
            getSalesforceItems(callback);
            break;

        case 'chatter':
            getChatterItems(callback);
            break;

        case 'google':
            getGoogleItems(callback);
            break;
    }
}

function getSalesforceItems(callback) {
    if (recentsCache) {
        return callback(null, recentsCache);
    }

    getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        Api.getRecent(connection, function (err, data) {
            if (err) {
                return callback(err);
            }
            callback(null, data);

            // cache results for 30 seconds
            recentsCache = data;
            setTimeout(function() {
                recentsCache = null;
            },30000);
        });
    });
}

function getChatterItems(callback) {
    if (chatterCache) {
        return callback(null, chatterCache);
    }

    getConnection(function (err, connection) {
        if (err) {
            return callback(err);
        }

        Api.getFeed(connection, null, function (err, data) {
            if (err) {
                return callback(err);
            }
            callback(null, data.items);

            // cache results for 30 seconds
            chatterCache = data.items;
            setTimeout(function() {
                chatterCache = null;
            },30000);
        });
    });
}

function getGoogleItems(callback) {
    if (topSitesCache) {
        return callback(null, topSitesCache);
    }

    chrome.topSites.get(function(mostVisitedURLs) {
        callback(null, mostVisitedURLs);

        // cache results for 60 seconds
        topSitesCache = mostVisitedURLs;
        setTimeout(function() {
            chatterCache = null;
        },60000);
    });
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

//    chrome.cookies.getAll({name: 'sid', domain: "na15.salesforce.com"}, function(cookies) {
    chrome.cookies.getAll({name: 'sid'}, function(cookies) {
        if (cookies.length === 0) {
            return callback(new Error('no cookies found'));
        }

        var connection = {instance_url: 'https://' + cookies[0].domain, access_token: cookies[0].value, domain: cookies[0].domain};
        localStateConnection = connection;
        return callback(null, connection);
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