import { validateLoginField } from "../LoginFormValidation";

describe("Login form validation", () => {
  // Valid user input for login
  const userInput = {
    password: "securedmatchpassword",
    username: "validusername"
  };

  it("should return an array with error message for invalid username", () => {
    // Submitting an empty username.
    const invalidUsername = { ...userInput, username: "" };

    // Expect meaningful error message
    expect(validateLoginField(invalidUsername)[0]).toContain("Username");
    expect(validateLoginField(invalidUsername)[0]).toContain("empty");

    // Submitting an invalid username
    invalidUsername.username = "InvalidUsername";

    // Expect meaningful error message
    expect(validateLoginField(invalidUsername)[0]).toContain("Username");
    expect(validateLoginField(invalidUsername)[0]).toContain("lowercase");
  });

  it("should return an array with error message for invalid password", () => {
    // Submitting a password that is less than 7 characters.
    const invalidPassword = { ...userInput, password: "short" };

    // Expect meaningful error message
    expect(validateLoginField(invalidPassword)[0]).toContain("Password");
    expect(validateLoginField(invalidPassword)[0]).toContain("7 characters");
  });
});
