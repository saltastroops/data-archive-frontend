import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import InputField from "../../components/basicComponents/InputField";

describe("InpuField", () => {
  const wrapper = shallow(<InputField />);
  it("should render", () => {
    expect(wrapper).toBeDefined();
  });

  it("always renders a div", () => {
    const divs = wrapper.find("div");
    expect(divs.length).toBeGreaterThan(0);
  });
  it("always contains an input tag with of type text", () => {
    const inputs = wrapper.find("input");
    expect(inputs.length).toEqual(1);
    const input = wrapper.find("input").get(0);
    expect(input.props.type).toEqual("text");
  });
  it("render correctly", () => {
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(
      toJson(shallow(<InputField error={"it has error"} />))
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(<InputField name="name" value="value" placeholder="holder" />)
      )
    ).toMatchSnapshot();
  });
});
