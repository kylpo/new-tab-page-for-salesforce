/** @jsx React.DOM */

'use strict';

var React = require('react');
var AuthorizePage = require('./authorize-page.jsx');
var AppModePicker = require('./app-mode-picker.jsx');
var SearchBar = require('./search-bar.jsx');
var Items = require('./items.jsx');

var App = React.createClass({
    getInitialState: function() {
        return {
            flipped: false,
            unflipped: false,
            selectedAction: null
        }
    },
    componentDidMount: function() {

    },
    componentWillUnmount: function() {

    },
    render: function() {
        return (
            <div className="wrapper">
                <div className="centered">
                    <AppModePicker/>
                    <SearchBar/>
                    <Items/>
                </div>
            </div>
            );
    }
});


chrome.runtime.sendMessage({type: "getRecent"}, function(response) {
    if (response === null) {
        React.renderComponent(<AuthorizePage/>, document.body);
//        console.error("Error getting actions to client");
    } else {
        console.log(response);
        React.renderComponent(<App items={response}/>, document.body);
    }
});

