import React, { Component, useEffect } from 'react'
import { Redirect, Route } from "react-router-dom";
import { connect } from 'react-redux'
import Cookies from 'js-cookie';
import Axios from 'axios';
import { public_url } from './config';
import { logout } from './services/auth';

const GuestRoute = ({ component: Component, setLogin, ...rest }) => {
  const token = Cookies.get('token')
  console.log("Token", token)
  useEffect(() => {
    if (token) {
      Axios.post(public_url + 'api/auth/me').then((res) => {
        setLogin(res.data)
        console.log(res.data)
      }).catch((e) => {
        logout()
      });
    }
  }, [])

  return (
    <Route
      {...rest}
      render={props =>
        !rest.loggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/dashboard",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setLogin: (user) => dispatch({ type: "SET_LOGIN", payload: user })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(GuestRoute);