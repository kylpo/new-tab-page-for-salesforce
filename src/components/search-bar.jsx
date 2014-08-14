/** @jsx React.DOM */

'use strict';

var React = require("react");

var SearchBar = React.createClass({
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
            <div className="searchBar">
            </div>
            );
    }
});

module.exports = SearchBar;

