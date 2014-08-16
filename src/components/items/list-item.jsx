/** @jsx React.DOM */

'use strict';

var React = require("react");

var ListItem = React.createClass({
    render: function() {
        console.log(this.props);
//        <span src={this.props.iconUrl}/>
        return (
            <a href={this.props.url}>
                <div className="Item">
                    <div className="Item-icon">
                    <img className="ItemIcon-img" src={this.props.iconUrl}/>
                </div>
                <div className="ItemText">
                    <div className="ItemText-title">
                    {this.props.textTitle}
                    </div>
                    <div className="ItemText-description">
                    {this.props.textDescription}
                    </div>
                </div>
                    </div>
            </a>
            );
    }
});

module.exports = ListItem;