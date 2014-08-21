/** @jsx React.DOM */

'use strict';

var React = require("react");

var GoTo = React.createClass({
    render: function() {
        var text = this.props.canGoTo ? 'Go to ' : 'Log in to ';

        return (
            <div className="GoTo">
                <a href={this.props.url} className="GoTo-button">{text + this.props.target}</a>
            </div>
            );
    }
});

module.exports = GoTo;