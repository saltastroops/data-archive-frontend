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

const alert = jest.fn();
window.alert = alert;

// Helper function for simulating input field value change.
function inputTyping(wrapper: any, name: string, value: string) {
  wrapper.find(`input[name="${name}"]`).simulate("change", {
    target: { name, value }
  });
}

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
    const mocks = [
      {
        request: {
          query: UPDATE_USER_MUTATION,
          variables: {
            affiliation: "",
            confirmNewPassword: "",
            email: "",
            familyName: "Doe",
            givenName: "John",
            id: "",
            newPassword: "",
            password: "",
            roles: [],
            username: ""
          }
        },
        result: {
          data: {
            user: {}
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
              affiliation: "SAAO",
              email: "doe@example.com",
              familyName: "Doe",
              givenName: "John",
              id: "1",
              roles: [],
              username: "john.doe"
            }
          }
        }
      }
    ];

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
    inputTyping(wrapper, "password", "oldpassword");
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
    expect(instance.state.userInput.password).toBe("oldpassword");

    // Expect the property username of the state to have been updated with the correct value.
    expect(instance.state.userInput.username).toBe("updateusername");

    // Expect the button not to indicate loading
    expect(wrapper.find('[data-test="update"]').text()).toContain("Update");

    // Simulate the submitting of the form
    wrapper.find('[data-test="update"]').simulate("submit");

    // Expect the button to indicate loading
    expect(wrapper.find('[data-test="update"]').text()).toContain(
      "Updating..."
    );

    // Expect no error message.
    expect(wrapper.find("p").length).toBe(0);
  });

  it("displays an error message if an invalid email address is submitted", async () => {
    // UserUpdateForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <UserUpdateForm />
      </MockedProvider>
    );

    // Simulate state change when the emailAddress input field value changes
    inputTyping(wrapper, "email", "invalidupdate.email&address");

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "oldpassword");

    // Simulate the submitting of the form
    wrapper.find('[data-test="update"]').simulate("submit");

    // Expect an error message
    expect(wrapper.find("p").length).toBe(1);

    // Expect a meaningful error message
    expect(wrapper.find("p").text()).toContain("Email address");
    expect(wrapper.find("p").text()).toContain("invalid");
  });

  it("displays an error message if an invalid username is submitted", () => {
    // UserUpdateForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <UserUpdateForm />
      </MockedProvider>
    );

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "oldpassword");

    // Simulate state change when the username input field value changes.
    inputTyping(wrapper, "username", "Updateusername");

    // Simulate the submitting of the form.
    wrapper.find('[data-test="update"]').simulate("submit");

    // Expect an error message.
    expect(wrapper.find("p").length).toBe(1);

    // Expect meaningful error message
    expect(wrapper.find("p").text()).toContain("Username");
    expect(wrapper.find("p").text()).toContain("lowercase");
  });

  it("displays an error message if an invalid password is submitted", () => {
    // UserUpdateForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <UserUpdateForm />
      </MockedProvider>
    );

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "oldpassword");

    // Simulate state change when the new password input field value changes
    inputTyping(wrapper, "newPassword", "update");

    // Simulate state change when the password input field value changes
    inputTyping(wrapper, "password", "oldpassword");

    // Simulate the submitting of the form
    wrapper.find('[data-test="update"]').simulate("submit");

    // Expect an error message
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
    // UserUpdateForm component wrapper.
    const wrapper = mount(
      <MockedProvider>
        <UserUpdateForm />
      </MockedProvider>
    );

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "oldpassword");

    // Simulate state change when the new password input field value changes
    inputTyping(wrapper, "newPassword", "validupdatepassword");

    // Simulate state change when the confirmPassword input field value changes
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
    // As we are about to mount the App (rather than just the user update form)
    // we need to provide a user query.
    const mocks = [
      {
        request: {
          query: USER_QUERY
        },
        result: {
          data: {
            user: {
              __typename: "User",
              affiliation: "SAAO",
              email: "john.doe@example.com",
              familyName: "Doe",
              givenName: "John",
              id: "1",
              roles: [],
              username: "john"
            }
          }
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MockedProvider>
    );

    // Wait for the user query to finish
    await wait(0);
    wrapper.update();

    // Navigate to the user update form
    const userUpdateFormLink = wrapper.find('a[href="/user-update"]').first();
    click(userUpdateFormLink);

    await wait(0);
    wrapper.update();

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "oldpassword");

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

    // The values and errors have been re-inserted
    const newUserUpdateFormState: any = wrapper.find("UserUpdateForm").state();
    expect(newUserUpdateFormState.userInput.email).toEqual(emailValue);
    expect(newUserUpdateFormState.errors.email).toEqual(emailErrorMessage);
  });

  it("successfully calls the user update mutation with the correct content", async () => {
    const updateUser = jest.fn();
    const mocks = [
      {
        request: {
          query: UPDATE_USER_MUTATION,
          variables: {
            affiliation: "",
            email: "",
            familyName: "Doe",
            givenName: "John",
            id: "",
            newPassword: "",
            password: "oldpassword",
            username: ""
          }
        },
        result: () => {
          updateUser();
          return {
            data: { id: "1" } // The return value is not used
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
              affiliation: "SAAO",
              email: "john.doe@example.com",
              familyName: "Doe",
              givenName: "John",
              id: "1",
              roles: [],
              username: "john"
            }
          }
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <UserUpdateForm />
      </MockedProvider>
    );

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "oldpassword");

    // Fill in a given name
    inputTyping(wrapper, "givenName", "John");

    // Fill in a family name
    inputTyping(wrapper, "familyName", "Doe");

    // The mutation has not been called (yet)
    expect(updateUser).not.toHaveBeenCalled();

    // Submit the form
    alert.mockReset();
    const submitButton = wrapper.find('[data-test="update"]');
    submitButton.simulate("submit");

    // The mutation has been called
    await wait(0);
    wrapper.update();
    expect(updateUser).toHaveBeenCalled();

    // An alert with the success message was shown
    expect(alert).toHaveBeenCalledWith("Successfully updated.");
  });

  it("should show an error if submission fails", async () => {
    const mocks = [
      {
        error: new Error("The server is having a coffee break!"),
        request: {
          query: UPDATE_USER_MUTATION,
          variables: {
            affiliation: "",
            email: "",
            familyName: "",
            givenName: "John",
            id: "",
            newPassword: "",
            password: "oldpassword",
            username: ""
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <UserUpdateForm />
      </MockedProvider>
    );

    // Simulate state change when the password input field value changes.
    inputTyping(wrapper, "password", "oldpassword");

    // Fill in a given name
    inputTyping(wrapper, "givenName", "John");

    // There is no error (yet)
    expect(wrapper.find("p.error").length).toBe(0);

    // Submit the form
    alert.mockReset();
    const submitButton = wrapper.find('[data-test="update"]');
    submitButton.simulate("submit");

    // There is an error now.
    await wait(50); // 50 ms rather than 0 ms to give the state update a chance to finish
    wrapper.update();
    expect(wrapper.find("p.error").length).toBe(1);
  });
});
