import React, { Component } from "react";
import { Link } from "react-router-dom";

import { v4 as uuid } from "uuid";
import { graphql } from "react-apollo";
import QueryAllClients from "../GraphQL/QueryAllClients";
import QueryGetClient from "../GraphQL/QueryGetClient";
import MutationCreateClient from "../GraphQL/MutationCreateClient";

import DatePicker from 'react-datepicker';
import moment from 'moment';

import DateTimePickerCustomInput from "./DateTimePickerCustomInput";

class NewClient extends Component {

    static defaultProps = {
        createClient: () => null,
    }

    state = {
        client: {
            name: '',
            address: '',
            phoneNumber: '',
            allegedOffenses: '',
            courtDates: ''
        }
    };

    handleChange(field, { target: { value } }) {
        const { client } = this.state;

        client[field] = value;

        this.setState({ client });
    }

    handleDateChange(field, value) {
        this.handleChange(field, { target: { value: value.format() } });
    }

    handleSave = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        const { createClient, history } = this.props;
        const { client } = this.state;

        await createClient({ ...client });

        history.push('/');
    }

    render() {
        const { client } = this.state;

        return (
            <div>
            <div className="ui container raised very padded segment">
                <h1 className="ui header">Create a Client</h1>
                <div className="ui form">
                    <div className="field required eight wide">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" value={client.name} onChange={this.handleChange.bind(this, 'name')} />
                    </div>
                    <div className="field required eight wide">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" value={client.address} onChange={this.handleChange.bind(this, 'address')} />
                    </div>
                    <div className="field required eight wide">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="text" id="phoneNumber" value={client.phoneNumber} onChange={this.handleChange.bind(this, 'phoneNumber')} />
                    </div>
                    <div className="field required eight wide">
                    <label htmlFor="allegedOffenses">Alleged Offenses</label>
                    <input type="text" id="allegedOffenses" value={client.allegedOffenses} onChange={this.handleChange.bind(this, 'allegedOffenses')} />
                    </div>
                    </div>
                    <div className="field required eight wide">
                    <label htmlFor="courtDates">Hearing Dates</label>
                    <input type="text" id="courtDates" value={client.courtDates} onChange={this.handleChange.bind(this, 'courtDates')} />
                    </div>
                        <DatePicker
                            className="ui container"
                            customInput={<DateTimePickerCustomInput />}
                            id="when"
                            selected={moment(client.courtDates)}
                            onChange={this.handleDateChange.bind(this, 'courtDates')}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            showTimeSelect
                            timeFormat="hh:mm a"
                            timeIntervals={15}
                            dateFormat="LL LT"
                        />
                    </div>
                    <div className="ui buttons">
                        <Link to="/" className="ui button">Cancel</Link>
                        <div className="or"></div>
                        <button className="ui positive button" onClick={this.handleSave}>Save</button>
                    </div>
                    </div>
        )
        }
    }

export default graphql(
    MutationCreateClient,
    {
        props: (props) => ({
            createClient: (client) => {
                return props.mutate({
                    update: (proxy, { data: { createClient } }) => {
                        // Update QueryAllEvents
                        const query = QueryAllClients;
                        const data = proxy.readQuery({ query });

                        data.listClients.items = [...data.listClients.items.filter(e => e.id !== createClient.id), createClient];

                        proxy.writeQuery({ query, data });

                        // Create cache entry for QueryGetEvent
                        const query2 = QueryGetClient;
                        const variables = { id: createClient.id };
                        const data2 = { getClient: { ...createClient } };

                        proxy.writeQuery({ query: query2, variables, data: data2 });
                    },
                    variables: client,
                    optimisticResponse: () => ({
                        createClient: {
                            ...client, id: uuid(), __typename: 'Client', comments: { __typename: 'CommentConnection', items: [] }
                        }
                    }),
                })
            }
        })
    }
)(NewClient);
