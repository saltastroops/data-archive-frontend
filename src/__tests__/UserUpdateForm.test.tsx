import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import { MemoryRouter } from "react-router";
import wait from "waait";
import App from "../App";
import UserUpdateForm from "../components/UserUpdateForm";
import { UPDATE_USER_MUTATION } from "../graphql/Mutations";
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
    affiliation: "",
    confirmNewPassword: "",
    email: "",
    familyName: "",
    givenName: "",
    id: "",
    newPassword: "",
    password: "",
    username: ""
  },
  userInput: {
    affiliation: "",
    confirmNewPassword: "",
    email: "",
    familyName: "",
    givenName: "",
    id: "",
    newPassword: "",
    password: "",
    username: ""
  }
};

// user update mock mutation
const mocks = [
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variables: {
        ...updatedState
      }
    },
    result: {
      data: {
        updateUser: {
          __typename: "User",
          ...updatedState
        }
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
          affiliation: "",
          confirmNewPassword: "",
          email: "",
          familyName: "",
          givenName: "",
          id: "",
          newPassword: "",
          password: "",
          roles: [],
          username: ""
        }
      }
    }
  }
];

describe("UserUpdateForm Component", () => {
  it("renders the UserUpdateForm having unpopulated props with no errors", () => {
    // UserUpdateForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <UserUpdateForm />
      </MockedProvider>
    );

    // Expect the snapshot to match the UserUpdateForm component.
    expect(toJson(wrapper.find("form"))).toMatchSnapshot();
  });

  it("displays no errors if submitted inputs are all valid", async () => {
    // UserUpdateForm component wrapper.
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <UserUpdateForm />
      </MockedProvider>
    );

    // UserUpdateForm component instance
    const instance: any = wrapper.find("UserUpdateForm").instance();

    // Simulate state change when the affiliation input field value changes.
    inputTyping(wrapper, "affiliation", "Update affiliation");
    // Simulate state change when the confirmNewPassword input field value changes.
    inputTyping(wrapper, "confirmNewPassword", "validupdatepassword");
    // Simulate state change when the emailAddress input field value changes.
    inputTyping(wrapper, "email", "valid@update.address");
    // Simulate state change when the familyName input field value changes.
    inputTyping(wrapper, "familyName", "Update family name");
    // Simulate state change when the givenName input field value changes.
    inputTyping(wrapper, "givenName", "Update given name");
    // Simulate state change when the new password input field value changes.
    inputTyping(wrapper, "newPassword", "validupdatepassword");
    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "oldspassword");
    // Simulate state change when the username input field value changes.
    inputTyping(wrapper, "username", "updateusername");

    // Expect the property affiliation of the state to have been updated with the correct value.
    expect(instance.state.userInput.affiliation).toBe("Update affiliation");

    // Expect the property confirmNewPassword of the state to have been updated with the correct value.
    expect(instance.state.userInput.confirmNewPassword).toBe(
      "validupdatepassword"
    );

    // Expect the property emailAddress of the state to have been updated with the correct value.
    expect(instance.state.userInput.email).toBe("valid@update.address");

    // Expect the property familyName of the state to have been updated with the correct value.
    expect(instance.state.userInput.familyName).toBe("Update family name");

    // Expect the property givenName of the state to have been updated with the correct value.
    expect(instance.state.userInput.givenName).toBe("Update given name");

    // Expect the property newPassword of the state to have been updated with the correct value.
    expect(instance.state.userInput.newPassword).toBe("validupdatepassword");

    // Expect the property password of the state to have been updated with the correct value.
    expect(instance.state.userInput.password).toBe("oldspassword");

    // Expect the property username of the state to have been updated with the correct value.
    expect(instance.state.userInput.username).toBe("updateusername");

    // Expect the button to not be clicked
    expect(wrapper.find('[data-test="update"]').text()).toContain("Update");

    // Simulate the submitting of the form.
    wrapper.find('[data-test="update"]').simulate("submit");

    // Expect the button to hev been clicked
    expect(wrapper.find('[data-test="update"]').text()).toContain(
      "Updating..."
    );

    // Expect no error message.
    expect(wrapper.find("p").length).toBe(0);
  });

  it("displays error message if submitted invalid email address", async () => {
    // UserUpdateForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <UserUpdateForm />
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

    // Simulate state change when the emailAddress input field value changes.
    inputTyping(wrapper, "email", "invalidupdate.email&address");

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "oldspassword");

    // Simulate the submitting of the form.
    wrapper.find('[data-test="update"]').simulate("submit");

    // Expect an error message.
    expect(wrapper.find("p").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find("p").text()).toContain("Email address");
    expect(wrapper.find("p").text()).toContain("invalid");
  });

  it("displays error message if submitted invalid username", () => {
    // UserUpdateForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <UserUpdateForm />
      </MockedProvider>
    );

    // Simulate state change when the username input field value changes.
    inputTyping(wrapper, "username", "Updateusername");

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "oldspassword");

    // Simulate the submitting of the form.
    wrapper.find('[data-test="update"]').simulate("submit");

    // Expect an error message.
    expect(wrapper.find("p").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find("p").text()).toContain("Username");
    expect(wrapper.find("p").text()).toContain("lowercase");
  });

  it("displays error message if submitted invalid password", () => {
    // UserUpdateForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <UserUpdateForm />
      </MockedProvider>
    );

    // Simulate state change when the new password input field value changes.
    inputTyping(wrapper, "newPassword", "update");

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "oldspassword");

    // Simulate the submitting of the form.
    wrapper.find('[data-test="update"]').simulate("submit");

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

  it("displays error message if submitted invalid confirmPassword", () => {
    // UserUpdateForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <UserUpdateForm />
      </MockedProvider>
    );

    // Simulate state change when the new password input field value changes.
    inputTyping(wrapper, "newPassword", "validupdatepassword");
    // Simulate state change when the confirmPassword input field value changes.
    inputTyping(
      wrapper,
      "confirmNewPassword",
      "validupdatepasswordnotmatching"
    );
    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "oldpassword");

    // Simulate the submitting of the form.
    wrapper.find('[data-test="update"]').simulate("submit");

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

  it("should cache values and errors", async () => {
    const wrapper = mount(
      <MockedProvider mocks={[mocks[1]]}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

    // Navigate to the user update form
    const userUpdateFormLink = wrapper.find('a[href="/user-update"]').first();
    click(userUpdateFormLink);

    await wait(0);
    wrapper.update();

    // Fill in an invalid email
    inputTyping(wrapper, "email", "invalid email");

    // Submit the form
    const submitButton = wrapper.find('[data-test="update"]');
    submitButton.simulate("submit");

    await wait(0);
    wrapper.update();

    // The value has been stored in the state, and there is an error
    const userUpdateFormState: any = wrapper.find("UserUpdateForm").state();
    const emailValue = userUpdateFormState.userInput.email;
    expect(emailValue).toEqual("invalid email");
    const emailErrorMessage = userUpdateFormState.errors.email;
    expect(emailErrorMessage.length).toBeGreaterThan(0);

    // Navigate away from the user update form
    const cartLink = wrapper.find('a[href="/cart"]').first();
    click(cartLink);

    await wait(0);
    wrapper.update();

    // No user update form any longer
    expect(wrapper.find("UserUpdateForm").length).toBe(0);

    // Navigate back to the user update form
    click(userUpdateFormLink);

    await wait(0);
    wrapper.update();

    // The values and errors have been re-inserted.
    const newUserUpdateFormState: any = wrapper.find("UserUpdateForm").state();
    expect(newUserUpdateFormState.userInput.email).toEqual(emailValue);
    expect(newUserUpdateFormState.errors.email).toEqual(emailErrorMessage);
  });
});
