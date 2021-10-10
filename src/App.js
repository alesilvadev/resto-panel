import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./App.css";
import "react-notifications-component/dist/theme.css";
import ReactNotification from "react-notifications-component";
import './utils/styles.scss';

class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
  };

  render() {
    const { children } = this.props;
    return (
      <div className="App">
        <ReactNotification />
        {children}
      </div>
    );
  }
}

export default App;
