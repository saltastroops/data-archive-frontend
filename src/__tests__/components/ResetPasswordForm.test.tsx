import { mount } from "enzyme";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import { MemoryRouter } from "react-router";
import wait from "waait";
import ResetPasswordForm, {
  RESET_PASSWORD_MUTATION,
  VERIFY_TOKEN_QUERY
} from "../../components/ResetPasswordForm";

// Helper function for simulating input field value change.
function inputTyping(wrapper: any, name: string, value: string) {
  wrapper.find(`input[name="${name}"]`).simulate("change", {
    target: { name, value }
  });
}

describe("ResetPasswordForm", () => {
  it("renders the ResetPasswordForm component correctly", async () => {
    const defaultProps = {
      match: { params: { token: "abc-known" } }
    };
    const wrapper = mount(
      <MockedProvider>
        <ResetPasswordForm {...defaultProps} />
      </MockedProvider>
    );
    expect(wrapper).toBeDefined();
  });

  it("successfully display the form if token is valid", async () => {
    const defaultProps = {
      match: { params: { token: "abc-known" } }
    };
    const mocks: any = [
      {
        request: {
          query: VERIFY_TOKEN_QUERY,
          variables: { token: "abc-known" }
        },
        result: {
          data: {
            verifyPasswordResetToken: {
              __typename: "Success",
              message: "",
              success: true
            }
          }
        }
      }
    ];

    // ResetPasswordForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/reset-password/abc-known"]}>
          <ResetPasswordForm {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

    // Expect password and confirm password input fields to exist
    expect(wrapper.find('InputField[data-test="password"]').length).toBe(1);
    expect(
      wrapper.find('InputField[data-test="confirm-password"]').length
    ).toBe(1);

    // // Expect the button to submit exist
    expect(
      wrapper.find('button[data-test="reset-password-submit"]').length
    ).toBe(1);

    // // Expect no error message
    expect(wrapper.find("Message").length).toBe(0);
  });

  it("display a loading token header on load", async () => {
    const defaultProps = {
      match: { params: { token: "abc-known" } }
    };
    const mocks = [
      {
        request: {
          query: VERIFY_TOKEN_QUERY,
          variables: { token: "abc-known" }
        },
        result: {
          data: {
            verifyPasswordResetToken: {
              __typename: "Success",
              message: "",
              success: true
            }
          }
        }
      }
    ];

    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/reset-password/abc-known"]}>
          <ResetPasswordForm {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>
    );

    // Expect a verify link text.
    expect(wrapper.find("h1").text()).toContain(
      "Verifying password reset link"
    );
  });

  it("should not display the form if token is invalid", async () => {
    const defaultProps = {
      match: { params: { token: "abc-unknown" } }
    };

    const mocks = [
      {
        request: {
          query: VERIFY_TOKEN_QUERY,
          variables: { token: "abc-unknown" }
        },
        result: {
          data: {
            verifyPasswordResetToken: {
              __typename: "Success",
              message: "A broken token",
              success: false
            }
          }
        }
      }
    ];

    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/reset-password/abc-unknown"]}>
          <ResetPasswordForm {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>
    );
    await wait(0);
    wrapper.update();
    // Expect password and confirm password input fields to not exist
    expect(wrapper.find('InputField[data-test="password"]').length).toBe(0);
    expect(
      wrapper.find('InputField[data-test="confirm-password"]').length
    ).toBe(0);

    // Expect error message
    expect(wrapper.find("Message").text()).toContain(
      "Password reset link is expired"
    );

    // Expect request again link to exist
    expect(wrapper.find('Link[data-test="request-again"]').text()).toContain(
      "Request another link"
    );
  });

  it("should display Error if the ssda API is down", async () => {
    const defaultProps = {
      match: { params: { token: "abc-unknown" } }
    };

    const mocks: any = [
      {
        error: new Error("API down"),
        request: {
          query: VERIFY_TOKEN_QUERY,
          variables: { token: "abc-unknown" }
        }
      }
    ];

    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/reset-password/abc-unknown"]}>
          <ResetPasswordForm {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>
    );
    await wait(0);
    wrapper.update();
    // Expect password and confirm password input fields to not exist
    expect(wrapper.find('InputField[data-test="password"]').length).toBe(0);
    expect(
      wrapper.find('InputField[data-test="confirm-password"]').length
    ).toBe(0);

    // Expect error message
    expect(wrapper.find("Message").text()).toContain("API down");
  });

  it("update state when typing a password", async () => {
    const defaultProps = {
      match: { params: { token: "abc-known" } }
    };

    const mocks = [
      {
        request: {
          query: VERIFY_TOKEN_QUERY,
          variables: { token: "abc-known" }
        },
        result: {
          data: {
            verifyPasswordResetToken: {
              __typename: "Success",
              message: "",
              success: true
            }
          }
        }
      }
    ];

    // Updated userInput state
    const updatedState = {
      confirmReset: false,
      errors: {
        confirmPassword: "",
        password: ""
      },
      userInput: {
        confirmPassword: "securepassword",
        password: "securepassword",
        token: "Token value"
      }
    };

    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/reset-password/abc-known"]}>
          <ResetPasswordForm {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

    // LoginForm component instance
    const instance = wrapper.find("ResetPasswordForm").instance();

    // Set the state with valid information
    instance.setState({ userInput: updatedState.userInput });

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the password input field value changes
    inputTyping(wrapper, "password", "securepassword");
    inputTyping(wrapper, "confirmPassword", "securepassword");

    await wait(50); // 50 ms rather than 0 ms to give a potential state change the chance to finish
    wrapper.update();

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(2);
  });

  it("display and error if password mismatch ", async () => {
    const defaultProps = {
      match: { params: { token: "abc-known" } }
    };

    const mocks = [
      {
        request: {
          query: VERIFY_TOKEN_QUERY,
          variables: { token: "abc-known" }
        },
        result: {
          data: {
            verifyPasswordResetToken: {
              __typename: "Success",
              message: "",
              success: true
            }
          }
        }
      }
    ];

    // Updated userInput state
    const mismatchState = {
      confirmReset: false,
      errors: {
        confirmPassword: "",
        password: ""
      },
      userInput: {
        confirmPassword: "securepassword-1",
        password: "securepassword-2",
        token: "Token value"
      }
    };

    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/reset-password/abc-known"]}>
          <ResetPasswordForm {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

    // LoginForm component instance
    const instance = wrapper.find("ResetPasswordForm").instance();

    // Set the state with  mismatch state.
    instance.setState({ userInput: mismatchState.userInput });

    await wait(50); // 50 ms rather than 0 ms to give a potential state change the chance to finish
    wrapper.update();

    // get the reset button
    const resetPassword = wrapper.find('[data-test="reset-password-submit"]');

    // Simulate the form submission
    resetPassword.simulate("submit");

    // The mutation has not called
    await wait(50); // 50 ms rather than 0 ms to give a potential state change the chance to finish
    wrapper.update();

    // Expect error message.
    expect(wrapper.find("p").length).toBe(1);
    expect(wrapper.find("p").text()).toContain("Password do not match");
  });

  it("display and error if password length less than 7", async () => {
    const defaultProps = {
      match: { params: { token: "abc-known-2" } }
    };

    const mocks = [
      {
        request: {
          query: VERIFY_TOKEN_QUERY,
          variables: { token: "abc-known-2" }
        },
        result: {
          data: {
            verifyPasswordResetToken: {
              __typename: "Success",
              message: "",
              success: true
            }
          }
        }
      }
    ];

    // Updated userInput state
    const shortPasswordState = {
      confirmReset: false,
      errors: {
        confirmPassword: "",
        password: ""
      },
      userInput: {
        confirmPassword: "secure",
        password: "secure"
      }
    };

    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/reset-password/abc-known"]}>
          <ResetPasswordForm {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

    // LoginForm component instance
    const instance = wrapper.find("ResetPasswordForm").instance();

    // get the reset button
    const resetPassword = wrapper.find('[data-test="reset-password-submit"]');

    // Set the state with short password state.
    instance.setState({ userInput: shortPasswordState.userInput });

    // Simulate the form submission
    resetPassword.simulate("submit");

    // The mutation has not called
    await wait(50); // 50 ms rather than 0 ms to give a potential state change the chance to finish
    wrapper.update();

    // Expect error message.
    expect(wrapper.find("p").length).toBe(1);
    expect(wrapper.find("p").text()).toContain("Password should be at least 7");
  });

  it("should call a mutation query when everything is fine", async () => {
    const defaultProps = {
      match: { params: { token: "abc-known-3" } }
    };
    // Mock function to reset password
    const resetPassword = jest.fn();

    const mocks: any = [
      {
        request: {
          query: RESET_PASSWORD_MUTATION,
          variables: { token: "abc-known-3", password: "XXXXXXx4" }
        },
        result: () => {
          resetPassword({ token: "abc-known-3", password: "XXXXXXx4" });
          return {
            data: {
              resetPassword: {
                __typename: "User",
                id: "XX"
              }
            }
          };
        }
      },
      {
        request: {
          query: VERIFY_TOKEN_QUERY,
          variables: { token: "abc-known-3" }
        },
        result: {
          data: {
            verifyPasswordResetToken: {
              __typename: "Success",
              message: "",
              success: true
            }
          }
        }
      }
    ];

    // Updated userInput state
    const goodPasswordState = {
      confirmReset: false,
      errors: {
        confirmPassword: "",
        password: ""
      },
      userInput: {
        confirmPassword: "XXXXXXx4",
        password: "XXXXXXx4"
      }
    };

    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/reset-password/abc-known"]}>
          <ResetPasswordForm {...defaultProps} />
        </MemoryRouter>
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

    // LoginForm component instance
    const instance = wrapper.find("ResetPasswordForm").instance();

    // get the reset button
    const resetPasswordButton = wrapper.find(
      '[data-test="reset-password-submit"]'
    );

    // Set the state with short password state.
    instance.setState({ userInput: goodPasswordState.userInput });

    // Simulate the form submission
    resetPasswordButton.simulate("submit");

    // The mutation has not called
    await wait(50); // 50 ms rather than 0 ms to give a potential state change the chance to finish
    wrapper.update();

    expect(resetPassword).toHaveBeenCalled();
    expect(resetPassword).toHaveBeenCalledWith({
      password: "XXXXXXx4",
      token: "abc-known-3"
    });
  });
});
