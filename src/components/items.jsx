/** @jsx React.DOM */

'use strict';

var React = require("react");

var Items = React.createClass({
    getInitialState: function() {
        return {
            flipped: false,
            unflipped: false,
            selectedAction: null
        }
    },
    componentDidMount: function() {

    },
    componentWillUnmount: function() {

    },
    render: function() {
        return (
            <div className="items">
            </div>
            );
    }
});

module.exports = Items;
