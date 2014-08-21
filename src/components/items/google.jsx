/** @jsx React.DOM */

'use strict';

var React = require("react");
var ListItem = require("./list-item.jsx");
var GoTo = require("./go-to.jsx");

var GoogleItems = React.createClass({
    getInitialState: function() {
        return {items: undefined};
    },
    componentDidMount: function() {
        this._getItems();
    },
    componentWillReceiveProps: function() {
        this._getItems();
    },
    _getItems: function() {
        chrome.runtime.sendMessage({type: "getGoogleItems"}, function(response) {
            if (this.isMounted()) {
                this.setState({items: response});
            }
        }.bind(this));
    },
    render: function() {
        var items = [];
        var goToButton = null;

        if (this.state.items != null) {
            this.state.items.every(function(item, index) {

                // ['https:','','www.example.com']
                var urlParts = item.url.split('/');
                items.push(
                    <ListItem
                    key={item.url}
                    textTitle={item.title}
                    textDescription={item.url.split('//')[1]}
                    url={item.url}
                    iconUrl={urlParts[0] + '//' + urlParts[2] + '/favicon.ico'}
                    />
                );

                return index < 6;
            });
        }

        if (this.state.items !== undefined) {
            goToButton = <GoTo target="Google" canGoTo={true} url='https://www.google.com'/>;
        }

        return (
            <div className="Items is-google">
            {items}
            {goToButton}
            </div>
            );
    }
});

module.exports = GoogleItems;