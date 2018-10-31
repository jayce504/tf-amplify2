import React from 'react';
import "semantic-ui-css/semantic.min.css";
import 'react-datepicker/dist/react-datepicker.css';
import Client from './Client';
import { ApolloProvider } from "react-apollo";
import { Rehydrated } from "aws-appsync-react";
// import './App.css';
import App from '../App';

  const WithProvider = () => (
    <ApolloProvider client={Client}>
      <Rehydrated>
        <App />
      </Rehydrated>
    </ApolloProvider>
  );
  
  export default WithProvider;
