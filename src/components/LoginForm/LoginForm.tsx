import * as React from "react";
import styled from "styled-components";
import api from "../../api/api";
import { validateLoginField } from "../../util/LoginFormValidation";
import LoginInputField from "./LoginInputField";
import { Redirect } from "react-router";

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
  errors: {
    password: string;
    responseError?: string;
    username: string;
  };
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
  public state = {
    errors: {
      password: "",
      responseError: "",
      username: ""
    },
    logged: false,
    loading: false,
    userInput: {
      password: "",
      username: ""
    }
  };

  onHandleSubmit = async (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();

    // Validates the user input fields
    const errors = validateLoginField(this.state.userInput);

    // Update the errors propetry of the state
    this.setState({ errors });

    // Check if there is an error, if there is abort signing in.
    if (errors.password || errors.username) {
      return;
    }

    try {
      this.setState({
        loading: true
      });

      const login = await api.auth.login({
        ...this.state.userInput
      });

      if (login.data.success) {
        // TO BE REMOVED
        // Confirming user is authenticated
        const user = await api.user.queryUser();

        console.log(user);

        this.setState({
          errors: {
            password: "",
            responseError: "",
            username: ""
          },
          loading: false,
          logged: true,
          userInput: {
            password: "",
            username: ""
          }
        });
      }
    } catch (error) {
      this.setState({
        errors: {
          ...this.state.errors,
          responseError: error.message
        },
        loading: false
      });
    }
  };

  onHandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    // Updating the userInput property of the state when input field value updates
    this.setState({
      userInput: {
        ...this.state.userInput,
        [name]: value
      }
    });
  };

  render() {
    const { errors, loading, logged } = this.state;
    const { password, username } = this.state.userInput;
    if (logged) return <Redirect to={"/"} />;
    return (
      <LoginFormParent onSubmit={e => this.onHandleSubmit(e)}>
        <Heading>Login Here</Heading>
        {errors.responseError ? (
          <ErrorMessage>{errors.responseError}</ErrorMessage>
        ) : null}
        <LoginInputField
          error={errors.username}
          loading={loading}
          name={"username"}
          label={"Username"}
          onChange={this.onHandleInputChange}
          type={"text"}
          value={username}
        />

        <LoginInputField
          error={errors.password}
          loading={loading}
          name={"password"}
          label={"Password"}
          onChange={this.onHandleInputChange}
          type={"password"}
          value={password}
        />

        <button
          disabled={loading}
          className="signIn button is-success is-fullwidth is-rounded"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </LoginFormParent>
    );
  }
}

export default LoginForm;
