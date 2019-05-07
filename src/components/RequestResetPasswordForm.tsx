import gql from "graphql-tag";
import { validate } from "isemail";
import * as React from "react";
import { Mutation } from "react-apollo";
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

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestPasswordReset(email: $email) {
      email
    }
  }
`;

class RequestResetPasswordForm extends React.Component {
  state = {
    confirmReset: false,
    errors: {
      email: "",
      gqlError: ""
    },
    loading: false,
    userInput: {
      email: ""
    }
  };
  emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({
      ...this.state,
      errors: { email: "", gqlError: "" },
      userInput: { email: value }
    });
  };

  submitRequest = async (
    e: React.FormEvent<EventTarget>,
    requestResetPassword: any
  ) => {
    e.preventDefault();

    if (!validate(this.state.userInput.email, { minDomainAtoms: 2 })) {
      this.setState({
        errors: { ...this.state.errors, email: "Email address is invalid" }
      });
      return;
    }

    this.setState({ errors: { email: "" } });
    try {
      const user = await requestResetPassword();
      if (user) {
        this.setState({ confirmReset: true });
      }
    } catch (e) {
      this.setState({
        errors: { gqlError: e.message.replace("GraphQL error: ", "") }
      });
      return;
    }
  };

  public render() {
    const { email } = this.state.userInput;
    const { confirmReset, userInput } = this.state;
    const emailError = this.state.errors.email;
    const { gqlError } = this.state.errors;
    if (confirmReset) {
      return (
        <div>
          <Heading>{}</Heading>
          <Heading>
            Please Click on the link in your email address to confirm password
            reset
          </Heading>
        </div>
      );
    }
    return (
      <>
        {
          <Mutation mutation={REQUEST_RESET_MUTATION} variables={userInput}>
            {(requestResetPassword, { loading }) => (
              <Parent
                onSubmit={e => this.submitRequest(e, requestResetPassword)}
              >
                <Heading>Request password reset</Heading>
                <fieldset disabled={loading} aria-disabled={loading}>
                  {/* username */}
                  {gqlError !== "" && (
                    <Message message={gqlError} type={"danger"} />
                  )}
                  <div className="field">
                    <label className="label">
                      Email
                      <div className={"control is-child"}>
                        <InputField
                          name="email"
                          value={email}
                          error={emailError}
                          onChange={this.emailChange}
                          type="text"
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
                    {loading ? "Requesting..." : "Request"}
                  </button>
                </fieldset>
              </Parent>
            )}
          </Mutation>
        }
      </>
    );
  }
}

export default RequestResetPasswordForm;
