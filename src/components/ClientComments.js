import React, { Component } from "react";
import { graphql } from "react-apollo";

import moment from 'moment';

import QueryGetClient from "../GraphQL/QueryGetClient";
import SubsriptionClientComments from "../GraphQL/SubsriptionClientComments";

import NewComment from "./NewComment";

class ClientComments extends Component {

    subscription;

    componentDidMount() {
        this.subscription = this.props.subscribeToComments();
    }

    componentWillUnmount() {
        this.subscription();
    }

    renderComment = (comment) => {
        return (
            <div className="comment" key={comment.commentId}>
                <div className="avatar"><i className="icon user circular"></i></div>
                <div className="content">
                    <div className="text">
                        {comment.content}
                    </div>
                    <div className="metadata">{moment(comment.createdAt).format('LL, LT')}</div>
                </div>
            </div>
        );
    }

    render() {
        const { comments: { items }, clientId } = this.props;

        return (
            <div className="ui items">
                <div className="item">
                    <div className="ui comments">
                        <h4 className="ui dividing header">Comments</h4>
                        {[].concat(items).sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map(this.renderComment)}
                        <NewComment clientId={clientId} />
                    </div>
                </div>
            </div>
        );
    }

}

const ClientCommentsWithData = graphql(
    QueryGetClient,
    {
        options: ({ clientId: id }) => ({
            fetchPolicy: 'cache-first',
            variables: { id }
        }),
        props: props => ({
            comments: props.data.getClient ? props.data.getClient.comments : { items: [] },
            subscribeToComments: () => props.data.subscribeToMore({
                document: SubsriptionClientComments,
                variables: {
                    clientId: props.ownProps.clientId,
                },
                updateQuery: (prev, { subscriptionData: { data: { subscribeToClientComments } } }) => {
                    const res = {
                        ...prev,
                        getClient: {
                            ...prev.getClient,
                            comments: {
                                __typename: 'CommentConnections',
                                ...prev.getClient.comments,
                                items: [
                                    ...prev.getClient.comments.items.filter(c => c.commentId !== subscribeToClientComments.commentId),
                                    subscribeToClientComments,
                                ]
                            }
                        }
                    };

                    return res;
                }
            })
        }),
    },
)(ClientComments);

export default ClientCommentsWithData;