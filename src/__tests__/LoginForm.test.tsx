import { MemoryRouter } from "react-router";

jest.mock("../api/api");

import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import wait from "waait";
import api from "../api/api";
import App from "../App";
import LoginForm from "../components/LoginForm";
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
    password: "",
    username: ""
  },
  userInput: {
    password: "securepassword",
    username: "sj"
  }
};

describe("LoginForm Component", () => {
  it("renders the LoginForm component having unpopulated props with no errors", async () => {
    // LoginForm component wrapper.
    const wrapper = mount(<LoginForm />);
    // Expect the snapshot to match the LoginForm component.
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("displays no errors if submitted inputs are all valid", () => {
    // LoginForm component wrapper.
    const wrapper = mount(<LoginForm />);

    // LoginForm component instance
    const instance = wrapper.find("LoginForm").instance() as any;

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the username input field value changes.
    inputTyping(wrapper, "username", "sj");

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "securepassword");

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(2);

    // Expect the property username of the state to have been updated with the correct value.
    expect(instance.state.userInput.username).toBe("sj");

    // Expect the property password of the state to have been updated with the correct value.
    expect(instance.state.userInput.password).toBe("securepassword");

    const signInButton = wrapper.find('[data-test="signIn"]');
    // Expect the button to not be clicked
    expect(signInButton.text()).toContain("Sign in");

    // Simulate the submiting of the form.
    signInButton.simulate("submit");

    // Expect login function to have been called once
    expect(api.login).toHaveBeenCalledTimes(1);

    // Expect the login function to be called with the correct arguments
    expect(api.login).toBeCalledWith({
      password: "securepassword",
      username: "sj"
    });

    // Expect the button to have beeen clicked
    expect(signInButton.text()).toContain("Signing in");

    // Expect no error message.
    expect(wrapper.find("p").length).toBe(0);
  });

  it("displays error message if submitted invalid username", () => {
    // LoginForm component wrapper.
    const wrapper = mount(<LoginForm />);

    // LoginForm component instance
    const instance = wrapper.find("LoginForm").instance() as any;

    // Set the state with valid information
    instance.setState({ userInput: updatedState.userInput });

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the username input field value changes.
    inputTyping(wrapper, "username", "sJ");

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(1);

    const signInButton = wrapper.find('[data-test="signIn"]');
    // Simulate the submiting of the form.
    signInButton.simulate("submit");

    // Expect the button to have beeen clicked
    expect(signInButton.text()).toContain("Sign in");

    // Expect an error message.
    expect(wrapper.find("p").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find("p").text()).toContain("Username");
    expect(wrapper.find("p").text()).toContain("lowercase");
  });

  it("displays error message if submitted invalid password", () => {
    // LoginForm component wrapper.
    const wrapper = mount(<LoginForm />);

    // LoginForm component instance
    const instance = wrapper.find("LoginForm").instance() as any;

    // Set the state with valid information
    instance.setState({ userInput: updatedState.userInput });

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the username input field value changes.
    inputTyping(wrapper, "password", "short");

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(1);

    const signInButton = wrapper.find('[data-test="signIn"]');
    // Simulate the submiting of the form
    signInButton.simulate("submit");

    // Expect the button to have beeen clicked
    expect(signInButton.text()).toContain("Sign in");

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
    ).toContain("7 characters");
  });

  it("should cache values and errors", async () => {
    const wrapper = mount(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Navigate to the login form
    const loginFormLink = wrapper.find('a[href="/login"]').first();
    click(loginFormLink);

    await wait(0);
    wrapper.update();

    // Fill in an invalid password
    inputTyping(wrapper, "password", "short");

    // Submit the form
    const submitButton = wrapper.find('button[data-test="signIn"]');
    submitButton.simulate("submit");

    await wait(0);
    wrapper.update();

    // The value has been stored in the state, and there is an error
    const loginFormState: any = wrapper.find("LoginForm").state();
    const passwordValue = loginFormState.userInput.password;
    expect(passwordValue).toEqual("short");
    const passwordErrorMessage = loginFormState.errors.password;
    expect(passwordErrorMessage.length).toBeGreaterThan(0);

    // Navigate away from the login form
    const cartLink = wrapper.find('a[href="/cart"]').first();
    click(cartLink);

    await wait(0);
    wrapper.update();

    // No login form any longer
    expect(wrapper.find("LoginForm").length).toBe(0);

    // Navigate back to the search form
    click(loginFormLink);

    await wait(0);
    wrapper.update();

    // The values and errors have been re-inserted.
    const newLoginFormState: any = wrapper.find("LoginForm").state();
    expect(newLoginFormState.userInput.password).toEqual(passwordValue);
    expect(newLoginFormState.errors.password).toEqual(passwordErrorMessage);
  });
});
