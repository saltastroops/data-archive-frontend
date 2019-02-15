import { mount, shallow } from "enzyme";
import * as React from "react";
import TargetForm, {
  ITargetSearchForm
} from "../../components/searchFormComponents/TargetForm";

describe("TargetForm", () => {
  const props: ITargetSearchForm = {
    dec: { value: "0" },
    ra: { value: "0" },
    radius: { value: "0" },
    radiusUnits: { value: "0" },
    resolver: { value: "0" },
    targetName: { name }
  };
  const wrapper = mount(<TargetForm {...props} />);
  it("should render", () => {
    const shal = shallow(<TargetForm {...props} />);
    expect(shal).toBeDefined();
  });
  it("should contains 4 inputs and 2 selects", () => {
    const inputs = wrapper.find("input");
    expect(inputs.length).toEqual(4);
    const select = wrapper.find("select");
    expect(select.length).toEqual(2);
  });
  it("should contains input of name target", () => {
    const select = wrapper.find("input");
    expect(select.length).toEqual(4);
  });
});
