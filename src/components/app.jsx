/** @jsx React.DOM */

'use strict';

var React = require("react/addons");
var cx = React.addons.classSet;
var AuthorizePage = require('./authorize-page.jsx');
var AppModePicker = require('./app-mode-picker.jsx');
var SearchBar = require('./search-bar.jsx');
var Items = require('./items.jsx');

var SALESFORCE = "salesforce";
var CHATTER = "chatter";
var GOOGLE = "google";

var App = React.createClass({
    getInitialState: function() {
        return {
            mode: this.props.initialMode,
            items: this.props.initialItems
        };
    },
    handleModeChange: function(mode) {
        this.setState({mode: mode});
        chrome.runtime.sendMessage({type: 'setMode', mode: mode});

    },
    handleSubmit: function(event, query) {
        event.preventDefault();
        if (this.state.mode === 'salesforce') {
            window.location.href = this.props.instanceUrl
                + encodeURI('/_ui/search/ui/UnifiedSearchResults?str=' + query);

        } else if (this.state.mode === 'chatter') {
            window.location.href = this.props.instanceUrl
                + encodeURI('/_ui/search/ui/UnifiedSearchResults?str=' + query
                    + '#!/initialViewMode=feeds');

        } else if (this.state.mode === 'google') {
            window.location.href = 'https://www.google.com/search?q=' + encodeURI(query);
        }
    },
    render: function() {
        console.log(this.state.mode);
        var wrapperClasses = cx({
            'wrapper': true,
            'is-salesforce': this.state.mode === SALESFORCE,
            'is-chatter': this.state.mode === CHATTER,
            'is-google': this.state.mode === GOOGLE
        });

        return (
            <div className={wrapperClasses}>
                <div className="centered">
                    <AppModePicker mode={this.state.mode} onClick={this.handleModeChange}/>
                    <SearchBar onSubmit={this.handleSubmit}/>
                    <Items/>
                </div>
            </div>
            );
    }
});

chrome.runtime.sendMessage({type: "getConnection"}, function(response) {
    if (response === null) {
        React.renderComponent(<AuthorizePage/>, document.body);
    } else {
        chrome.runtime.sendMessage({type: "getAppState"}, function(response) {
            var mode = SALESFORCE;
            var items = null;

            if (response != null) {
                mode = response.mode;
                items = response.items;
            }

            React.renderComponent(
                <App instanceUrl={response.instance_url} initialMode={mode} initialItems={items}/>, document.body
            );
        });
    }
});

