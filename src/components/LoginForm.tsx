import * as _ from "lodash";
import * as React from "react";
import { Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { LOGIN_MUTATION } from "../graphql/Mutations";
import { USER_QUERY } from "../graphql/Query";
import InputField from "./basicComponents/InputField";

/**
 * Input for the login form.
 *
 * Properties:
 * -----------
 * password:
 *     The password, which must have at least 7 characters.
 * username:
 *     The username, which must not contain upper case letters.
 * }
 */
interface ILoginFormInput {
  username: string;
  password: string;
}

/**
 * State of the login form.
 *
 * Properties:
 * -----------
 * loggedIn:
 *     Whether the user has been logged in.
 * errors:
 *     Object of error messages.
 * userInput:
 *     Values input by the user.
 */
interface ILoginFormState {
  loggedIn: boolean;
  errors: Partial<ILoginFormInput> & { responseError?: string };
  userInput: ILoginFormInput;
}

/**
 * The cache for the login form.
 *
 * The user input and errors are cached.
 */
export interface ILoginFormCache {
  errors?: Partial<ILoginFormInput> & { responseError?: string };
  userInput?: ILoginFormInput;
}

interface ILoginFormProps {
  cache?: ILoginFormCache;
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

/**
 * Validate the given input and return an object of errors found.
 */
const validateLoginForm = (loginInput: {
  username: string;
  password: string;
}) => {
  // An object to store errors for all fields
  const errors: { username?: string; password?: string } = {};

  // Check if the submitted username is not empty
  if (!loginInput.username) {
    errors.username = `Username cannot be empty.`;
  }

  // Check if the submitted username contains upper case characters
  if (loginInput.username !== loginInput.username.toLowerCase()) {
    errors.username = "Username must be in lowercase";
  }

  // Check if the password is secure enough
  if (loginInput.password.length <= 6) {
    errors.password = "Password should be at least 7 characters long";
  }

  // Return an object consisting of the error messages
  return errors;
};

/**
 * The login form for authenticating the user.
 */
class LoginForm extends React.Component<ILoginFormProps, ILoginFormState> {
  public state = {
    errors: {
      password: "",
      responseError: "",
      username: ""
    },
    loggedIn: false,
    userInput: {
      password: "",
      username: ""
    }
  };

  /**
   * Populate the state from cached values.
   */
  componentDidMount() {
    this.setState(() => (this.props.cache as any) || {});
  }

  handleSubmit = async (e: React.FormEvent<EventTarget>, login: any) => {
    e.preventDefault();

    // Validate the user input fields
    const errors = validateLoginForm(this.state.userInput);

    this.updateState({ errors });

    // Check if there is an error, if there is abort signing in.
    if (errors.password || errors.username) {
      return;
    }

    try {
      const logUserIn = await login({
        variables: { ...this.state.userInput }
      });

      if (logUserIn.data.login) {
        this.updateState({
          errors: {
            password: "",
            responseError: "",
            username: ""
          },
          loggedIn: true,
          userInput: {
            password: "",
            username: ""
          }
        });
      }
    } catch (error) {
      this.updateState({
        errors: {
          ...this.state.errors,
          responseError: error.message
            .replace("Network error: ", "")
            .replace("GraphQL error: ", "")
        }
      });
    }
  };

  /**
   * Update the form content according to the user input.
   */
  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    // Update the userInput property of the state when input field values change
    this.updateState({
      userInput: {
        ...this.state.userInput,
        [name]: value
      }
    });
  };

  render() {
    const { errors, loggedIn } = this.state;
    const { password, username } = this.state.userInput;

    // Go to the main page after successfully logging in.
    if (loggedIn) {
      return <Redirect to={"/"} />;
    }

    return (
      <Mutation
        mutation={LOGIN_MUTATION}
        refetchQueries={[{ query: USER_QUERY }]}
      >
        {(login: any, { loading, error }: any) => {
          return (
            <LoginFormParent
              data-test={"form"}
              onSubmit={e => this.handleSubmit(e, login)}
            >
              <Heading>Login to the Data Archive</Heading>
              {error ? (
                <ErrorMessage>{errors.responseError}</ErrorMessage>
              ) : null}

              <fieldset disabled={loading} aria-disabled={loading}>
                {/* username */}
                <div className="field">
                  <label className="label">
                    Username
                    <div className={"control is-child"}>
                      <InputField
                        id="username"
                        name="username"
                        value={username || ""}
                        error={errors.username}
                        onChange={this.onInputChange}
                        type="text"
                      />
                    </div>
                  </label>
                </div>

                {/* password */}
                <div className="field">
                  <label className="label">
                    Password
                    <div className={"control is-child"}>
                      <InputField
                        id="password"
                        name="password"
                        value={password || ""}
                        error={errors.password}
                        onChange={this.onInputChange}
                        type="password"
                      />
                    </div>
                  </label>
                </div>

                {/* submit button */}
                <button
                  className="button is-success is-fullwidth is-rounded"
                  data-test="signIn"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </fieldset>
            </LoginFormParent>
          );
        }}
      </Mutation>
    );
  }

  /**
   * Update the form state and the cache.
   */
  private updateState = (update: object) => {
    this.setState(
      () => update,
      () => {
        if (this.props.cache) {
          this.props.cache.errors = _.cloneDeep(this.state.errors);
          this.props.cache.userInput = _.cloneDeep(this.state.userInput);
        }
      }
    );
  };
}

export default LoginForm;
