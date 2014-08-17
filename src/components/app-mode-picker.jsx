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
            "Mode": true,
            "is-salesforce": true,
            "is-active": this.props.mode === SALESFORCE
        });

        var chatterClasses = cx({
            "Mode": true,
            "is-chatter": true,
            "is-active": this.props.mode === CHATTER
        });

        var googleClasses = cx({
            "Mode": true,
            "is-google": true,
            "is-active": this.props.mode === GOOGLE
        });

        return (
            <ul className="AppMode">
                <li className={salesforceClasses} onClick={this.handleClickSalesforce} title={SALESFORCE}><span className="Mode-text">{SALESFORCE}</span></li>
                <li className={chatterClasses} onClick={this.handleClickChatter} title={CHATTER}><span className="Mode-text">{CHATTER}</span></li>
                <li className={googleClasses} onClick={this.handleClickGoogle} title={GOOGLE}><span className="Mode-text">{GOOGLE}</span></li>
            </ul>
            );
    }
});

module.exports = AppModePicker;