/** @jsx React.DOM */

'use strict';

var React = require("react");

var GoTo = React.createClass({
    handleClick: function() {
        window.location.href = this.props.url;
    },
    render: function() {
        return (
            <div className="GoTo">
                <button className="GoTo-button" onClick={this.handleClick}>{this.props.text}</button>
            </div>
            );
    }
});

module.exports = GoTo;