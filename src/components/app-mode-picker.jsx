/** @jsx React.DOM */

'use strict';

var React = require("react/addons");
var cx = React.addons.classSet;

var SALESFORCE = "salesforce";
var CHATTER = "chatter";
var GOOGLE = "google";

var AppModePicker = React.createClass({
    handleClickSalesforce: function() {
        this.props.onClick(SALESFORCE);
    },
    handleClickChatter: function() {
        this.props.onClick(CHATTER);
    },
    handleClickGoogle: function() {
        this.props.onClick(GOOGLE);
    },
    render: function() {
        var salesforceClasses = cx({
            "Mode-text": true,
            "is-active": this.props.mode === SALESFORCE
        });

        var chatterClasses = cx({
            "Mode-text": true,
            "is-active": this.props.mode === CHATTER
        });

        var googleClasses = cx({
            "Mode-text": true,
            "is-active": this.props.mode === GOOGLE
        });

        return (
            <ul className="appMode">
                <li className="Mode is-active" onClick={this.handleClickSalesforce} title="Salesforce"><span className={salesforceClasses}>Salesforce</span></li>
                <li className="Mode" onClick={this.handleClickChatter} title="Chatter"><span className={chatterClasses}>Chatter</span></li>
                <li className="Mode" onClick={this.handleClickGoogle} title="Google"><span className={googleClasses}>Google</span></li>
            </ul>
            );
    }
});

module.exports = AppModePicker;