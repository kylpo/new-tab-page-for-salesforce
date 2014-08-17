/** @jsx React.DOM */

'use strict';

var React = require("react");
var ListItem = require("./list-item.jsx");

var SalesforceItems = React.createClass({
//    var items = [];
//
//if (this.props.items != null) {
//    this.props.items.forEach(function (item) {
//        items.push(<div>{item.Name}</div>);
//    });
//}
//
//return (
//    <div className="items">
//            {items}
//    </div>
//    );
    render: function() {
        var items = [];

        if (this.props.items != null) {
            this.props.items.forEach(function(item) {

//                iconUrl={urlParts[0] + '//' + urlParts[2] + '/favicon.ico'}

            // ['https:','','www.example.com']
//            var urlParts = item.url.split('/');
                items.push(
                    <ListItem
                    textTitle={item.Name}
                    textDescription={item.Id}
                    url={this.props.host + item.attributes.url}

                    />
                );

            }.bind(this));
        }

        return (
            <div className="items">
            {items}
            </div>
            );

    }
});

module.exports = SalesforceItems;
