import * as React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import RegistrationInputField from "../RegistrationInputField";

describe("RegistrationInputField Component", () => {
  it("renders the RegistrationInputField having unpopulated props with no errors", () => {
    const wrapper = shallow(<RegistrationInputField />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("renders the RegistrationInputField having populated props with no errors", () => {
    const wrapper = shallow(
      <RegistrationInputField
        name={"username"}
        label={"Username"}
        value={""}
        onChange={() => {}}
        placeholder={""}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
