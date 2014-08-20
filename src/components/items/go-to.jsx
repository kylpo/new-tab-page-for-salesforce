/** @jsx React.DOM */

'use strict';

var React = require("react");

var GoTo = React.createClass({
    render: function() {
        return (
            <div className="GoTo">
                <a href={this.props.url} className="GoTo-button">{this.props.text}</a>
            </div>
            );
    }
});

module.exports = GoTo;