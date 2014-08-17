/** @jsx React.DOM */

'use strict';

var React = require("react");

var PostItem = React.createClass({
    render: function() {
        var post = this.props.post;

        var source = post.actor.name === post.parent.name ?
            post.actor.name :
            post.actor.name + ' \u2014 ' + post.parent.name;

        var likes = post.likes.total > 0 ?
            <span className="PostMetaData-item">{post.likes.total + ' '}<span className="fa fa-thumbs-o-up"/></span> :
            "";

        var comments = post.comments.total > 0 ?
            <span className="PostMetaData-item">{post.comments.total + ' '}<span className="fa fa-comment-o"/></span> :
            "";

        var body = [];
        if (post.body.text != null) {
            var bodySegments = post.body.text.split(/(?:\r\n|\r|\n)/);

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
    }
});

module.exports = PostItem;