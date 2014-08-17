/** @jsx React.DOM */

'use strict';

var React = require("react");
var PostItem = require("./post-item.jsx");
var GoTo = require("./go-to.jsx");

var ChatterItems = React.createClass({
    render: function() {
        var items = [];

        if (this.props.items != null) {
            this.props.items.every(function(item, index) {
                items.push(<PostItem key={item.id} post={item} url={this.props.host + '/' + item.id}/>);

                return index < 2;
            }.bind(this));
        }

        return (
            <div className="Items is-chatter">
            {items}
                <GoTo target="Chatter" url={this.props.host + '/_ui/core/chatter/ui/ChatterPage'}/>
            </div>
            );
    }
});

module.exports = ChatterItems;