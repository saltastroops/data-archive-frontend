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

describe("LoginForm Component", () => {
  it("renders the LoginForm component having unpopulated props with no errors", async () => {
    // LoginForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <LoginForm />
        </MemoryRouter>
      </MockedProvider>
    );
    // The actual form.
    const form = wrapper.find('form[data-test="form"]');
    // Expect the snapshot to match the LoginForm component.
    expect(toJson(form)).toMatchSnapshot();
  });

  it("submits valid input successfully", async () => {
    const userDetails = {
      authProvider: "SSDA",
      password: "securepassword",
      username: "sj"
    };
    const login = jest.fn();
    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: userDetails
        },
        result: () => {
          login();
          return {
            data: {
              login: true
            }
          };
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
    inputTyping(wrapper, "username", userDetails.username);

    // Simulate state change when the password input field value changes
    inputTyping(wrapper, "password", userDetails.password);

    // Expect the properties username and password of the state to have been updated with the correct value
    expect(instance.state.userInput).toMatchObject({
      password: "securepassword",
      username: "sj"
    });

    const signInButton = wrapper.find('[data-test="signIn"]');

    // Expect the button not to indicate loading
    expect(signInButton.text()).toContain("Sign in");

    // The mutation has not been called (yet)
    expect(login).not.toHaveBeenCalled();

    // Simulate the form submission
    signInButton.simulate("submit");

    // Expect the button to indicate loading
    expect(signInButton.text()).toContain("Signing in");

    // The mutation has been called
    await wait(50); // 50 ms rather than 0 ms to give a potential state change the chance to finish
    wrapper.update();
    expect(login).toHaveBeenCalled();

    // Expect no error message.
    expect(wrapper.find("p").length).toBe(0);
  });

  it("displays an error message if the submitted password is invalid", () => {
    // LoginForm component wrapper
    const wrapper = mount(
      <MockedProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <LoginForm />
        </MemoryRouter>
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

    // Simulate the form submission
    const signInButton = wrapper.find('[data-test="signIn"]');
    signInButton.simulate("submit");

    // Expect the button not to indicate loading
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

  it("displays an error message if the login fails", async () => {
    const userDetails = {
      authProvider: "SSDA",
      password: "securepassword",
      username: "sj"
    };
    const login = jest.fn();
    const mocks = [
      {
        error: new Error("The server is having a coffee break!"),
        request: {
          query: LOGIN_MUTATION,
          variables: userDetails
        }
      }
    ];

    // LoginForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/login"]}>
          <LoginForm />
        </MemoryRouter>
      </MockedProvider>
    );

    // Simulate state change when the username input field value changes
    inputTyping(wrapper, "username", userDetails.username);

    // Simulate state change when the password input field value changes
    inputTyping(wrapper, "password", userDetails.password);

    // There is no error (yet)
    expect(wrapper.find("p.error").length).toBe(0);

    // Simulate the form submission
    const signInButton = wrapper.find('[data-test="signIn"]');
    signInButton.simulate("submit");

    // There is an error now
    await wait(50); // 50 ms rather than 0 ms to give the state change the chance to finish
    wrapper.update();
    expect(wrapper.find("p.error").length).toBe(1);
    expect(wrapper.find("p.error").text()).toEqual(
      "The server is having a coffee break!"
    );
  });
});
