import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SelectField, {
  AnyOption
} from "../../../components/basicComponents/SelectField";

describe("SelectField", () => {
  const wrapper = mount(
    <SelectField name="name">
      <AnyOption />
      {["aaa", "bbb", "ccc"].map(t => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </SelectField>
  );
  it("should render", () => {
    expect(wrapper).toBeDefined();
  });

  it("always renders a div", () => {
    const divs = wrapper.find("div");
    expect(divs.length).toBeGreaterThan(0);
  });
  it("always contains a select tag.", () => {
    const select = wrapper.find("div.select");
    expect(select.length).toEqual(1);
    const options = wrapper.find("div.select");
    expect(options.children().length).toBeGreaterThan(0);
  });
  it("select tag children are options and greater than 0.", () => {
    const options = wrapper.find("select");
    expect(options.children().get(1).type).toEqual("option");
    expect(options.children().length).toBeGreaterThan(0);
  });
  it("render correctly", () => {
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <SelectField name="name">
            <AnyOption />
            {["aaa", "bbb", "ccc"].map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectField>
        )
      )
    ).toMatchSnapshot();
  });
});
