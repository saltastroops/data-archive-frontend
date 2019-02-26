import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
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
    // RegistrationForm component wrapper.
    const wrapper = mount(
      <LoginForm
        userInput={initialState.userInput}
        errors={initialState.errors}
      />
    );
    // Expect the snapshot to match the RegistrationForm component.
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  // TODO
});
