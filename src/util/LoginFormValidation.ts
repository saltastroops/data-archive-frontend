/**
 * An interface for the registration inputs
 *
 * Properties:
 * -----------
 * password:
 *     The password, which must have at least 7 characters.
 * username:
 *     The username, which must not contain upper case letters.
 */
export interface ILoginForm {
  password: string;
  username: string;
}

/**
 * Login form validation for the user input.
 *
 * It accepts an object argument as defined by the ILoginForm interface
 *
 * @param loginInput
 *
 * An example of the submitted user input may look like:
 *
 * loginInput = {
 *
 *    password: "SecureandMatchingPassword",
 *
 *    username: "validusername"
 * }
 *
 * It returns an erray of string items if there is any error message or
 * an empty array if there are no items.
 */

export const validateLoginField = (loginInput: ILoginForm) => {
  // An object to Store errors for all fields.
  const errors = {
    password: "",
    username: ""
  };

  // Check if the submitted username is not empty.
  if (!loginInput.username) {
    errors.username = `Username cannot be empty.`;
  }

  // Check if the submitted username contains upper case characters.
  if (loginInput.username !== loginInput.username.toLowerCase()) {
    errors.username = "Username must be in lowercase";
  }

  // Check if the password is secure enough.
  if (loginInput.password.length <= 6) {
    errors.password = "Password should be at least 7 characters long";
  }

  // return an array consisting of error message if any or empty.
  return errors;
};
