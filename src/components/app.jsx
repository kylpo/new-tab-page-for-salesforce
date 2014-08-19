/** @jsx React.DOM */

'use strict';

var React = require("react/addons");
var cx = React.addons.classSet;

var AppModePicker = require('./app-mode-picker.jsx');
var SearchBar = require('./search-bar.jsx');
var SalesforceItems = require('./items/salesforce.jsx');
var ChatterItems = require('./items/chatter.jsx');
var GoogleItems = require('./items/google.jsx');

var SALESFORCE = "salesforce";
var CHATTER = "chatter";
var GOOGLE = "google";

var App = React.createClass({
    getInitialState: function() {
        return {
            mode: this.props.initialMode,
            domain: this.props.initialDomain
        };
    },
    handleModeChange: function(mode) {
        chrome.runtime.sendMessage({type: 'setMode', mode: mode});
        this.setState({mode: mode});

    },
    handleHostChange: function(host) {
        //TODO
        chrome.runtime.sendMessage({type: 'setModeAndGetItems', mode: mode}, function(items) {
            this.setState({mode: mode, items: items});
        }.bind(this));

    },
    handleSubmit: function(event, query) {
        event.preventDefault();

        var host = this._getHost();

        if (this.state.mode === 'salesforce') {
            window.location.href = host + encodeURI('/_ui/search/ui/UnifiedSearchResults?str=' + query);

        } else if (this.state.mode === 'chatter') {
            window.location.href = host + encodeURI('/_ui/search/ui/UnifiedSearchResults?str=' + query
                    + '#!/initialViewMode=feeds');

        } else if (this.state.mode === 'google') {
            window.location.href = 'https://www.google.com/search?q=' + encodeURI(query);
        }
    },
    _getHost: function() {
        return this.state.domain != null? 'https://' + this.state.domain : 'https://login.salesforce.com';
    },
    handleLogout: function() {
        chrome.runtime.sendMessage({type: "logout"}, function() {
            window.location.reload();
        });
    },
    render: function() {
        var wrapperClasses = cx({
            'wrapper': true,
            'is-salesforce': this.state.mode === SALESFORCE,
            'is-chatter': this.state.mode === CHATTER,
            'is-google': this.state.mode === GOOGLE
        });

        var items;

        if (this.state.mode === SALESFORCE) {
            items = <SalesforceItems host={this._getHost()}/>;
        } else if (this.state.mode === CHATTER) {
            items = <ChatterItems host={this._getHost()}/>;
        } else if (this.state.mode === GOOGLE) {
            items = <GoogleItems/>;
        }

        var hostPicker;

        if (this.state.domain != null) {
            hostPicker = <button className="Logout" onClick={this.handleLogout}>{this.state.domain}</button>;
        }

        return (
            <div className={wrapperClasses}>
            {hostPicker}
                <div className="centered">
                    <AppModePicker mode={this.state.mode} onClick={this.handleModeChange}/>
                    <SearchBar mode={this.state.mode} onSubmit={this.handleSubmit}/>
                {items}
                </div>
            </div>
            );
    }
});

chrome.runtime.sendMessage({type: "getAppState"}, function(response) {
    var mode = SALESFORCE;
    var domain = null;

    if (response != null) {
        mode = response.mode;
        domain = response.domain;
//        if (response.connection != null && response.connection.instance_url != null) {
//            host = response.connection.instance_url;
//        }
    }

    React.renderComponent(
        <App initialDomain={domain} initialMode={mode}/>, document.body
    );
});
