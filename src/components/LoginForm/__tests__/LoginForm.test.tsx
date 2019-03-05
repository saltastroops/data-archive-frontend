jest.mock("../../../api/api");

import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import api from "../../../api/api";
import LoginForm from "../LoginForm";

// Helper function for simulating input field value change.
function inputTyping(wrapper: any, name: string, value: string) {
  wrapper.find(`input[name="${name}"]`).simulate("change", {
    target: { name, value }
  });
}

// Initial userInput state
const initialState = {
  errors: [],
  userInput: {
    password: "",
    username: ""
  }
};

// Updated userInput state
const updatedState = {
  errors: [],
  userInput: {
    password: "securepassword",
    username: "sj"
  }
};

describe("LoginForm Component", () => {
  it("renders the LoginForm component having unpopulated props with no errors", async () => {
    // LoginForm component wrapper.
    const wrapper = mount(
      <LoginForm
        userInput={initialState.userInput}
        errors={initialState.errors}
      />
    );
    // Expect the snapshot to match the LoginForm component.
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("displays no errors if submitted inputs are all valid", () => {
    // LoginForm component wrapper.
    const wrapper = mount(
      <LoginForm
        userInput={initialState.userInput}
        errors={initialState.errors}
      />
    );

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

    const signInButton = wrapper.find(".signIn");
    // Expect the button to not be clicked
    expect(signInButton.text()).toContain("Sign in");

    // Simulate the submiting of the form.
    signInButton.simulate("submit");

    // Expect login function to have been called once
    expect(api.auth.login).toHaveBeenCalledTimes(1);

    // Expect the login function to be called with the correct arguments
    expect(api.auth.login).toBeCalledWith({
      password: "securepassword",
      username: "sj"
    });

    // Expect the button to hev beeen clicked
    expect(signInButton.text()).toContain("Signing in");

    // Expect no error message.
    expect(wrapper.find(".error").length).toBe(0);
  });

  it("displays error message if submitted invalid username", () => {
    // LoginForm component wrapper.
    const wrapper = mount(
      <LoginForm
        userInput={initialState.userInput}
        errors={initialState.errors}
      />
    );

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

    const signInButton = wrapper.find(".signIn");
    // Simulate the submiting of the form.
    signInButton.simulate("submit");

    // Expect the button to hev beeen clicked
    expect(signInButton.text()).toContain("Sign in");

    // Expect an error message.
    expect(wrapper.find(".error").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find(".error").text()).toContain("Username");
    expect(wrapper.find(".error").text()).toContain("lowercase");
  });

  it("displays error message if submitted invalid password", () => {
    // LoginForm component wrapper.
    const wrapper = mount(
      <LoginForm
        userInput={initialState.userInput}
        errors={initialState.errors}
      />
    );

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

    const signInButton = wrapper.find(".signIn");
    // Simulate the submiting of the form.
    signInButton.simulate("submit");

    // Expect the button to hev beeen clicked
    expect(signInButton.text()).toContain("Sign in");

    // Expect an error message.
    expect(wrapper.find(".error").length).toBe(1);

    // Expect meaningful error message
    expect(
      wrapper
        .find(".error")
        .first()
        .text()
    ).toContain("Password");
    expect(
      wrapper
        .find(".error")
        .first()
        .text()
    ).toContain("7 characters");
  });
});