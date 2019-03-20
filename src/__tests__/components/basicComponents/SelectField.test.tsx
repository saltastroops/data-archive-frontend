import { shallow, ShallowWrapper } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SelectField from "../../../components/basicComponents/SelectField";

describe("SelectField", () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const onChange = () => {
      // Do nothing
    };

    wrapper = shallow(
      <SelectField className="danger is-large" onChange={onChange} value="bbb">
        <option value="aaa">AAA</option>
        <option value="bbb">BBB</option>
        <option value="ccc">CCC</option>
      </SelectField>
    );
  });

  it("should render", () => {
    expect(wrapper).toBeDefined();
  });

  it("should render correctly", () => {
    expect(toJson(wrapper)).toMatchSnapshot();

    const noClassNMame = shallow(
      <SelectField value="aaa">
        <option value="aaa">AAA</option>
      </SelectField>
    );
    expect(toJson(noClassNMame)).toMatchSnapshot();
  });
});
