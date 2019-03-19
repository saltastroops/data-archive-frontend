import { validate } from "isemail";

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
