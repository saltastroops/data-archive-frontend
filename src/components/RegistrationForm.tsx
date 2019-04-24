import { validate } from "isemail";
import * as _ from "lodash";
import * as React from "react";
import { Mutation } from "react-apollo";
import { Redirect } from "react-router";
import styled from "styled-components";
import { SIGNUP_MUTATION } from "../graphql/Mutations";
import InputField from "./basicComponents/InputField";

/**
 * Input for the registration form.
 *
 * Properties:
 * -----------
 * affiliation:
 *     The affiliation of the user, such as a university or an institute.
 * confirmPassword:
 *      A matching password that must match with the original password.
 * email:
 *     Email address. This will be stored in lower case.
 * familyName:
 *     The family name (surname).
 * givenName:
 *     The given name (first name).
 * password:
 *     The password, which must have at least 7 characters.
 * username:
 *     The username, which must not contain upper case letters.
 */
export interface IRegistrationFormInput {
  affiliation: string;
  confirmPassword: string;
  email: string;
  givenName: string;
  familyName: string;
  password: string;
  username: string;
}

/**
 * The state of the registration form.
 *
 * Properties:
 * -----------
 * errors:
 *     An object of keys and error messages.
 * registered:
 *     Whether the registration was successful.
 * userInput:
 *     Values input by the user.
 */
interface IRegistrationFormState {
  errors: Partial<IRegistrationFormInput> & { responseError?: string };
  registered: boolean;
  userInput: IRegistrationFormInput;
}

/**
 * The cache for the registration form.
 *
 * The user input and errors are cached.
 */
export interface IRegistrationFormCache {
  errors?: Partial<IRegistrationFormInput> & { responseError?: string };
  userInput?: IRegistrationFormInput;
}

interface IRegistrationFormProps {
  cache?: IRegistrationFormCache;
}

const validateRegistrationField = (
  registrationInput: IRegistrationFormInput
) => {
  // An object to store errors for all fields.
  const errors: Partial<IRegistrationFormInput> = {};

  // Check if the submitted given name is not empty.
  if (!registrationInput.givenName) {
    errors.givenName = "Given name can't be empty";
  }

  // Check if the submitted family name is not empty.
  if (!registrationInput.familyName) {
    errors.familyName = "Family name can't be empty";
  }

  // Check if the submitted username is not empty.
  if (!registrationInput.username) {
    errors.username = `Username cannot be empty.`;
  }

  // Check if the submitted username contains upper case characters.
  if (registrationInput.username !== registrationInput.username.toLowerCase()) {
    errors.username = "Username must be in lowercase";
  }

  // Check if the submitted email address is valid.
  if (!validate(registrationInput.email, { minDomainAtoms: 2 })) {
    errors.email = "Email address is invalid";
  }

  // Check if the password is secure enough.
  if (registrationInput.password.length <= 6) {
    errors.password = "Password should be at least 7 characters long";
  }

  // Check if passwords match
  if (registrationInput.password !== registrationInput.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  // return an array consisting of error message if any or empty.
  return errors;
};

const Form = styled.form.attrs({
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

class RegistrationForm extends React.Component<
  IRegistrationFormProps,
  IRegistrationFormState
> {
  public state: IRegistrationFormState = {
    errors: {
      affiliation: "",
      confirmPassword: "",
      email: "",
      familyName: "",
      givenName: "",
      password: "",
      responseError: "",
      username: ""
    },
    registered: false,
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

  /**
   * Populate the state from cached values.
   */
  componentDidMount() {
    if (this.props.cache) {
      this.setState(() => (this.props.cache as any) || {});
    }
  }

  onHandleSubmit = async (e: React.FormEvent<EventTarget>, signup: any) => {
    e.preventDefault();

    // Validate the user input fields
    const errors: object = validateRegistrationField(this.state.userInput);
    this.updateState({ errors });

    // Check if there is an error, if there is abort signing up.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // If all fields are validated, sign up
      await signup();

      // Reset the state when registering succeeded
      this.updateState({
        registered: true,
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
    } catch (error) {
      this.updateState({
        errors: {
          ...this.state.errors,
          responseError:
            "Something went wrong when registering. Please try again later."
        }
      });
    }
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    // Update form content with the new user input
    this.updateState({
      userInput: {
        ...this.state.userInput,
        [name]: value
      }
    });
  };

  render() {
    const { errors, registered } = this.state;
    const {
      affiliation,
      confirmPassword,
      email,
      familyName,
      givenName,
      password,
      username
    } = this.state.userInput;

    if (registered) {
      return <Redirect to={"/login"} />;
    }

    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state.userInput}>
        {(signup: any, { loading }: any) => {
          return (
            <Form onSubmit={e => this.onHandleSubmit(e, signup)}>
              <fieldset disabled={loading} aria-disabled={loading}>
                <Heading>Create your account</Heading>
                {errors.responseError ? (
                  <ErrorMessage>{errors.responseError}</ErrorMessage>
                ) : null}

                {/* Given name */}
                <div className="field">
                  <label className="label">
                    Given name (first name)
                    <InputField
                      error={errors.givenName}
                      name={"givenName"}
                      onChange={this.onInputChange}
                      value={givenName}
                    />
                  </label>
                </div>

                {/* Family name */}
                <div className="field">
                  <label className="label">
                    Family name (surname)
                    <InputField
                      error={errors.familyName}
                      name={"familyName"}
                      onChange={this.onInputChange}
                      value={familyName}
                    />
                  </label>
                </div>

                {/* Email address */}
                <div className="field">
                  <label className="label">
                    Email address
                    <InputField
                      error={errors.email}
                      name={"email"}
                      onChange={this.onInputChange}
                      value={email}
                    />
                  </label>
                </div>

                {/* Username */}
                <div className="field">
                  <label className="label">
                    Username
                    <InputField
                      error={errors.username}
                      name={"username"}
                      onChange={this.onInputChange}
                      value={username}
                    />
                  </label>
                </div>

                {/* Affiliation */}
                <div className="field">
                  <label className="label">
                    Affiliation
                    <InputField
                      error={errors.affiliation}
                      name={"affiliation"}
                      placeholder={"E.g. University of Cape Town"}
                      onChange={this.onInputChange}
                      value={affiliation}
                    />
                  </label>
                </div>

                {/* Password */}
                <div className="field">
                  <label className="label">
                    Password
                    <InputField
                      error={errors.password}
                      name={"password"}
                      placeholder={"At least 7 characters"}
                      onChange={this.onInputChange}
                      type={"password"}
                      value={password}
                    />
                  </label>
                </div>

                {/* Retyped password */}
                <div className="field">
                  <label className="label">
                    Re-enter password
                    <InputField
                      error={errors.confirmPassword}
                      name={"confirmPassword"}
                      onChange={this.onInputChange}
                      type={"password"}
                      value={confirmPassword}
                    />
                  </label>
                </div>

                {/* Submit */}
                <button
                  className="button is-success is-fullwidth is-rounded"
                  data-test="signUp"
                  type={"submit"}
                >
                  {loading ? "Signing up..." : "Sign up"}
                </button>
              </fieldset>
            </Form>
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

export default RegistrationForm;
