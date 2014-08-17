/** @jsx React.DOM */

'use strict';

var React = require("react");

var GoTo = React.createClass({
    handleClick: function(event, query) {
        window.location.href = this.props.url;
    },
    render: function() {
        return (
            <div className="GoTo">
                <button className="GoTo-button" onClick={this.handleClick}>Go to {this.props.target}</button>
            </div>
            );
    }
});

module.exports = GoTo