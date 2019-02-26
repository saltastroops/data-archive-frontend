import PropTypes from "prop-types";
import * as React from "react";
import styled from "styled-components";
import api from "../../api/api";
import { validateLoginField } from "../../util/LoginFormValidation";
import LoginInputField from "./LoginInputField";

/*
The login form which is responsible for authenticating th user into the data acrchive system.

Properties:
-----------
userInput : {
  password
    The password, which must have at least 7 characters.
  username
    The username, which must not contain upper case letters.
}

errors : []
  An array of error messages if any.
*/

interface ILoginFormState {
  errors: string[];
  userInput: {
    password: string;
    username: string;
  };
}

const LoginFormParent = styled.form.attrs({
  className: "column is-4 is-offset-4"
})`
  && {
    padding: 1px;
  }
`;

const Heading = styled.h1.attrs({
  className: "title is-3"
})`
  && {
    text-align: center;
    margin: 20px 0 20px 0;
  }
`;

const ErrorMessage = styled.p.attrs({
  className: "error tile"
})`
  && {
    text-align: left;
    margin: 3px 0 3px 0;
    padding: 2px 0 2px 0;
    background-color: hsl(348, 100%, 61%);
    color: white;
  }
`;

class LoginForm extends React.Component<ILoginFormState> {
  static contextTypes = {
    router: PropTypes.object
  };

  public state = {
    errors: [],
    logging: false,
    userInput: {
      password: "",
      username: ""
    }
  };

  onHandleSubmit = async (e: any) => {
    e.preventDefault();

    // Validates the user input fields
    const errors = validateLoginField((this.state as any).userInput);

    // Update the errors propetry of the state
    this.setState({ errors });

    // Check if there is an error, if there is abort signing up.
    if (errors.length) {
      return;
    }

    try {
      this.setState({
        logging: true
      });

      const login = await api.post("/auth/login", {
        password: (this.state as any).userInput.password,
        username: (this.state as any).userInput.username
      });

      if (login.data.success) {
        // TO BE REMOVED
        // Confirming user is authenticated
        const queryUser = await api.post("/", {
          query: `query { 
            user { 
              givenName 
            } 
          }`
        });

        this.setState({
          errors: [],
          logging: false,
          userInput: {
            password: "",
            username: ""
          }
        });

        // Redirect the user to the home page granted access to his own content
        this.context.router.history.push("/userpage");
      }
    } catch (error) {
      this.setState({
        logging: false
      });
      alert(error.response.data.message);
    }
  };

  onHandleInputChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    // Updating the userInput property of the state when input field value updates
    this.setState({
      userInput: {
        ...(this.state as any).userInput,
        [name]: value
      }
    });
  };

  render() {
    const { errors } = this.state;
    const { password, username } = this.state.userInput;
    return (
      <LoginFormParent onSubmit={e => this.onHandleSubmit(e)}>
        <Heading>Login Here</Heading>

        {errors.map((err: string) => (
          <ErrorMessage key={err}>Error: {err}</ErrorMessage>
        ))}

        <LoginInputField
          name={"username"}
          label={"Username"}
          onChange={this.onHandleInputChange}
          type={"text"}
          value={username}
        />

        <LoginInputField
          name={"password"}
          label={"Password"}
          onChange={this.onHandleInputChange}
          type={"password"}
          value={password}
        />

        <button className="signIn button is-success is-fullwidth is-rounded">
          {(this.state as any).logging ? "Signing in..." : "Sign in"}
        </button>
      </LoginFormParent>
    );
  }
}

export default LoginForm;
