'use strict';

var Storage = require("./storage.js");
var Api = require("salesforce-api-using-access-token");

var localStateMode = null;
var localStateDomain = null;
var localStateTheme = null;

var recentsCache = null;
var chatterCache = null;
var topSitesCache = null;
var recentsCacheTimeout = null;
var chatterCacheTimeout = null;
var topSitesCacheTimeout = null;


chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName === 'sync') {
       if (changes.hasOwnProperty('domain')) {
           localStateDomain = changes.domain.newValue;
       } else if (changes.hasOwnProperty('mode')) {
           localStateMode = changes.mode.newValue;
       }
    } else if (areaName === 'local') {
        if (changes.hasOwnProperty('theme')) {
            localStateTheme = changes.theme.newValue;
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

                getDomain(function(err, domain) {
                    if (err) {
                        return sendResponse({mode: mode});
                    }

                    sendResponse({mode: mode, domain: domain});
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

        case "setMode":
            Storage.setMode(request.mode);
            return true;

        case "setDomain":
            Storage.setDomain(request.domain, function() {
                clearCache();

                sendResponse();
            });
            return true;

        case "setTheme":
            Storage.setTheme(request.theme, function() {
                sendResponse();
            });
            return true;

        case "getTheme":
            getTheme(function(err, theme) {
                if (err) {
                    return sendResponse(null);
                }

                return sendResponse(theme);
            });
            return true;

        case 'getCookies':
            chrome.cookies.getAll({name: 'sid'}, function(cookies) {
                if (cookies.length === 0) {
                    console.error('no cookies found');
                    return sendResponse(null);
                }

                sendResponse(cookies);
            });
            return true;

        default:
            break;
    }
});

function clearCache() {
    recentsCache = null;
    chatterCache = null;
    topSitesCache = null;

    recentsCacheTimeout = null;
    chatterCacheTimeout = null;
    topSitesCacheTimeout = null;
}

/**
 * First check cache for items
 * If nothing in cache, try API
 *
 * @param {function(Object, Object=)} callback
 * @returns items in callback or an error callback
 */
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
            recentsCacheTimeout = setTimeout(function() {
                recentsCache = null;
            },30000);
        });
    });
}

/**
 * First check cache for items
 * If nothing in cache, try API
 *
 * @param {function(Object, Object=)} callback
 * @returns items in callback or an error callback
 */
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
            chatterCacheTimeout = setTimeout(function() {
                chatterCache = null;
            },30000);
        });
    });
}

/**
 * First check cache for items
 * If nothing in cache, try API
 *
 * @param {function(Object, Object=)} callback
 * @returns items in callback or an error callback
 */
function getGoogleItems(callback) {
    if (topSitesCache) {
        return callback(null, topSitesCache);
    }

    chrome.topSites.get(function(mostVisitedURLs) {
        callback(null, mostVisitedURLs);

        // cache results for 60 seconds
        topSitesCache = mostVisitedURLs;
        topSitesCacheTimeout = setTimeout(function() {
            chatterCache = null;
        },60000);
    });
}

/**
 * First get domain
 * Then get cookies and find matched domain
 * If match found, return connection object
 *
 * @param {function(Object, Object=)} callback
 * @returns connection in callback or an error callback
 */
function getConnection(callback) {
    getDomain(function(err, domain) {
        if (err) {
            return callback(err);
        }

        chrome.cookies.getAll({name: 'sid', domain: domain}, function(cookies) {
            if (cookies.length === 0) {
                return callback(new Error('no cookies found'));
            }

            var connection = {instance_url: 'https://' + cookies[0].domain, access_token: cookies[0].value};
            return callback(null, connection);
        });
    })

}

/**
 * First check if domain exists in state
 * Then check if domain exists in storage
 *
 * @param {function(Object, Object=)} callback
 * @returns domain in callback or an error callback
 */
function getDomain(callback) {
    if (localStateDomain) {
        return callback(null, localStateDomain);
    }

    Storage.getDomain(function(err, domain) {
        if (err) {
            return callback(err);
        } else {
            localStateDomain = domain;
            return callback(null, domain);
        }
    });
}

/**
 * First check if theme exists in state
 * Then check if theme exists in storage
 *
 * @param {function(Object, Object=)} callback
 * @returns theme in callback or an error callback
 */
function getTheme(callback) {
    if (localStateTheme) {
        return callback(null, localStateTheme);
    }

    Storage.getTheme(function(err, theme) {
        if (err) {
            return callback(err);
        } else {
            localStateTheme = theme;
            return callback(null, theme);
        }
    });
}

/**
 * First check if mode exists in state
 * Then check if mode exists in storage
 *
 * @param {function(Object, Object=)} callback
 * @returns mode in callback or an error callback
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