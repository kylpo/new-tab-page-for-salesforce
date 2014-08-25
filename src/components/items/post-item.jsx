/** @jsx React.DOM */

'use strict';

var React = require("react");

var PostItem = React.createClass({
    componentDidMount: function() {
        emojify.setConfig({
            img_dir: 'assets/img/emoji'
        });

        emojify.run(this.getDOMNode());
    },
    render: function() {
        var post = this.props.post;

        var source = post.actor.name === post.parent.name ?
            this._htmlDecode(post.actor.name) :
            this._htmlDecode(post.actor.name + ' \u2014 ' + post.parent.name);

        var likes = post.likes.total > 0 ?
            <span className="PostMetaData-item">{post.likes.total + ' '}<span className="fa fa-thumbs-o-up"/></span> :
            "";

        var comments = post.comments.total > 0 ?
            <span className="PostMetaData-item">{post.comments.total + ' '}<span className="fa fa-comment-o"/></span> :
            "";

        var body = [];
        if (post.body.text != null) {
            var bodySegments = this._htmlDecode(post.body.text).split(/(?:\r\n|\r|\n)/);

            bodySegments.forEach(function (segment, index) {
                body.push(segment);

                if (bodySegments.length > index + 1) {
                    body.push(<br/>);
                }
            });
        }

        return (
            <a className="ItemLink" href={this.props.url}>
                <div className="Post">
                    <img className="Post-img" src={post.photoUrl}/>
                    <div className="Post-header">
                        <div className="PostHeader-topBar">
                            <div className="TopBar-source">
                            {source}
                            </div>
                            <div className="TopBar-postMetaData">
                            {[likes, comments]}
                            </div>
                        </div>
                        <div className="PostHeader-bottomBar">
                        {post.relativeCreatedDate}
                        </div>
                    </div>
                    <div className="Post-message">
                    {body}
                    </div>
                </div>
            </a>
            );
    },
    _htmlDecode: function(input) {
        if (input.match(/&amp;|&lt;|&gt;|&quot;|&#39;/g)) {
            return String(input)
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&nbsp;/g, ' ')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
        }

        return input;
    }
});

module.exports = PostItem;