import React from 'react';
import "semantic-ui-css/semantic.min.css";
import 'react-datepicker/dist/react-datepicker.css';
import { Rehydrated } from "aws-appsync-react";
import './App.css';
import App from '../App';

  const WithProvider = () => (
      <Rehydrated>
        <App />
      </Rehydrated>
  );
  
  export default WithProvider;
