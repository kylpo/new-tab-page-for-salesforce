/** @jsx React.DOM */

'use strict';

var React = require("react/addons");
var cx = React.addons.classSet;

var DomainPicker = React.createClass({
    getInitialState: function() {
        return {
            cookies: null,
            menuOpen: false
        };
    },
    componentDidMount: function() {
        this._getItems();
    },
    componentWillReceiveProps: function() {
        this._getItems();
    },
    _getItems: function() {
        chrome.runtime.sendMessage({type: "getCookies"}, function(response) {
            if (this.isMounted()) {
                // if no domain is selected, and only one cookie was found, auto-select it
                // else, proceed as normal by setting cookies state
                if (this.props.domain == null && response.length === 1) {
                    this.props.handleDomainChange(response[0].domain);
                } else {
                    this.setState({cookies: response});
                }
            }
        }.bind(this));
    },
    onClickItem: function(cookie) {
        this.setState({menuOpen: false}, function() {
            this.props.handleDomainChange(cookie.domain);
        });
    },
    openMenu: function() {
        // only open if there are cookies to show
        if (this.state.cookies != null) {
            this.setState({menuOpen: !this.state.menuOpen});
        }
    },
    render: function() {
        var buttonClasses = cx({
            "DomainPicker-button": true,
            "is-active": this.state.menuOpen && this.props.domain != null, // Don't show active if no domain selected
            "is-alert": this.props.domain == null
        });
        var menuClasses = cx({
            "DomainPicker-menu": true,
            // open if menuOpen or no domain selected, but there are domains to choose from
            "is-open": this.state.menuOpen || (this.props.domain == null && this.state.cookies != null)
        });
        var items = [];
        var button;

        if (this.state.cookies != null) {
            if (this.props.domain != null) {
                button = <button className={buttonClasses} onClick={this.openMenu} title={this.props.domain}>{this.props.domain}</button>
            } else {
                button = <button className={buttonClasses} onClick={this.openMenu} title='Choose domain'>Choose domain</button>
            }

            this.state.cookies.forEach(function(cookie) {
                if (cookie.domain !== this.props.domain) { //don't add the domain that is already selected
                    items.push(
                        <li className='DomainPicker-menuItem' onClick={this.onClickItem.bind(null, cookie)} title={cookie.domain}>
                        <span className='DomainPicker-menuItemText'>{cookie.domain}</span>
                        </li>
                    );
                }
            }.bind(this));
        }

        return (
            <div className="DomainPicker">
            {button}
            <ul className={menuClasses}>
            {items}
            </ul>
                </div>
            );
    }
});

module.exports = DomainPicker;