import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import NavBar from './components/navBar.jsx';
import Logout from './components/logout';
import Home from './components/home'
import client from './components/Client'
import "semantic-ui-css/semantic.min.css";
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

import NewClient from './components/NewClient';
import ViewClient from './components/ViewClient';
import { ApolloProvider } from 'react-apollo';

const App = () => (
  <div>
  <NavBar />
  <ApolloProvider client = {client}>
  <Router>
    <div>
      <Route exact={true} path="/" component={Home} />
      <Route path="/client/:id" component={ViewClient} />
      <Route path="/newClient" component={NewClient} />
      <Route path="/logout" component={Logout} />
    </div>
  </Router>
  </ApolloProvider>
  </div>
);

export default withAuthenticator(App)

