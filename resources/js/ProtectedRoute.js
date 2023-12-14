import React, { Component } from 'react'
import { Redirect, Route} from "react-router-dom";
import {connect} from 'react-redux'

const ProtectedRoute= ({ component:Component, ...rest })=>{

    return (
      <Route
        {...rest}
        render={props =>
          rest.loggedIn ? (
            <Component {...props}/>
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
  const mapStateToProps=state=>{
    return {
      loggedIn:state.auth.loggedIn
    }
  }
  export default connect(mapStateToProps)(ProtectedRoute);