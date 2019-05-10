import { mount } from "enzyme";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import { MemoryRouter } from "react-router";
import wait from "waait";
import RequestResetPasswordForm, {
  REQUEST_RESET_MUTATION
} from "../../components/RequestResetPasswordForm";

// Helper function for simulating input field value change.
function inputTyping(wrapper: any, name: string, value: string) {
  wrapper.find(`input[name="${name}"]`).simulate("change", {
    target: { name, value }
  });
}

describe("RequestResetPasswordForm", () => {
  it("renders the RequestResetPasswordForm component correctly", async () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestResetPasswordForm />
      </MockedProvider>
    );
    expect(wrapper).toBeDefined();
  });

  it("successfully display the form", async () => {
    // RequestResetPasswordForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <MemoryRouter initialEntries={["/request-reset-password"]}>
          <RequestResetPasswordForm />
        </MemoryRouter>
      </MockedProvider>
    );

    // Expect email input field
    expect(wrapper.find('InputField[data-test="email"]').length).toBe(1);

    // Expect request button
    expect(wrapper.find('button[data-test="request"]').length).toBe(1);

    // // Expect no error message
    expect(wrapper.find("Message").length).toBe(0);
  });

  it("allows user to update state when trying.", async () => {
    const updatedState = {
      confirmReset: false,
      errors: {
        email: ""
      },
      userInput: {
        email: "email@xxx.xxx"
      }
    };
    const mocks = [
      {
        request: {
          query: REQUEST_RESET_MUTATION,
          variables: { email: "xxx" }
        },
        result: {
          data: {
            verifyPasswordResetToken: {
              __typename: "User",
              id: "XXX"
            }
          }
        }
      }
    ];

    // RequestResetPasswordForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/reset-password/abc-known"]}>
          <RequestResetPasswordForm />
        </MemoryRouter>
      </MockedProvider>
    );

    // LoginForm component instance
    const instance = wrapper.find("RequestResetPasswordForm").instance();

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the email input field value changes
    inputTyping(wrapper, "email", "email@xxx.xxx");

    await wait(50); // 50 ms rather than 0 ms to give a potential state change the chance to finish
    wrapper.update();

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(1);
  });

  it("display error if email address is invalid", async () => {
    const updatedState = {
      confirmReset: false,
      errors: {
        email: ""
      },
      userInput: {
        email: "xxx"
      }
    };
    const mocks = [
      {
        request: {
          query: REQUEST_RESET_MUTATION,
          variables: { email: "xxxx" }
        },
        result: {
          data: {
            verifyPasswordResetToken: {
              __typename: "User",
              id: "XXX"
            }
          }
        }
      }
    ];

    // RequestResetPasswordForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/request-reset-password"]}>
          <RequestResetPasswordForm />
        </MemoryRouter>
      </MockedProvider>
    );

    // RequestResetPasswordForm component instance
    const instance = wrapper.find("RequestResetPasswordForm").instance();

    // get the reset button
    const requestButton = wrapper.find('[data-test="request"]');

    // Set the state with a bad email.
    instance.setState(updatedState.userInput);

    // Simulate the form submission
    requestButton.simulate("submit");
    await wait(0);
    wrapper.update();

    // Expect invalid email text.
    expect(wrapper.find("p").text()).toContain("Email address is invalid");

    // Set the state with a bad email.
    instance.setState({ email: "XXX@x" });

    // Simulate the form submission
    requestButton.simulate("submit");
    await wait(0);
    wrapper.update();

    // Expect invalid text.
    expect(wrapper.find("p").text()).toContain("Email address is invalid");
  });

  it("submits the request sucessfully", async () => {
    const mocks = [
      {
        request: {
          query: REQUEST_RESET_MUTATION,
          variables: { email: "nhlavu@gmail.com" }
        },
        result: {
          data: {
            user: {
              __typename: "User",
              id: "XXX4"
            }
          }
        }
      }
    ];

    // RequestResetPasswordForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/request-reset-password"]}>
          <RequestResetPasswordForm />
        </MemoryRouter>
      </MockedProvider>
    );

    // RequestResetPasswordForm component instance
    const instance = wrapper.find("RequestResetPasswordForm").instance();

    // get the request button
    const requestButton = wrapper.find('[data-test="request"]');

    // Set the state with a good email.
    instance.setState({ userInput: { email: "nhlavu@gmail.com" } });

    // Simulate the form submission
    requestButton.simulate("submit");
    await wait(50);
    wrapper.update();

    // Expect click email message.
    expect(wrapper.find("h1").text()).toContain(
      "Please Click on the link in your email"
    );
  });

  it("submits fail because of no user with email", async () => {
    const mocks = [
      {
        error: new Error("No user"),
        request: {
          query: REQUEST_RESET_MUTATION,
          variables: { email: "nhlavu@gmail.com" }
        }
      }
    ];

    // RequestResetPasswordForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={["/request-reset-password"]}>
          <RequestResetPasswordForm />
        </MemoryRouter>
      </MockedProvider>
    );

    // RequestResetPasswordForm component instance
    const instance = wrapper.find("RequestResetPasswordForm").instance();

    // get the request button
    const requestButton = wrapper.find('[data-test="request"]');

    // Set the state with a good email.
    instance.setState({ userInput: { email: "nhlavu@gmail.com" } });

    // Simulate the form submission
    requestButton.simulate("submit");
    await wait(50);
    wrapper.update();

    // Expect a graphQL rrror.
    expect(wrapper.find("Message").text()).toContain("No user");
  });
});
