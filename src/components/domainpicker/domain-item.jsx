/** @jsx React.DOM */

'use strict';

var React = require("react/addons");
var cx = React.addons.classSet;

var DomainItem = React.createClass({
    render: function() {
        var salesforceClasses = cx({
            "Mode": true,
            "is-salesforce": true,
            "is-active": this.props.mode === SALESFORCE
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

module.exports = DomainItem;