import React, { Component } from "react";
import { graphql } from "react-apollo";
import { v4 as uuid } from "uuid";

import MutationCommentOnClient from "../GraphQL/MutationCommentOnClient";
import QueryGetClient from "../GraphQL/QueryGetClient";
import moment from "moment";

class NewComment extends Component {

    static defaultProps = {
        createComment: () => null,
    }

    static defaultState = {
        comment: {
            content: '',
        },
        loading: false,
    };

    state = NewComment.defaultState;

    handleSubmit = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const { comment } = this.state;
        const { clientId, createComment } = this.props;

        this.setState({ loading: true });

        await createComment({
            ...comment,
            clientId,
            createdAt: moment.utc().format(),
        });

        this.setState(NewComment.defaultState);
    }

    handleChange = ({ target: { value: content } }) => {
        this.setState({ comment: { content } });
    }

    render() {
        const { comment, loading } = this.state;
        return (
            <form className="ui reply form">
                <div className="field">
                    <textarea value={comment.content} onChange={this.handleChange} disabled={loading}></textarea>
                </div>
                <button className={`ui blue labeled submit icon button ${loading ? 'loading' : ''}`}
                    disabled={loading} onClick={this.handleSubmit}>
                    <i className="icon edit"></i>
                    Add Comment
                </button>
            </form>
        );
    }
}

const NewCommentWithData = graphql(
    MutationCommentOnClient,
    {
        options: props => ({
            update: (proxy, { data: { commentOnClient } }) => {
                const query = QueryGetClient;
                const variables = { id: commentOnClient.clientId };
                const data = proxy.readQuery({ query, variables });

                data.getClient = {
                    ...data.getClient,
                    comments: {
                        ...data.getClient.comments,
                        items: [
                            ...data.getClient.comments.items.filter(c => c.commentId !== commentOnClient.commentId),
                            commentOnClient,
                        ]
                    }
                };

                proxy.writeQuery({ query, data });
            },
        }),
        props: props => ({
            createComment: (comment) => {
                return props.mutate({
                    variables: { ...comment },
                    optimisticResponse: { commentOnClient: { ...comment, __typename: 'Comment', commentId: uuid() } },
                });
            }
        })
    }
)(NewComment);

export default NewCommentWithData;