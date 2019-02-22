import { validateRegistrationField } from "../RegistrationFormValidation";

describe("Registration form validation", () => {
  // Valid user input for registration
  const userInput = {
    affiliation: "University of Cape Town",
    confirmPassword: "securedmatchpassword",
    email: "valid@email.address",
    familyName: "Last name",
    givenName: "First name",
    password: "securedmatchpassword",
    username: "validusername"
  };

  it("should return an empty array, when valid information is submitted", () => {
    // Expect no error messages
    expect(validateRegistrationField(userInput)).toEqual([]);
  });

  it("should return an array with error message for invalid family name", () => {
    // Submitting an empty family name.
    const invalidFamilyName = { ...userInput, familyName: "" };

    // Expect meaningful error message
    expect(validateRegistrationField(invalidFamilyName)[0]).toContain(
      "Family name"
    );
    expect(validateRegistrationField(invalidFamilyName)[0]).toContain("empty");
  });

  it("should return an array with error message for invalid given name", () => {
    // Submitting an empty gievn name.
    const invalidGivenName = { ...userInput, givenName: "" };

    // Expect meaningful error message
    expect(validateRegistrationField(invalidGivenName)[0]).toContain(
      "Given name"
    );
    expect(validateRegistrationField(invalidGivenName)[0]).toContain("empty");
  });

  it("should return an array with error message for invalid username", () => {
    // Submitting an empty username.
    const invalidUsername = { ...userInput, username: "" };

    // Expect meaningful error message
    expect(validateRegistrationField(invalidUsername)[0]).toContain("Username");
    expect(validateRegistrationField(invalidUsername)[0]).toContain("empty");

    // Submitting an invalid username
    invalidUsername.username = "InvalidUsername";

    // Expect meaningful error message
    expect(validateRegistrationField(invalidUsername)[0]).toContain("Username");
    expect(validateRegistrationField(invalidUsername)[0]).toContain(
      "lowercase"
    );
  });

  it("should return an array with error message for invalid email address", () => {
    // Submitting and empty email address.
    const invalidEmailAddress = { ...userInput, email: "" };

    // Expect meaningful error message.
    expect(validateRegistrationField(invalidEmailAddress)[0]).toContain(
      "Email address"
    );
    expect(validateRegistrationField(invalidEmailAddress)[0]).toContain(
      "invalid"
    );

    // Submitting an invalid email address.
    invalidEmailAddress.email = "invalid$email#address";

    // Expect meaningful error message.
    expect(validateRegistrationField(invalidEmailAddress)[0]).toContain(
      "Email address"
    );
    expect(validateRegistrationField(invalidEmailAddress)[0]).toContain(
      "invalid"
    );
  });

  it("should return an array with error message for invalid password", () => {
    // Submitting a password that is less than 7 characters.
    const invalidPassword = { ...userInput, password: "short" };

    // Expect meaningful error message
    expect(validateRegistrationField(invalidPassword)[0]).toContain("Password");
    expect(validateRegistrationField(invalidPassword)[0]).toContain(
      "7 characters"
    );
  });

  it("should return an array with error message for not matched password", () => {
    // Submitting passwords that do not match.
    const unMatchedPassword = {
      ...userInput,
      password: "unmatched",
      confirmPassword: "notmatched"
    };

    // Expect meaningful error message
    expect(validateRegistrationField(unMatchedPassword)[0]).toContain(
      "Passwords"
    );
    expect(validateRegistrationField(unMatchedPassword)[0]).toContain("do not");
  });
});
