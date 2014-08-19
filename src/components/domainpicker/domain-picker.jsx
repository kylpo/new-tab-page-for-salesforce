/** @jsx React.DOM */

'use strict';

var React = require("react/addons");
var cx = React.addons.classSet;

var DomainPicker = React.createClass({
    getInitialState: function() {
        return {cookies: null};
    },
    componentDidMount: function() {
        chrome.runtime.sendMessage({type: "getCookies"}, function(response) {
            if (this.isMounted()) {
                this.setState({cookies: response});
            }
        }.bind(this));
    },
    onClickItem: function(cookie) {
        this.props.handleDomainChange(cookie.domain);
    },
    render: function() {
//        var salesforceClasses = cx({
//            "Mode": true,
//            "is-salesforce": true,
//            "is-active": this.props.mode === SALESFORCE
//        });
        var items = [];

        if (this.state.cookies != null) {
            this.state.cookies.forEach(function(cookie) {
                items.push(<li onClick={this.onClickItem.bind(null, cookie)} title={cookie.domain}>{cookie.domain}</li>);
            }.bind(this));
        }

        return (
            <ul className="DomainPicker">
            {items}
            </ul>
            );
    }
});

module.exports = DomainPicker;