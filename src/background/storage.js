'use strict';

exports.getDomain = function getDomain(callback) {
    chrome.storage.sync.get("domain", function (items) {
        if (chrome.runtime.lastError) {
            callback(new Error(chrome.runtime.lastError));
        } else if (items && items.domain != null) {
            callback(null, items.domain);
        } else {
            callback(new Error("Domain not found in chrome.storage.sync"));
        }
    });
};

exports.setDomain = function setDomain(domain, callback) {
    var domainStorage = {};
    domainStorage.domain = domain;

    chrome.storage.sync.set(domainStorage, function() {
        callback();
    });
};

//exports.clearConnection = function(callback) {
//    var connectionObj = {};
//    connectionObj[CONNECTION_KEY] = null;
//
//    chrome.storage.sync.set(connectionObj, function() {
//        return callback();
//    });
//};

exports.getMode = function getMode(callback) {
    chrome.storage.sync.get('mode', function (items) {
        if (chrome.runtime.lastError) {
            callback(new Error(chrome.runtime.lastError));
        } else if (items && items.mode != null) {
            callback(null, items.mode);
        } else {
            callback(new Error("Mode not found in chrome.storage.sync"));
        }
    });
};

exports.setMode = function setMode(mode) {
    chrome.storage.sync.set({mode: mode});
};
