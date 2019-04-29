import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import InputField from "./basicComponents/InputField";

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
      confirmPassword: "",
      email: "",
      password: ""
    },
    loading: false,
    user: {
      email: undefined
    },
    userInput: {
      confirmPassword: "",
      email: "",
      password: ""
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
          email: ""
        }
      }
    });
  };

  submitRequest = async (
    e: React.FormEvent<EventTarget>,
    requestResetPassword: any
  ) => {
    e.preventDefault();

    this.setState({ errors: { email: "" } });
    try {
      const user = await requestResetPassword();
      if (user) {
        this.setState({ confirmReset: true });
      }
    } catch (e) {
      this.setState({
        errors: { email: e.message.replace("GraphQL error: ", "") }
      });
      return;
    }
  };

  public render() {
    const { email } = this.state.userInput;
    const { confirmReset, userInput } = this.state;
    const userError = this.state.errors.email;
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
                <Heading>Login to the Data Archive</Heading>
                <fieldset disabled={loading} aria-disabled={loading}>
                  {/* username */}
                  <div className="field">
                    <label className="label">
                      Email
                      <div className={"control is-child"}>
                        <InputField
                          name="email"
                          value={email}
                          error={userError}
                          onChange={this.changeHandler}
                          type="email"
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
