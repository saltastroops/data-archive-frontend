import { validate } from "isemail";
/**
 * An interface for the registration inputs
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
export interface IRegistrationForm {
  affiliation: string;
  confirmPassword: string;
  email: string;
  givenName: string;
  familyName: string;
  password: string;
  username: string;
}

/**
 * Registration form validation for the user input.
 *
 * It accepts an object argument as defined by the IRegistrationForm interface
 *
 * @param registrationInput
 *
 * An example of the submitted user input may look like:
 *
 * registrationInput = {
 *    affiliation: "University of Cape Town",
 *
 *    confirmPassword: "SecureandMatchingPassword",
 *
 *    emailAddress: "valid@gmail.com",
 *
 *    familyName: "Smith",
 *
 *    givenName: "John",
 *
 *    password: "SecureandMatchingPassword",
 *
 *    username: "validusername"
 * }
 *
 * It returns an erray of string items if the is any error message or
 * an empty array if there are no items.
 */

export const validateRegistrationField = (
  registrationInput: IRegistrationForm
) => {
  // An object to Store errors for all fields.
  const errors: string[] = [];

  // Check if the submitted given name is not empty.
  if (!registrationInput.givenName) {
    errors.push("Given name can't be empty");
  }

  // Check if the submitted family name is not empty.
  if (!registrationInput.familyName) {
    errors.push("Family name can't be empty");
  }

  // Check if the submitted username is not empty.
  if (!registrationInput.username) {
    errors.push(`Username cannot be empty.`);
  }

  // Check if the submitted username contains upper case characters.
  if (registrationInput.username !== registrationInput.username.toLowerCase()) {
    errors.push("Username must be in lowercase");
  }

  // Check if the submitted email address is valid.
  if (!validate(registrationInput.email, { minDomainAtoms: 2 })) {
    errors.push("Email address is invalid");
  }

  // Check if the password is secure enough.
  if (registrationInput.password.length <= 6) {
    errors.push("Password should be at least 7 characters long");
  }

  // Check if passwords match
  if (registrationInput.password !== registrationInput.confirmPassword) {
    errors.push("Passwords do not match");
  }

  // return an array consisting of error message if any or empty.
  return errors;
};
