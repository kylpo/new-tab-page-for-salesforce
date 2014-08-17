/** @jsx React.DOM */

'use strict';

var React = require("react");
var PostItem = require("./post-item.jsx");

var ChatterItems = React.createClass({
    render: function() {
        var items = [];

        if (this.props.items != null) {
            this.props.items.every(function(item, index) {
                items.push(<PostItem id={item.id} post={item} url={this.props.host + '/' + item.id}/>);

                return index < 3;
            }.bind(this));
        }

        return (
            <div className="Items is-chatter">
            {items}
            </div>
            );
    }
});

module.exports = ChatterItems;