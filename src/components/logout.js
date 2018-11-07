import React from 'react';
import { Component } from 'react'
import { Auth } from "aws-amplify";

class Logout extends Component {
  componentDidMount() {
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));

    // By doing this, you are revoking all the auth tokens(id token, access token and refresh token)
    // which means the user is signed out from all the devices
    // Note: although the tokens are revoked, the AWS credentials will remain valid until they expire (which by default is 1 hour)
    Auth.signOut({ global: true })
      .then(data => console.log(data))
      .catch(err => console.log(err));

    window.location = "https://tfhomepage.herokuapp.com/";
  }

  render() {
    return <h1>You have been logged out.</h1>;
  }
}

export default Logout;
