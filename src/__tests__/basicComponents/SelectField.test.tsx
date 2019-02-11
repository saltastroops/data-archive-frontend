import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SelectField from "../../components/basicComponents/SelectField";

describe("SelectField", () => {
  const wrapper = shallow(<SelectField options={["aaa", "bbb", "ccc"]} />);
  it("should render", () => {
    expect(wrapper).toBeDefined();
  });

  it("always renders a div", () => {
    const divs = wrapper.find("div");
    expect(divs.length).toBeGreaterThan(0);
  });
  it("always contains a select tag.", () => {
    const select = wrapper.find("select");
    expect(select.length).toEqual(1);
    const options = wrapper.find("select");
    expect(options.children().length).toBeGreaterThan(0);
  });
  it("select tag children are options and greater than 0.", () => {
    const options = wrapper.find("select");
    expect(options.children().get(0).type).toEqual("option");
    expect(options.children().length).toBeGreaterThan(0);
  });
  it("render correctly", () => {
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <SelectField
            options={["aaa", "bbb", "ccc"]}
            name="name"
            value="value"
          />
        )
      )
    ).toMatchSnapshot();
  });
});
