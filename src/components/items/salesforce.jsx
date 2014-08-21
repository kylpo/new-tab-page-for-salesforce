/** @jsx React.DOM */

'use strict';

var React = require("react");
var ListItem = require("./list-item.jsx");
var GoTo = require("./go-to.jsx");

var SalesforceItems = React.createClass({
    getInitialState: function() {
        return {items: undefined};
    },
    componentDidMount: function() {
        this._getItems();
    },
    componentWillReceiveProps: function() {
        this._getItems();
    },
    _getItems: function() {
        chrome.runtime.sendMessage({type: "getSalesforceItems"}, function(response) {
            if (this.isMounted()) {
                this.setState({items: response});
            }
        }.bind(this));
    },
    render: function() {
        var items = [];
        var goToButton = null;

        if (this.state.items != null) {
            this.state.items.every(function(item, index) {
                items.push(
                    <ListItem
                    key={item.Id}
                    textTitle={this._getName(item)}
                    textDescription={item.attributes.type}
                    url={this.props.host + '/' + item.Id}
                    iconUrl={this._getImageUrl(item.attributes.type)}
                    />
                );

                return index < 6;
            }.bind(this));
        }

        if (this.state.items !== undefined) {
            goToButton = <GoTo target="Salesforce" canGoTo={this.state.items != null} url={this.props.host + '/home/home.jsp'}/>;
        }

        return (
            <div className="Items is-salesforce">
            {items}
            {goToButton}
            </div>
            );

    },
    _getName: function(item) {
        return item.Name || item.Title || item.CaseNumber || item.SolutionName || item.ContractNumber;
    },
    _getImageUrl: function(type) {
        switch (type) {
            case 'Account':
            case 'Approval':
            case 'Apps':
            case 'Article':
            case 'Calibration':
            case 'Campaign':
            case 'Canvas':
            case 'Case':
            case 'Chatterbox':
            case 'Coaching':
            case 'Concur':
            case 'Contact':
            case 'Contract':
            case 'Custom':
            case 'Dashboard':
            case 'Default':
            case 'Document':
            case 'Drafts':
            case 'Dropbox':
            case 'Email':
            case 'Empty':
            case 'Endorsement':
            case 'Event':
            case 'Evernote':
            case 'Feed':
            case 'Feedback':
            case 'File':
            case 'Forecast':
            case 'Goals':
            case 'Groups':
            case 'Insights':
            case 'Invoice':
            case 'Lead':
            case 'Link':
            case 'Note':
            case 'Opportunity':
            case 'Orders':
            case 'People':
            case 'Performance':
            case 'Photo':
            case 'Poll':
            case 'Portal':
            case 'Post':
            case 'Product':
            case 'Quotes':
            case 'Recent':
            case 'Record':
            case 'Report':
            case 'Solution':
            case 'Task':
            case 'Thanks':
            case 'Today':
            case 'Topic':
                return imagePath(type.toLowerCase());
            case 'User':
                return imagePath('avatar');
            case 'CollaborationGroup':
                return imagePath('groups');
            case 'ContentDocument':
                return imagePath('file');
            default:
                if (type.match(/__c$/)) { // custom object
                    return imagePath('generic_loading');
                }

                return null;
        }

        function imagePath(name) {
            return '../src/assets/img/' + name + '.svg';
        }
    }
});

module.exports = SalesforceItems;
