/** @jsx React.DOM */

'use strict';

var React = require("react");

var Items = React.createClass({
    render: function() {
        var items = [];

        if (this.props.items != null) {
            this.props.items.forEach(function (item) {
                items.push(<div>{item.Name}</div>);
            });
        }

        return (
            <div className="items">
            {items}
            </div>
            );
    }
});

module.exports = Items;
