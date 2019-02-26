import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import { SIGNUP_MUTATION } from "../../../graphql/Mutations";
import RegistrationForm from "../RegistrationForm";

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
    affiliation: "",
    confirmPassword: "",
    email: "",
    familyName: "",
    givenName: "",
    password: "",
    username: ""
  }
};

// Updated userInput state
const updatedState = {
  errors: [],
  userInput: {
    affiliation: "UCT",
    confirmPassword: "securepassword",
    email: "valid@email.address",
    familyName: "Smith",
    givenName: "John",
    password: "securepassword",
    username: "sj"
  }
};

// sign up mock mutation
const mocks = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        ...updatedState.userInput
      }
    },
    result: {
      data: {
        signup: {
          __typename: "User",
          ...updatedState.userInput,
          id: "1"
        }
      }
    }
  }
];

describe("RegistrationForm Component", () => {
  it("renders the RegistrationForm having unpopulated props with no errors", async () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm
          userInput={initialState.userInput}
          errors={initialState.errors}
        />
      </MockedProvider>
    );
    // Expect the snapshot to match the RegistrationForm component.
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("displays no errors if submitted inputs are all valid", async () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RegistrationForm
          userInput={updatedState.userInput}
          errors={updatedState.errors}
        />
      </MockedProvider>
    );

    // RegistrationForm component instance
    const instance = wrapper.find("RegistrationForm").instance() as any;

    // Spy on the setState function.
    const setState = jest.spyOn(instance, "setState");

    // Simulate state change when the affiliation input field value changes.
    inputTyping(wrapper, "affiliation", "UCT");
    // Simulate state change when the confirmPassword input field value changes.
    inputTyping(wrapper, "confirmPassword", "securepassword");
    // Simulate state change when the emailAddress input field value changes.
    inputTyping(wrapper, "email", "valid@email.address");
    // Simulate state change when the familyName input field value changes.
    inputTyping(wrapper, "familyName", "Smith");
    // Simulate state change when the givenName input field value changes.
    inputTyping(wrapper, "givenName", "John");
    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "securepassword");
    // Simulate state change when the username input field value changes.
    inputTyping(wrapper, "username", "sj");

    // Expect setState to have been called
    expect(setState.mock.calls.length).toBe(7);

    // Expect the property affiliation of the state to have been updated with the correct value.
    expect(instance.state.userInput.affiliation).toBe("UCT");

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

    // Expect the button to not be clicked
    expect(wrapper.find(".signUp").text()).toContain("Sign up");

    // Simulate the submiting of the form.
    wrapper.find(".signUp").simulate("submit");

    // Expect the button to hev beeen clicked
    expect(wrapper.find(".signUp").text()).toContain("Signing up");

    // Expect no error message.
    expect(wrapper.find(".error").length).toBe(0);
  });

  it("displays error message if submitted ivalid given name", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm
          userInput={updatedState.userInput}
          errors={updatedState.errors}
        />
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
    wrapper.find(".signUp").simulate("submit");

    // Expect an error message.
    expect(wrapper.find(".error").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find(".error").text()).toContain("Given name");
    expect(wrapper.find(".error").text()).toContain("empty");
  });

  it("displays error message if submitted invalid family name", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm
          userInput={updatedState.userInput}
          errors={updatedState.errors}
        />
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
    wrapper.find(".signUp").simulate("submit");

    // Expect an error message.
    expect(wrapper.find(".error").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find(".error").text()).toContain("Family name");
    expect(wrapper.find(".error").text()).toContain("empty");
  });

  it("displays error message if submitted invalid family name", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm
          userInput={updatedState.userInput}
          errors={updatedState.errors}
        />
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
    wrapper.find(".signUp").simulate("submit");

    // Expect an error message.
    expect(wrapper.find(".error").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find(".error").text()).toContain("Email address");
    expect(wrapper.find(".error").text()).toContain("invalid");
  });

  it("displays error message if submitted invalid username", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm
          userInput={updatedState.userInput}
          errors={updatedState.errors}
        />
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
    wrapper.find(".signUp").simulate("submit");

    // Expect an error message.
    expect(wrapper.find(".error").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find(".error").text()).toContain("Username");
    expect(wrapper.find(".error").text()).toContain("lowercase");
  });

  it("displays error message if submitted invalid password", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm
          userInput={updatedState.userInput}
          errors={updatedState.errors}
        />
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
    wrapper.find(".signUp").simulate("submit");

    // Expect an error message.
    expect(wrapper.find(".error").length).toBe(2);

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

  it("displays error message if submitted invalid confirmPassword", () => {
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <RegistrationForm
          userInput={updatedState.userInput}
          errors={updatedState.errors}
        />
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
    wrapper.find(".signUp").simulate("submit");

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
    ).toContain("do not");
  });
});
