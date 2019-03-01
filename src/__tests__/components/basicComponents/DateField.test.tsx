import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import DateField from "../../../components/basicComponents/DateField";

describe("InpuField", () => {
  const wrapper = shallow(<DateField />);
  it("should render", () => {
    expect(wrapper).toBeDefined();
  });

  it("always renders a div", () => {
    const divs = wrapper.find("div");
    expect(divs.length).toBeGreaterThan(0);
  });
  it("always contains an input tag with of type date", () => {
    const inputs = wrapper.find("input");
    expect(inputs.length).toEqual(1);
    const input = wrapper.find("input").get(0);
    expect(input.props.type).toEqual("date");
  });
  it("render correctly", () => {
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(
      toJson(shallow(<DateField error={"it has error"} />))
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(<DateField name="name" value="value" placeholder="holder" />)
      )
    ).toMatchSnapshot();
  });
});
