import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import { MemoryRouter } from "react-router";
import wait from "waait";
import App from "../App";
import LoginForm from "../components/LoginForm";
import { GET_USER_MUTATION } from "../graphql/Mutations";
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
      query: GET_USER_MUTATION,
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

  it("displays no errors if submitted inputs are all valid", async () => {
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

    // Simulate state change when the username input field value changes.
    inputTyping(wrapper, "username", "sj");

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "securepassword");

    // Expect the properties username and password of the state to have been updated with the correct value.
    expect(instance.state.userInput).toMatchObject({
      password: "securepassword",
      username: "sj"
    });

    const signInButton = wrapper.find('[data-test="signIn"]');
    // Expect the button to not be clicked
    expect(signInButton.text()).toContain("Sign in");

    // Simulate the submiting of the form.
    signInButton.simulate("submit");

    // Expect the button to have beeen clicked
    expect(signInButton.text()).toContain("Signing in");

    // Expect no error message.
    expect(wrapper.find("p").length).toBe(0);
  });

  it("displays error message if submitted invalid username", async () => {
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
      <MockedProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

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
