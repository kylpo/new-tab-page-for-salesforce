/** @jsx React.DOM */

'use strict';

var React = require("react/addons");

module.exports = React.createClass({
    handleClickAuthorize: function() {
        var options = {
            "type": "authorize"
        };

        chrome.runtime.sendMessage(options, function() {
            window.close();
            //TODO: reload
        });
    },
    render: function() {
        return (
            <div className="Authorize">
                <button className="Authorize-button skin-Button is-active" onClick={this.handleClickAuthorize}>Authorize</button>
                <p>(In popup window)</p>
            </div>
            );
    }
});
