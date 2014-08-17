/** @jsx React.DOM */

'use strict';

var React = require("react/addons");

module.exports = React.createClass({
    handleClickAuthorize: function() {
        var options = {
            "type": "authorize"
        };

        chrome.runtime.sendMessage(options, function() {
            window.location.reload();
        });
    },
    render: function() {
        return (
            <div className="wrapper">
                <div className="centered">
                    <div className="Authorize">
                        <button className="Authorize-button skin-Button is-active" onClick={this.handleClickAuthorize}>Authorize</button>
                        <p>(In popup window)</p>
                    </div>
                </div>
            </div>
            );
    }
});
