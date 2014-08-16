/** @jsx React.DOM */

'use strict';

var React = require("react");
var ListItem = require("./list-item.jsx");

var GoogleItems = React.createClass({
//{this.props.items[i].title}
    render: function() {
        var items = [];

        if (this.props.items != null) {
            this.props.items.every(function(item, index) {

                // ['https:','','www.example.com']
                var urlParts = item.url.split('/');
                items.push(
                    <ListItem
                    textTitle={item.title}
                    textDescription={item.url.split('//')[1]}
                    url={item.url}
                    iconUrl={urlParts[0] + '//' + urlParts[2] + '/favicon.ico'}
                    />
                );

                return index < 6;
            });
        }

        return (
            <div className="items">
            {items}
            </div>
            );
    }
});

module.exports = GoogleItems;