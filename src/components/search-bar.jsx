/** @jsx React.DOM */

'use strict';

var React = require("react/addons");
var cx = React.addons.classSet;

var SALESFORCE = "salesforce";
var CHATTER = "chatter";
var GOOGLE = "google";

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
        var buttonClasses = cx({
            'SearchBar-button': true,
            'is-salesforce': this.props.mode === SALESFORCE,
            'is-chatter': this.props.mode === CHATTER,
            'is-google': this.props.mode === GOOGLE
        });

        return (
            <form className="SearchBar" onSubmit={this.handleSubmit}>
                <input className="SearchBar-input" aria-hidden="true" autoComplete="off" value={this.state.value} onChange={this.handleChange}/>
                <button className={buttonClasses} type="submit"><i className="fa fa-search"></i></button>
            </form>
            );
    }
});

module.exports = SearchBar;


