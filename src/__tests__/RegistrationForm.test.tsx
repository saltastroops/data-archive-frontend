import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import { MemoryRouter } from "react-router";
import wait from "waait";
import App from "../App";
import RegistrationForm from "../components/RegistrationForm";
import { SIGNUP_MUTATION } from "../graphql/Mutations";
import click from "../util/click";

// Helper function for simulating input field value change.
function inputTyping(wrapper: any, name: string, value: string) {
  wrapper.find(`input[name="${name}"]`).simulate("change", {
    target: { name, value }
  });
}

// Updated userInput state
const updatedState = {
  errors: {
    affiliation: "",
    confirmPassword: "",
    email: "",
    familyName: "",
    givenName: "",
    password: "",
    username: ""
  },
  userInput: {
    affiliation: "University of Cape Town",
    confirmPassword: "securepassword",
    email: "valid@email.address",
    familyName: "Smith",
    givenName: "John",
    password: "securepassword",
    username: "sj"
  }
};

describe("RegistrationForm Component", () => {
  it("renders the RegistrationForm having unpopulated props with no errors", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm />
      </MockedProvider>
    );

    // Expect the snapshot to match the RegistrationForm component.
    expect(toJson(wrapper.find("form"))).toMatchSnapshot();
  });

  it("successfully submits valid input", async () => {
    const register = jest.fn();
    const userDetails = {
      affiliation: "University of Cape Town",
      email: "valid@email.address",
      familyName: "Smith",
      givenName: "John",
      password: "securepassword",
      username: "sj"
    };
    const mocks = [
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: userDetails
        },
        result: () => {
          register();
          return {
            data: {
              signup: {
                __typename: "User",
                ...userDetails,
                id: "1"
              }
            }
          };
        }
      }
    ];

    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/register"]}>
          <RegistrationForm />
        </MemoryRouter>
      </MockedProvider>
    );

    // RegistrationForm component instance
    const instance = wrapper.find("RegistrationForm").instance() as any;

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the affiliation input field value changes.
    inputTyping(wrapper, "affiliation", userDetails.affiliation);
    // Simulate state change when the confirmPassword input field value changes.
    inputTyping(wrapper, "confirmPassword", userDetails.password);
    // Simulate state change when the emailAddress input field value changes.
    inputTyping(wrapper, "email", userDetails.email);
    // Simulate state change when the familyName input field value changes.
    inputTyping(wrapper, "familyName", userDetails.familyName);
    // Simulate state change when the givenName input field value changes.
    inputTyping(wrapper, "givenName", userDetails.givenName);
    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", userDetails.password);
    // Simulate state change when the username input field value changes.
    inputTyping(wrapper, "username", userDetails.username);

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(7);

    // Expect the property affiliation of the state to have been updated with the correct value.
    expect(instance.state.userInput.affiliation).toBe(
      "University of Cape Town"
    );

    // Expect the property confirmPassword of the state to have been updated with the correct value.
    expect(instance.state.userInput.confirmPassword).toBe("securepassword");

    // Expect the property emailAddress of the state to have been updated with the correct value.
    expect(instance.state.userInput.email).toBe("valid@email.address");

    // Expect the property familyName of the state to have been updated with the correct value.
    expect(instance.state.userInput.familyName).toBe("Smith");

    // Expect the property givenName of the state to have been updated with the correct value.
    expect(instance.state.userInput.givenName).toBe("John");

    // Expect the property password of the state to have been updated with the correct value.
    expect(instance.state.userInput.password).toBe("securepassword");

    // Expect the property username of the state to have been updated with the correct value.
    expect(instance.state.userInput.username).toBe("sj");

    // Expect the button not to reflect loading status
    expect(wrapper.find('[data-test="signUp"]').text()).toContain("Sign up");

    // The mutation has not been called (yet)
    expect(register).not.toHaveBeenCalled();

    // Simulate the submitting of the form.
    wrapper.find('[data-test="signUp"]').simulate("submit");

    // Expect the button to reflect the loading status
    expect(wrapper.find('[data-test="signUp"]').text()).toContain("Signing up");

    // The mutation has been called
    await wait(50); // 50 rather than 0 to give a potential state update the chance to finish
    wrapper.update();
    expect(register).toHaveBeenCalled();

    // Expect no error message
    expect(wrapper.find("p").length).toBe(0);
  });

  it("displays an error message if an invalid given name is submitted", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm />
      </MockedProvider>
    );

    // RegistrationForm component instance
    const instance = wrapper.find("RegistrationForm").instance() as any;

    // Set the state with valid information
    instance.setState({ userInput: updatedState.userInput });

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the givenName input field value changes.
    inputTyping(wrapper, "givenName", "");

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(1);

    // Simulate the submiting of the form.
    wrapper.find('[data-test="signUp"]').simulate("submit");

    // Expect an error message.
    expect(wrapper.find("p").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find("p").text()).toContain("Given name");
    expect(wrapper.find("p").text()).toContain("empty");
  });

  it("displays an error message if an invalid family name is submitted", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm />
      </MockedProvider>
    );

    // RegistrationForm component instance
    const instance = wrapper.find("RegistrationForm").instance() as any;

    // Set the state with valid information
    instance.setState({ userInput: updatedState.userInput });

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the familyName input field value changes.
    inputTyping(wrapper, "familyName", "");

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(1);

    // Simulate the submiting of the form.
    wrapper.find('[data-test="signUp"]').simulate("submit");

    // Expect an error message.
    expect(wrapper.find("p").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find("p").text()).toContain("Family name");
    expect(wrapper.find("p").text()).toContain("empty");
  });

  it("displays an error message if an invalid family name is submitted", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm />
      </MockedProvider>
    );

    // RegistrationForm component instance
    const instance = wrapper.find("RegistrationForm").instance() as any;

    // Set the state with valid information
    instance.setState({ userInput: updatedState.userInput });

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the emailAddress input field value changes.
    inputTyping(wrapper, "email", "invalid$email&address");

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(1);

    // Simulate the submiting of the form.
    wrapper.find('[data-test="signUp"]').simulate("submit");

    // Expect an error message.
    expect(wrapper.find("p").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find("p").text()).toContain("Email address");
    expect(wrapper.find("p").text()).toContain("invalid");
  });

  it("displays an error message if an invalid username is submitted", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm />
      </MockedProvider>
    );

    // RegistrationForm component instance
    const instance = wrapper.find("RegistrationForm").instance() as any;

    // Set the state with valid information
    instance.setState({ userInput: updatedState.userInput });

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the username input field value changes.
    inputTyping(wrapper, "username", "sJ");

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(1);

    // Simulate the submiting of the form.
    wrapper.find('[data-test="signUp"]').simulate("submit");

    // Expect an error message.
    expect(wrapper.find("p").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find("p").text()).toContain("Username");
    expect(wrapper.find("p").text()).toContain("lowercase");
  });

  it("displays an error message if an invalid password is submitted", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm />
      </MockedProvider>
    );

    // RegistrationForm component instance
    const instance = wrapper.find("RegistrationForm").instance() as any;

    // Set the state with valid information
    instance.setState({ userInput: updatedState.userInput });

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "short");

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(1);

    // Simulate the submiting of the form.
    wrapper.find('[data-test="signUp"]').simulate("submit");

    // Expect an error message.
    expect(wrapper.find("p").length).toBe(2);

    // Expect meaningful error message
    expect(
      wrapper
        .find("p")
        .first()
        .text()
    ).toContain("Password");
    expect(
      wrapper
        .find("p")
        .first()
        .text()
    ).toContain("7 characters");
  });

  it("displays an error message if an invalid confirmed password is submitted", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm />
      </MockedProvider>
    );

    // RegistrationForm component instance
    const instance = wrapper.find("RegistrationForm").instance() as any;

    // Set the state with valid information
    instance.setState({ userInput: updatedState.userInput });

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "securepassword");
    // Simulate state change when the confirmPassword input field value changes.
    inputTyping(wrapper, "confirmPassword", "notmatching");

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(2);

    // Simulate the submiting of the form.
    wrapper.find('[data-test="signUp"]').simulate("submit");

    // Expect an error message.
    expect(wrapper.find("p").length).toBe(1);

    // Expect meaningful error message
    expect(
      wrapper
        .find("p")
        .first()
        .text()
    ).toContain("Password");
    expect(
      wrapper
        .find("p")
        .first()
        .text()
    ).toContain("do not");
  });

  it("should display an error if the registration fails", async () => {
    const register = jest.fn();
    const userDetails = {
      affiliation: "University of Cape Town",
      email: "valid@email.address",
      familyName: "Smith",
      givenName: "John",
      password: "securepassword",
      username: "sj"
    };
    const mocks = [
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: userDetails
        },
        error: new Error("The server is having a coffee break!")
      }
    ];

    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RegistrationForm />
      </MockedProvider>
    );

    // Simulate state change when the affiliation input field value changes.
    inputTyping(wrapper, "affiliation", userDetails.affiliation);
    // Simulate state change when the confirmPassword input field value changes.
    inputTyping(wrapper, "confirmPassword", userDetails.password);
    // Simulate state change when the emailAddress input field value changes.
    inputTyping(wrapper, "email", userDetails.email);
    // Simulate state change when the familyName input field value changes.
    inputTyping(wrapper, "familyName", userDetails.familyName);
    // Simulate state change when the givenName input field value changes.
    inputTyping(wrapper, "givenName", userDetails.givenName);
    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", userDetails.password);
    // Simulate state change when the username input field value changes.
    inputTyping(wrapper, "username", userDetails.username);

    // There is no error (yet).
    expect(wrapper.find("p.error").length).toBe(0);

    // Simulate the submiting of the form.
    wrapper.find('[data-test="signUp"]').simulate("submit");

    // There is an error now
    await wait(50); // 50 ms rather than 0 ms to give the state update a chance to finish
    wrapper.update();
    expect(wrapper.find("p.error").length).toBe(1);
    expect(wrapper.find("p.error").text()).toEqual(
      "The server is having a coffee break!"
    );
  });

  it("should cache values and errors", async () => {
    const wrapper = mount(
      <MockedProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

    // Navigate to the registration form
    const registrationFormLink = wrapper.find('a[href="/register"]').first();
    click(registrationFormLink);

    await wait(0);
    wrapper.update();

    // Fill in an invalid email
    inputTyping(wrapper, "email", "invalid email");

    // Submit the form
    const submitButton = wrapper.find('[data-test="signUp"]');
    submitButton.simulate("submit");

    await wait(0);
    wrapper.update();

    // The value has been stored in the state, and there is an error
    const registrationFormState: any = wrapper.find("RegistrationForm").state();
    const emailValue = registrationFormState.userInput.email;
    expect(emailValue).toEqual("invalid email");
    const emailErrorMessage = registrationFormState.errors.email;
    expect(emailErrorMessage.length).toBeGreaterThan(0);

    // Navigate away from the registration form
    const cartLink = wrapper.find('a[href="/cart"]').first();
    click(cartLink);

    await wait(0);
    wrapper.update();

    // No login form any longer
    expect(wrapper.find("RegistrationForm").length).toBe(0);

    // Navigate back to the search form
    click(registrationFormLink);

    await wait(0);
    wrapper.update();

    // The values and errors have been re-inserted.
    const newRegistrationFormState: any = wrapper
      .find("RegistrationForm")
      .state();
    expect(newRegistrationFormState.userInput.email).toEqual(emailValue);
    expect(newRegistrationFormState.errors.email).toEqual(emailErrorMessage);
  });
});
