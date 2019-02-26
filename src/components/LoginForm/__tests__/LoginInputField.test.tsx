import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import LoginInputField from "../LoginInputField";

describe("LoginInputField Component", () => {
  it("renders the LoginInputField having unpopulated props with no errors", () => {
    const wrapper = shallow(<LoginInputField />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders the LoginInputField having populated props with no errors", () => {
    const wrapper = shallow(
      <LoginInputField
        name={"username"}
        label={"Username"}
        value={""}
        onChange={() => ({})}
        placeholder={""}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
