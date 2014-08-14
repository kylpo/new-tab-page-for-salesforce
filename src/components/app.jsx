/** @jsx React.DOM */

'use strict';

var React = require("react");
var AuthorizePage = require("./authorize-page.jsx");

chrome.runtime.sendMessage({type: "getRecent"}, function(response) {
    if (response === null) {
        React.renderComponent(<AuthorizePage/>, document.body);
//        console.error("Error getting actions to client");
    } else {
        console.log(response);
//        React.renderComponent(<App items={response}/>, document.body);
    }
});

