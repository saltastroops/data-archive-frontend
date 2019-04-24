import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import { MemoryRouter } from "react-router";
import wait from "waait";
import App from "../App";
import LoginForm from "../components/LoginForm";
import { LOGIN_MUTATION } from "../graphql/Mutations";
import { USER_QUERY } from "../graphql/Query";
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

// login mock mutation
const mocks = [
  {
    request: {
      query: LOGIN_MUTATION,
      variables: {
        ...updatedState.userInput
      }
    },
    result: {
      data: {
        login: true
      }
    }
  },

  {
    request: {
      query: USER_QUERY
    },
    result: {
      data: {
        user: {
          __typename: "User",
          familyName: "test",
          givenName: "test",
          roles: []
        }
      }
    }
  }
];

describe("LoginForm Component", () => {
  it("renders the LoginForm component having unpopulated props with no errors", async () => {
    // LoginForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <LoginForm />
      </MockedProvider>
    );
    // The actual form.
    const form = wrapper.find('form[data-test="form"]');
    // Expect the snapshot to match the LoginForm component.
    expect(toJson(form)).toMatchSnapshot();
  });

  it("displays a loading message and no errors if the submitted inputs are all valid", async () => {
    // LoginForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/login"]}>
          <LoginForm />
        </MemoryRouter>
      </MockedProvider>
    );

    // LoginForm component instance
    const instance = wrapper.find("LoginForm").instance() as any;

    // Simulate state change when the username input field value changes
    inputTyping(wrapper, "username", "sj");

    // Simulate state change when the password input field value changes
    inputTyping(wrapper, "password", "securepassword");

    // Expect the properties username and password of the state to have been updated with the correct value
    expect(instance.state.userInput).toMatchObject({
      password: "securepassword",
      username: "sj"
    });

    const signInButton = wrapper.find('[data-test="signIn"]');

    // Expect the button to not be clicked
    expect(signInButton.text()).toContain("Sign in");

    // Simulate the form submission
    signInButton.simulate("submit");

    // Expect the button to have been clicked
    expect(signInButton.text()).toContain("Signing in");

    // Expect no error message.
    expect(wrapper.find("p").length).toBe(0);
  });

  it("displays an error message if the submitted username is invalid", async () => {
    // LoginForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <LoginForm />
      </MockedProvider>
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

    const signInButton = wrapper.find('[data-test="signIn"]');

    // Simulate the form submission
    signInButton.simulate("submit");

    // Expect the button to have beeen clicked
    expect(signInButton.text()).toContain("Sign in");

    // Expect an error message.
    expect(wrapper.find("p").length).toBe(1);

    // Expect a meaningful error message
    expect(wrapper.find("p").text()).toContain("Username");
    expect(wrapper.find("p").text()).toContain("lowercase");
  });

  it("displays an error message if the submitted password is invalid", () => {
    // LoginForm component wrapper
    const wrapper = mount(
      <MockedProvider>
        <LoginForm />
      </MockedProvider>
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

    const signInButton = wrapper.find('[data-test="signIn"]');

    // Simulate the form submission
    signInButton.simulate("submit");

    // Expect no loading status.
    expect(signInButton.text()).toContain("Sign in");

    // Expect an error message.
    expect(wrapper.find("p").length).toBe(1);

    // Expect a meaningful error message
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
});
