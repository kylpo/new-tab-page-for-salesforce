/** @jsx React.DOM */

'use strict';

var React = require("react");

var SearchBar = React.createClass({
    getInitialState: function() {
        return {
            value: ""
        }
    },
    handleChange: function(e) {
        this.setState({value: event.target.value});
    },
    handleSubmit: function(e) {
        this.props.onSubmit(e, this.state.value);
    },
    render: function() {
        return (
            <form className="SearchBar" onSubmit={this.handleSubmit}>
                <input className="SearchBar-input" aria-hidden="true" autoComplete="off" value={this.state.value} onChange={this.handleChange}/>
                <button className="SearchBar-button" type="submit"><i className="fa fa-search"></i></button>
            </form>
            );
    }
});

module.exports = SearchBar;


