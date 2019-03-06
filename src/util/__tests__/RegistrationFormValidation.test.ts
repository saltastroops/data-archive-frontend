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
    const errors = {
      affiliation: "",
      confirmPassword: "",
      email: "",
      familyName: "",
      givenName: "",
      password: "",
      username: ""
    };
    // Expect no error messages
    expect(validateRegistrationField(userInput)).toEqual(errors);
  });

  it("should return an array with error message for invalid family name", () => {
    // Submitting an empty family name.
    const invalidFamilyName = { ...userInput, familyName: "" };

    // Expect meaningful error message
    expect(validateRegistrationField(invalidFamilyName).familyName).toContain(
      "Family name"
    );
    expect(validateRegistrationField(invalidFamilyName).familyName).toContain(
      "empty"
    );
  });

  it("should return an array with error message for invalid given name", () => {
    // Submitting an empty gievn name.
    const invalidGivenName = { ...userInput, givenName: "" };

    // Expect meaningful error message
    expect(validateRegistrationField(invalidGivenName).givenName).toContain(
      "Given name"
    );
    expect(validateRegistrationField(invalidGivenName).givenName).toContain(
      "empty"
    );
  });

  it("should return an array with error message for invalid username", () => {
    // Submitting an empty username.
    const invalidUsername = { ...userInput, username: "" };

    // Expect meaningful error message
    expect(validateRegistrationField(invalidUsername).username).toContain(
      "Username"
    );
    expect(validateRegistrationField(invalidUsername).username).toContain(
      "empty"
    );

    // Submitting an invalid username
    invalidUsername.username = "InvalidUsername";

    // Expect meaningful error message
    expect(validateRegistrationField(invalidUsername).username).toContain(
      "Username"
    );
    expect(validateRegistrationField(invalidUsername).username).toContain(
      "lowercase"
    );
  });

  it("should return an array with error message for invalid email address", () => {
    // Submitting and empty email address.
    const invalidEmailAddress = { ...userInput, email: "" };

    // Expect meaningful error message.
    expect(validateRegistrationField(invalidEmailAddress).email).toContain(
      "Email address"
    );
    expect(validateRegistrationField(invalidEmailAddress).email).toContain(
      "invalid"
    );

    // Submitting an invalid email address.
    invalidEmailAddress.email = "invalid$email#address";

    // Expect meaningful error message.
    expect(validateRegistrationField(invalidEmailAddress).email).toContain(
      "Email address"
    );
    expect(validateRegistrationField(invalidEmailAddress).email).toContain(
      "invalid"
    );
  });

  it("should return an array with error message for invalid password", () => {
    // Submitting a password that is less than 7 characters.
    const invalidPassword = { ...userInput, password: "short" };

    // Expect meaningful error message
    expect(validateRegistrationField(invalidPassword).password).toContain(
      "Password"
    );
    expect(validateRegistrationField(invalidPassword).password).toContain(
      "7 characters"
    );
  });

  it("should return an array with error message for not matched password", () => {
    // Submitting passwords that do not match.
    const unMatchedPassword = {
      ...userInput,
      confirmPassword: "notmatched",
      password: "unmatched"
    };

    // Expect meaningful error message
    expect(
      validateRegistrationField(unMatchedPassword).confirmPassword
    ).toContain("Passwords");
    expect(
      validateRegistrationField(unMatchedPassword).confirmPassword
    ).toContain("do not");
  });
});
