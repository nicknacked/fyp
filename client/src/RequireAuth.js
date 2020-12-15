import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default function (ComposedComponent) {

  class Authentication extends Component {
    
    render () {
      let local = localStorage.getItem('lms-token');
      if (local) {
          return <ComposedComponent {...this.props} />;
      }
      else {
        return <Redirect to="/login" />
      };
    }
  }
  
  return (Authentication);
}
