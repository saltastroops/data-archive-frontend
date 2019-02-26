import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled from "styled-components";
import LoginForm from "./components/LoginForm/LoginForm";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";

const Heading = styled.h1.attrs({
  className: "title is-3"
})`
  && {
    text-align: center;
    margin: 20px 0 20px 0;
  }
`;

class App extends React.Component {
  public render() {
    const initUserInput = {
      affiliation: "",
      confirmPassword: "",
      email: "",
      familyName: "",
      givenName: "",
      password: "",
      username: ""
    };
    return (
      <Router>
        <div>
          <Heading>SALT/SAAO Data Archive</Heading>
          <Route path="/" exact={true} component={RegistrationForm} />
          <Route path="/login" exact={true} component={LoginForm} />
          <Route
            path="/userpage"
            exact={true}
            render={props => <Heading>You are logged in</Heading>}
          />
        </div>
      </Router>
    );
  }
}

export default App;
