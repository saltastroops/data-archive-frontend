import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import styled from "styled-components";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";

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
    return (
      <Router>
        <div>
          <Route
            exact={true}
            path="/"
            render={() => <Heading>Main Page</Heading>}
          />
          <Route exact={true} path="/register" component={RegistrationForm} />
          <Route exact={true} path="/login" component={LoginForm} />
        </div>
      </Router>
    );
  }
}

export default App;
