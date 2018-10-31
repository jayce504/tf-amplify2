import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import NavBar from './components/navBar.jsx';
import Logout from './components/logout';
import Home from './components/home'
import Client from './components/Client'
import "semantic-ui-css/semantic.min.css";
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

import NewEvent from './components/NewEvent';
import ViewEvent from './components/ViewEvent';
import { ApolloProvider } from 'react-apollo';


const App = () => (
  <div>
  <ApolloProvider client = {Client}>
  <NavBar />
  <Router>
    <div>
      <Route path="/" component={Home} />
      <Route path="/event/:id" component={ViewEvent} />
      <Route path="/newEvent" component={NewEvent} />
      <Route path="/logout" component={Logout} />
    </div>
  </Router>
  </ApolloProvider>
  </div>
);

export default withAuthenticator(App)

