import PropTypes from "prop-types";
import * as React from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import { SIGNUP_MUTATION } from "../../graphql/Mutations";
import { validateRegistrationField } from "../../util/RegistrationFormValidation";
import RegistrationInputField from "./RegistrationInputField";

/*
The registration form responsible for creating the new user data acrchive account.
Properties:
-----------
userInput : {
  affiliation
    The affiliation of the user, such as a university or an institute.
  confirmPassword
    A matching password that must match with the original password.
  email
    Email address. This will be stored in lower case.
  familyName
    The family name (surname).
  givenName
    The given name (first name).
  password
    The password, which must have at least 7 characters.
  username
    The username, which must not contain upper case letters.
}
errors : []
  An array of error messages if any.
*/

interface IRegistrationFormState {
  errors: {
    affiliation: string;
    confirmPassword: string;
    email: string;
    familyName: string;
    givenName: string;
    password: string;
    username: string;
  };
  userInput: {
    affiliation: string;
    confirmPassword: string;
    email: string;
    familyName: string;
    givenName: string;
    password: string;
    username: string;
  };
}

const RegistrationFormParent = styled.form.attrs({
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

class RegistrationForm extends React.Component<IRegistrationFormState> {
  // Setting context prop type for accessing router field
  static contextTypes = {
    router: PropTypes.object
  };

  public state = {
    errors: {
      affiliation: "",
      confirmPassword: "",
      email: "",
      familyName: "",
      givenName: "",
      password: "",
      username: ""
    },
    userInput: {
      affiliation: "",
      confirmPassword: "",
      email: "",
      familyName: "",
      givenName: "",
      password: "",
      username: ""
    }
  };

  onHandleSubmit = async (e: React.FormEvent<EventTarget>, signup: any) => {
    e.preventDefault();

    // Validates the user input fields
    const errors = validateRegistrationField(this.state.userInput);

    // Update the errors propetry of the state
    this.setState({ errors });

    // Check if there is an error, if there is abort signing up.
    if (
      errors.affiliation ||
      errors.confirmPassword ||
      errors.email ||
      errors.familyName ||
      errors.givenName ||
      errors.password ||
      errors.username
    ) {
      return;
    }

    try {
      // If all fields are validated, sign up
      const res = await signup();
      // Reset the state when registering succeeded
      this.setState({
        userInput: {
          affiliation: "",
          confirmPassword: "",
          email: "",
          familyName: "",
          givenName: "",
          password: "",
          username: ""
        }
      });

      alert("Successfully registered, Login using your username and password");
      this.context.router.history.push("/login");
    } catch (error) {
      return;
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
    const { errors } = this.state;
    const {
      affiliation,
      confirmPassword,
      email,
      familyName,
      givenName,
      password,
      username
    } = this.state.userInput;

    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state.userInput}>
        {(signup, { loading, error }) => {
          return (
            <RegistrationFormParent
              onSubmit={e => this.onHandleSubmit(e, signup)}
            >
              <Heading>Create your account</Heading>
              {error ? <ErrorMessage>{error.message}</ErrorMessage> : null}

              <RegistrationInputField
                error={errors.givenName}
                loading={loading}
                name={"givenName"}
                label={"Given name (first name)"}
                onChange={this.onHandleInputChange}
                type={"text"}
                value={givenName}
              />
              <RegistrationInputField
                error={errors.familyName}
                loading={loading}
                name={"familyName"}
                label={"Family name (surname)"}
                onChange={this.onHandleInputChange}
                type={"text"}
                value={familyName}
              />
              <RegistrationInputField
                error={errors.email}
                loading={loading}
                name={"email"}
                label={"Email address"}
                onChange={this.onHandleInputChange}
                type={"text"}
                value={email}
              />
              <RegistrationInputField
                error={errors.username}
                loading={loading}
                name={"username"}
                label={"Username"}
                onChange={this.onHandleInputChange}
                type={"text"}
                value={username}
              />
              <RegistrationInputField
                error={errors.affiliation}
                loading={loading}
                name={"affiliation"}
                label={"Affiliation"}
                placeholder={"E.g. University of Cape Town"}
                onChange={this.onHandleInputChange}
                type={"text"}
                value={affiliation}
              />
              <RegistrationInputField
                error={errors.password}
                loading={loading}
                name={"password"}
                label={"Password"}
                placeholder={"At least 7 characters"}
                onChange={this.onHandleInputChange}
                type={"password"}
                value={password}
              />
              <RegistrationInputField
                error={errors.confirmPassword}
                loading={loading}
                name={"confirmPassword"}
                label={"Re-enter password "}
                onChange={this.onHandleInputChange}
                type={"password"}
                value={confirmPassword}
              />
              <button
                className="signUp button is-success is-fullwidth is-rounded"
                disabled={loading}
                type={"submit"}
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </RegistrationFormParent>
          );
        }}
      </Mutation>
    );
  }
}

export default RegistrationForm;
