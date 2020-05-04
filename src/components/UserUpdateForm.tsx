import { validate } from "isemail";
import * as _ from "lodash";
import * as React from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import { UPDATE_USER_MUTATION } from "../graphql/Mutations";
import { USER_QUERY } from "../graphql/Query";
import { IUser } from "../util/types";
import InputField from "./basicComponents/InputField";

/**
 * Input for the user update form.
 *
 * Properties:
 * -----------
 * affiliation:
 *     The affiliation of the user, such as a university or an institute.
 * email:
 *     Email address. This will be stored in lower case.
 * familyName:
 *     The family name (surname).
 * givenName:
 *     The given name (first name).
 * newPassword:
 *     The new password to replace the old password.
 * confirmNewPassword:
 *     Must match with the new password.
 * password:
 *     The password, which must have at least 7 characters.
 * username:
 *     The username, which must not contain upper case letters.
 */
export interface IUserUpdateFormInput {
  affiliation?: string;
  confirmNewPassword?: string;
  email?: string;
  givenName?: string;
  familyName?: string;
  newPassword?: string;
  password: string;
  username?: string;
}

/**
 * The state of the update form.
 *
 * Properties:
 * -----------
 * errors:
 *     An object of keys and error messages.
 * userInput:
 *     Values input by the user.
 */
interface IUserUpdateFormState {
  errors: Partial<IUserUpdateFormInput> & { responseError?: string };
  userInput: IUserUpdateFormInput;
}

/**
 * The cache for the update form.
 *
 * The user input and errors are cached.
 */
export interface IUserUpdateFormCache {
  edited?: boolean;
  errors?: Partial<IUserUpdateFormInput> & { responseError?: string };
  userInput?: IUserUpdateFormInput;
}

interface IUserUpdateFormProps {
  cache?: IUserUpdateFormCache;
  user?: IUser | null;
}

const validateUpdateField = (updateInput: IUserUpdateFormInput) => {
  // An object to store errors for all fields.
  const errors: Partial<IUserUpdateFormInput> = {};

  // Check if the password is provided.
  if (!updateInput.password.length) {
    errors.password = "Password must be provided.";
  }

  // Check if the new email address is valid.
  if (
    updateInput.email &&
    !validate(updateInput.email, { minDomainAtoms: 2 })
  ) {
    errors.email = "Email address is invalid";
  }

  // Check if the new password is secure enough.
  if (updateInput.newPassword && updateInput.newPassword.length <= 6) {
    errors.newPassword = "Password should be at least 7 characters long";
  }

  // Check if new passwords match
  if (updateInput.newPassword !== updateInput.confirmNewPassword) {
    errors.confirmNewPassword = "Passwords do not match";
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

class UserUpdateForm extends React.Component<
  IUserUpdateFormProps,
  IUserUpdateFormState
> {
  public state: IUserUpdateFormState = {
    errors: {},
    userInput: {
      affiliation: "",
      confirmNewPassword: "",
      email: "",
      familyName: "",
      givenName: "",
      newPassword: "",
      password: "",
      username: ""
    }
  };

  /**
   * Populate the state from cached values.
   */
  componentDidMount() {
    if (this.props.cache) {
      const { user } = this.props;
      this.setState(() =>
        this.props.cache && this.props.cache.edited
          ? (this.props.cache as any)
          : {
              userInput: {
                ...this.state.userInput,
                affiliation: user && user.affiliation,
                authProvider: user && user.authProvider,
                email: user && user.email,
                familyName: user && user.familyName,
                givenName: user && user.givenName,
                username: user && user.username
              }
            }
      );
    }
  }

  onHandleSubmit = async (e: React.FormEvent<EventTarget>, updateUser: any) => {
    e.preventDefault();

    // Validate the user input fields
    const errors: object = validateUpdateField(this.state.userInput);
    this.updateState({ errors });

    // Check if there is an error, if there is abort updating.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // If all fields are validated, update
      const updateVariables = { ...this.state.userInput };
      delete updateVariables.confirmNewPassword;
      await updateUser({ variables: updateVariables });

      // Reset the state when updating succeeded
      this.updateState({
        userInput: {
          affiliation: "",
          confirmNewPassword: "",
          email: "",
          familyName: "",
          givenName: "",
          newPassword: "",
          password: "",
          username: ""
        }
      });

      alert("Successfully updated.");
    } catch (error) {
      // We handle the error with a try ... catch rather than relying on Apollo
      // to pass it on to the render function as we need to store it in the
      // cache
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
    const { user } = this.props;

    if (user && user.authProvider !== "SSDA") {
      return (
        <ErrorMessage>
          You cannot update user details if you have signed in with another
          authentication provider, such as the SALT Web Manager.
        </ErrorMessage>
      );
    }
    const { errors } = this.state;
    const {
      affiliation,
      confirmNewPassword,
      email,
      familyName,
      givenName,
      newPassword,
      password,
      username
    } = this.state.userInput;

    return (
      <Mutation
        mutation={UPDATE_USER_MUTATION}
        refetchQueries={[{ query: USER_QUERY }]}
      >
        {(updateUser: any, { loading }: any) => {
          return (
            <Form onSubmit={e => this.onHandleSubmit(e, updateUser)}>
              <fieldset disabled={loading} aria-disabled={loading}>
                <Heading>Update your account</Heading>
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
                      onChange={this.onInputChange}
                      type={"password"}
                      value={password}
                    />
                  </label>
                </div>

                {/* New password */}
                <div className="field">
                  <label className="label">
                    New password
                    <InputField
                      error={errors.newPassword}
                      name={"newPassword"}
                      onChange={this.onInputChange}
                      placeholder={"At least 7 characters"}
                      type={"password"}
                      value={newPassword}
                    />
                  </label>
                </div>

                {/* Retype New password */}
                <div className="field">
                  <label className="label">
                    Retype New password
                    <InputField
                      error={errors.confirmNewPassword}
                      name={"confirmNewPassword"}
                      onChange={this.onInputChange}
                      type={"password"}
                      value={confirmNewPassword}
                    />
                  </label>
                </div>

                {/* Submit */}
                <button
                  className="button is-success is-fullwidth is-rounded"
                  data-test="update"
                  type={"submit"}
                >
                  {loading ? "Updating..." : "Update"}
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
          this.props.cache.edited = true;
          this.props.cache.errors = _.cloneDeep(this.state.errors);
          this.props.cache.userInput = _.cloneDeep(this.state.userInput);
        }
      }
    );
  };
}

export default UserUpdateForm;
