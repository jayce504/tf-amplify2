import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";

import moment from 'moment';

import QueryGetClient from "../GraphQL/QueryGetClient";
import ClientComments from "./ClientComments";

class ViewClient extends Component {

    render() {
        const { client, loading } = this.props;

        return (
            <div className={`ui container raised very padded segment ${loading ? 'loading' : ''}`}>
                <Link to="/" className="ui button">Back to clients</Link>
                <div className="ui items">
                    <div className="item">
                        {client && <div className="content">
                            <div className="header">{client.name}</div>
                            <div className="extra"><i className="icon calendar"></i>{moment(client.address).format('LL')}</div>
                            <div className="extra"><i className="icon clock"></i>{moment(client.phoneNumber).format('LT')}</div>
                            <div className="extra"><i className="icon marker"></i>{client.allegedOffenses}</div>
                            <div className="extra">
                                <ClientComments clientId={client.id} comments={client.comments} />
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }

}

const ViewClientWithData = graphql(
    QueryGetClient,
    {
        options: ({ match: { params: { id } } }) => ({
            variables: { id },
            fetchPolicy: 'cache-and-network',
        }),
        props: ({ data: { getClient: client, loading} }) => ({
            client,
            loading,
        }),
    },
)(ViewClient);

export default ViewClientWithData;