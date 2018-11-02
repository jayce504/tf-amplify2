import React, { Component } from "react";
import { Link } from "react-router-dom";

import { graphql, compose, withApollo } from "react-apollo";
import QueryAllClients from "../GraphQL/QueryAllClients";
import MutationDeleteClient from "../GraphQL/MutationDeleteClient";

class AllClients extends Component {

    state = {
        busy: false,
    }

    static defaultProps = {
        clients: [],
        deleteClient: () => null,
    }

    async handleDeleteClick(client, e) {
        e.preventDefault();

        if (window.confirm(`Are you sure you want to delete ${client.name} ?`)) {
            const { deleteClient } = this.props;

            await deleteClient(client);
        }
    }

    handleSync = async () => {
        const { client } = this.props;
        const query = QueryAllClients;

        this.setState({ busy: true });

        await client.query({
            query,
            fetchPolicy: 'network-only',
        });

        this.setState({ busy: false });
    }

    renderClient = (client) => (
        <Link to={`/client/${client.id}`} className="card" key={client.id}>
            <div className="content">
                <div className="header">{client.name}</div>
            </div>
            <div className="content">
                <p><i className="icon calendar"></i>{client.address}</p>
                <p><i className="icon clock"></i>{client.phoneNumber}</p>
                <p><i className="icon marker"></i>{client.allegedOffenses}</p>
                <p><i className="icon marker"></i>{client.courtDates}</p>
            </div>
            <div className="extra content">
                <i className="icon comment"></i> {client.comments.items.length} comments
            </div>
            <button className="ui bottom attached button" onClick={this.handleDeleteClick.bind(this, client)}>
                <i className="trash icon"></i>
                Delete
            </button>
        </Link>
    );

    render() {
        const { busy } = this.state;
        const { clients } = this.props;

        return (
            <div>
                <div className="ui clearing basic segment">
                    <h1 className="ui header left floated">All Clients</h1>
                    <button className="ui icon left basic button" onClick={this.handleSync} disabled={busy}>
                        <i aria-hidden="true" className={`refresh icon ${busy && "loading"}`}></i>
                        Sync with Server
                    </button>
                </div>
                <div className="ui link cards">
                    <div className="card blue">
                        <Link to="/newClient" className="new-event content center aligned">
                            <i className="icon add massive"></i>
                            <p>Create new client</p>
                        </Link>
                    </div>
                    {[].concat(clients).sort((a, b) => a.when.localeCompare(b.when)).map(this.renderClient)}
                </div>
            </div>
        );
    }

}

export default withApollo(compose(
    graphql(
        QueryAllClients,
        {
            options: {
                fetchPolicy: 'cache-first',
            },
            props: ({ data: { listClients = { items: [] } } }) => ({
                clients: listClients.items
            })
        }
    ),
    graphql(
        MutationDeleteClient,
        {
            options: {
                update: (proxy, { data: { deleteClient } }) => {
                    const query = QueryAllClients;
                    const data = proxy.readQuery({ query });

                    data.listClients.items = data.listClients.items.filter(client => client.id !== deleteClient.id);

                    proxy.writeQuery({ query, data });
                }
            },
            props: (props) => ({
                deleteClient: (client) => {
                    return props.mutate({
                        variables: { id: client.id },
                        optimisticResponse: () => ({
                            deleteClient: {
                                ...client, __typename: 'Client', comments: { __typename: 'CommentConnection', items: [] }
                            }
                        }),
                    });
                }
            })
        }
    )
)(AllClients));
