import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import App from "../App";
import { connect } from "react-redux";
import Login from "../views/login/login";
import Home from "../views/home/home";

//Components

const AppRoutes = (state) => (
  <App>
    <BrowserRouter>
      <Route
        render={(location) => (
          <Switch>
            {state.status !== "logged" && (
              <>
                <Route path="/" component={Login} />
              </>
            )}
            {state.status === "logged" && (
              <>
                <Route path="/" component={Home} />
              </>
            )}
          </Switch>
        )}
      />
    </BrowserRouter>
  </App>
);

const mapStateToProps = (state) => ({
  status: state.status,
  user: state.user,
});

export default connect(mapStateToProps)(AppRoutes);
