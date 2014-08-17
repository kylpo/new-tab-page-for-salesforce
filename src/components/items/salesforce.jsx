/** @jsx React.DOM */

'use strict';

var React = require("react");
var ListItem = require("./list-item.jsx");

var SalesforceItems = React.createClass({
    render: function() {
        var items = [];

        if (this.props.items != null) {
            this.props.items.forEach(function(item) {
                items.push(
                    <ListItem
                    textTitle={item.Name}
                    textDescription={item.attributes.type}
                    url={this.props.host + '/' + item.Id}
                    iconUrl={'../src/assets/img/' + this._getImageName(item.attributes.type) + '.svg'}
                    />
                );

            }.bind(this));
        }

        return (
            <div className="Items is-salesforce">
            {items}
            </div>
            );

    },
    _getImageName: function(type) {
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
                return type.toLowerCase();
            case 'User':
                return 'avatar';
            case 'CollaborationGroup':
                return 'groups';
            default:
                return 'generic_loading';
        }

    }
});

module.exports = SalesforceItems;
