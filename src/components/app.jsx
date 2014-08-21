/** @jsx React.DOM */

'use strict';

var React = require("react/addons");
var cx = React.addons.classSet;

var DomainPicker = require('./domain-picker.jsx');
var AppModePicker = require('./app-mode-picker.jsx');
var SearchBar = require('./search-bar.jsx');
var SalesforceItems = require('./items/salesforce.jsx');
var ChatterItems = require('./items/chatter.jsx');
var GoogleItems = require('./items/google.jsx');

var SALESFORCE = 'salesforce';
var CHATTER = 'chatter';
var GOOGLE = 'google';
var DEFAULT_THEME = 'light';
var DARK_THEME = 'dark';

var App = React.createClass({
    getInitialState: function() {
        return {
            mode: this.props.initialMode,
            domain: this.props.initialDomain,
            theme: this.props.initialTheme || DEFAULT_THEME
        };
    },
    handleModeChange: function(mode) {
        chrome.runtime.sendMessage({type: 'setMode', mode: mode});
        this.setState({mode: mode});

    },
    handleDomainChange: function(domain) {
        chrome.runtime.sendMessage({type: 'setDomain', domain: domain}, function() {
            this.setState({domain: domain});
        }.bind(this));
    },
    handleThemeChange: function() {
        var theme = this.state.theme === DEFAULT_THEME ? DARK_THEME : DEFAULT_THEME;

        console.log(theme);
        chrome.runtime.sendMessage({type: 'setTheme', theme: theme});
        this.setState({theme: theme});

    },
    handleSubmit: function(event, query) {
        event.preventDefault();

        var host = this._getHost();

        if (this.state.mode === SALESFORCE) {
            window.location.href = host + encodeURI('/_ui/search/ui/UnifiedSearchResults?str=' + query);
        } else if (this.state.mode === CHATTER) {
            window.location.href = host + encodeURI('/_ui/search/ui/UnifiedSearchResults?str=' + query
                    + '#!/initialViewMode=feeds');
        } else if (this.state.mode === GOOGLE) {
            window.location.href = 'https://www.google.com/search?q=' + encodeURI(query);
        }
    },
    _getHost: function() {
        return this.state.domain != null? 'https://' + this.state.domain : 'https://login.salesforce.com';
    },
    render: function() {
        var wrapperClasses = cx({
            'wrapper': true,
            'dark-theme': this.state.theme === DARK_THEME
        });
        var themeIconClasses = cx({
            'fa': true,
            'fa-moon-o': this.state.theme === DARK_THEME,
            'fa-sun-o': this.state.theme === DEFAULT_THEME
        });

        var items;

        if (this.state.mode === SALESFORCE) {
            items = <SalesforceItems domain={this.state.domain} host={this._getHost()}/>;
        } else if (this.state.mode === CHATTER) {
            items = <ChatterItems domain={this.state.domain} host={this._getHost()}/>;
        } else if (this.state.mode === GOOGLE) {
            items = <GoogleItems/>;
        }

        return (
            <div className={wrapperClasses}>
                <div className="header">
                    <button className="ThemePicker skin-Button--noBorder" title="Change theme" onClick={this.handleThemeChange}>
                        <span className={themeIconClasses}/>
                    </button>
                    <DomainPicker domain={this.state.domain} handleDomainChange={this.handleDomainChange}/>
                </div>

                <div className="content">
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
    }

    chrome.runtime.sendMessage({type: "getTheme"}, function(theme) {
        console.log(theme);
        React.renderComponent(<App initialDomain={domain} initialMode={mode} initialTheme={theme}/>, document.body);
    });
});
