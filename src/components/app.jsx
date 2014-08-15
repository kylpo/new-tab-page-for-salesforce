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
            mode: 'salesforce'
        }
    },
    componentDidMount: function() {

    },
    componentWillUnmount: function() {

    },
    handleModeChange: function(mode) {
        this.setState({mode: mode});
    },
    handleSubmit: function(event, query) {
        event.preventDefault();
        if (this.state.mode === 'salesforce') {
            window.location.href = this.props.response.connection.instance_url
                + encodeURI('/_ui/search/ui/UnifiedSearchResults?str=' + query);

        } else if (this.state.mode === 'chatter') {
            window.location.href = this.props.response.connection.instance_url
                + encodeURI('/_ui/search/ui/UnifiedSearchResults?str=' + query
                    + '#!/initialViewMode=feeds');

        } else if (this.state.mode === 'google') {
            window.location.href = 'https://www.google.com/search?q=' + encodeURI(query);
        }
    },
    render: function() {
        var wrapperClasses = cx({
            'wrapper': true,
            'is-salesforce': this.state.mode === SALESFORCE,
            'is-chatter': this.state.mode === CHATTER,
            'is-google': this.state.mode === GOOGLE
        });

        var content = '';

        if (this.props.response == null) {
            content = (
                <div className="centered">
                    <AuthorizePage/>
                </div>
                )
        } else {
            content = (
                <div className="centered">
                    <AppModePicker mode={this.state.mode} onClick={this.handleModeChange}/>
                    <SearchBar onSubmit={this.handleSubmit}/>
                    <Items/>
                </div>
                );
        }

        return (
            <div className={wrapperClasses}>
            {content}
            </div>
            );
    }
});

chrome.runtime.sendMessage({type: "getAppState"}, function(response) {
        console.log(response);
        React.renderComponent(<App response={response}/>, document.body);
//    }
});

