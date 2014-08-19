/** @jsx React.DOM */

'use strict';

var React = require("react");
var PostItem = require("./post-item.jsx");
var GoTo = require("./go-to.jsx");

var ChatterItems = React.createClass({
    getInitialState: function() {
        return {items: undefined};
    },
    componentDidMount: function() {
        chrome.runtime.sendMessage({type: "getChatterItems"}, function(response) {
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
                items.push(<PostItem key={item.id} post={item} url={this.props.host + '/' + item.id}/>);

                return index < 2;
            }.bind(this));
        }

        if (this.state.items === null) {
            var goToButton = <GoTo text="Log in to Chatter" url={this.props.host + '/_ui/core/chatter/ui/ChatterPage'}/>;
        } else if (this.state.items !== undefined) {
            var goToButton = <GoTo text="Go to Chatter" url={this.props.host + '/_ui/core/chatter/ui/ChatterPage'}/>;
        }

        return (
            <div className="Items is-chatter">
            {items}
            {goToButton}
            </div>
            );
    }
});

module.exports = ChatterItems;