'use strict';

var Api = require("salesforce-api-using-access-token");

module.exports = function(refreshToken, upsertConnection) {
    var module = {};

    function apiCallWithRetryAndRefreshToken(action, args, responseCallback) {
        var getAndStoreRefreshedConnection = function getAndStoreRefreshedConnection(callback) {
            refreshToken(args[0], function(err, data) {
                if (err) {
                    return callback(null);
                }

                // args[0] == connection
                args[0] = data;
                upsertConnection(data, function(err, data) {
                    if (err) {
                        return callback(null);
                    }

                    return callback(args);
                });
            });
        };

        Api.apiCallWithRetry(action, args, getAndStoreRefreshedConnection, responseCallback);
    }

    module.getRecent = function getRecent(connection, callback) {
        apiCallWithRetryAndRefreshToken(Api.getRecent, [connection], callback);
    };

    module.getPosts = function getPosts(connection, callback) {
        apiCallWithRetryAndRefreshToken(Api.getFeed, [connection, null], callback);
    };

    return module;
};