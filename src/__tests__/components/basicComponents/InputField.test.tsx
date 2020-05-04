import { ReactWrapper, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import InputField from "../../../components/basicComponents/InputField";

describe("InputField", () => {
  it("should render", () => {
    expect(<InputField />).toBeDefined();
  });

  it("render correctly", () => {
    expect(toJson(shallow(<InputField />))).toMatchSnapshot();
    expect(
      toJson(shallow(<InputField error={"it has error"} />))
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(<InputField name="name" value="value" placeholder="holder" />)
      )
    ).toMatchSnapshot();
  });

  it("should call onChange", () => {
    const onChange = jest.fn();
    const inputField = shallow(<InputField onChange={onChange} />);
    const input = inputField.find("input");
    input
      .find("input")
      .simulate("change", { target: { value: "Input Value" } });
    expect(onChange).toHaveBeenCalled();
  });
});
