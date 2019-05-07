import gql from "graphql-tag";
import * as React from "react";
import { Mutation, Query } from "react-apollo";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import InputField from "./basicComponents/InputField";
import Message from "./basicComponents/Message";

const Parent = styled.form.attrs({
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

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      email
    }
  }
`;

const VERIFY_TOKEN_QUERY = gql`
  query VERIFY_TOKEN_QUERY($token: String!) {
    verifyPasswordResetToken(token: $token) {
      success
      message
    }
  }
`;

class ResetPasswordForm extends React.Component<any, any> {
  state = {
    confirmReset: false,
    errors: {
      confirmPassword: "",
      password: ""
    },
    user: {
      email: undefined
    },
    userInput: {
      confirmPassword: "",
      password: "",
      token: window.location.pathname
        .replace("/auth/reset-password/", "")
        .trim()
    }
  };
  changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({
      userInput: {
        ...this.state.userInput,
        [name]: value,
        errors: {
          password: ""
        }
      }
    });
  };

  submitReset = async (e: React.FormEvent<EventTarget>, resetPassword: any) => {
    e.preventDefault();

    this.setState({ errors: { password: "", confirmPassword: "" } });
    if (
      this.state.userInput.confirmPassword !== this.state.userInput.password
    ) {
      this.setState({
        errors: { password: "Password do not match" }
      });
      return;
    }
    try {
      await resetPassword();
      this.setState({ confirmReset: true });
    } catch (e) {
      this.setState({
        errors: { password: e.message.replace("GraphQL error: ", "") }
      });
      return;
    }
  };

  public render() {
    const { confirmPassword, password } = this.state.userInput;
    const { confirmReset, userInput } = this.state;
    const { token } = this.props.match.params;
    const userError = this.state.errors.password;

    if (confirmReset) {
      return <Redirect to={"/login"} />;
    }

    return (
      <Query query={VERIFY_TOKEN_QUERY} variables={{ token }}>
        {({ data }) => {
          if (data.verifyPasswordResetToken) {
            if (!data.verifyPasswordResetToken.success) {
              return (
                <>
                  <Message
                    message={"Password reset link is expired or it is invalid."}
                    type={"danger"}
                  />
                  <Parent>
                    <Link
                      to={"/request-reset-password"}
                      className="button is-link is-fullwidth"
                      data-test="reset-password"
                    >
                      {"Request another one"}
                    </Link>
                  </Parent>
                </>
              );
            }
            return (
              <Mutation
                mutation={RESET_PASSWORD_MUTATION}
                variables={userInput}
              >
                {(resetPassword, { loading }) => (
                  <Parent onSubmit={e => this.submitReset(e, resetPassword)}>
                    <Heading>Enter your new password</Heading>
                    <fieldset disabled={loading} aria-disabled={loading}>
                      {/* username */}
                      <div className="field">
                        <label className="label">
                          password
                          <div className={"control is-child"}>
                            <InputField
                              name="password"
                              value={password || ""}
                              error={userError}
                              onChange={this.changeHandler}
                              type="password"
                            />
                          </div>
                        </label>
                      </div>
                      <div className="field">
                        <label className="label">
                          Confirm password
                          <div className={"control is-child"}>
                            <InputField
                              name="confirmPassword"
                              value={confirmPassword || ""}
                              error={""}
                              onChange={this.changeHandler}
                              type="password"
                            />
                          </div>
                        </label>
                      </div>
                      {/* submit button */}
                      <button
                        className="button is-primary is-fullwidth"
                        data-test="signIn"
                        disabled={loading}
                      >
                        {"Reset"}
                      </button>
                    </fieldset>
                  </Parent>
                )}
              </Mutation>
            );
          }
          return <Heading>Verifying password reset link...</Heading>;
        }}
      </Query>
    );
  }
}

export default ResetPasswordForm;
