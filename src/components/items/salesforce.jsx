/** @jsx React.DOM */

'use strict';

var React = require("react");
var ListItem = require("./list-item.jsx");
var GoTo = require("./go-to.jsx");

var SalesforceItems = React.createClass({
    render: function() {
        var items = [];

        if (this.props.items != null) {
            this.props.items.every(function(item, index) {
                items.push(
                    <ListItem
                    key={item.Id}
                    textTitle={item.Name || item.Title}
                    textDescription={item.attributes.type}
                    url={this.props.host + '/' + item.Id}
                    iconUrl={this._getImageUrl(item.attributes.type)}
                    />
                );

                return index < 6;
            }.bind(this));
        }

        return (
            <div className="Items is-salesforce">
            {items}
                <GoTo target="Salesforce" url={this.props.host + '/home/home.jsp'}/>
            </div>
            );

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
