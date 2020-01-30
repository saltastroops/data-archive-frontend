import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import wait from "waait";
import TargetTypesSelector from "../../../components/searchFormComponents/TargetTypesSelector";
import { GALAXY, ISM, STAR, TargetType } from "../../../utils/TargetType";

describe("TargetTypesSelector", () => {
  it("should render correctly with no target types", () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TargetTypesSelector
        onChange={onChange}
        targetTypes={new Set<TargetType>()}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("should render correctly with target types", () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TargetTypesSelector
        onChange={onChange}
        targetTypes={new Set<TargetType>([GALAXY, ISM])}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("should call the onChange method with the correct argument when adding a target type", async () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TargetTypesSelector
        onChange={onChange}
        targetTypes={new Set<TargetType>([GALAXY, STAR])}
      />
    );
    const ismCheckbox = wrapper.find('input[data-test="ism"]');
    ismCheckbox.simulate("change", { target: { checked: true, value: ISM } });
    await wait(0);
    expect(onChange).toHaveBeenCalledWith(
      new Set<TargetType>([GALAXY, ISM, STAR])
    );
  });

  it("should call the onChange method with the correct argument when removing a target type", async () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TargetTypesSelector
        onChange={onChange}
        targetTypes={new Set<TargetType>([GALAXY, STAR])}
      />
    );
    const ismCheckbox = wrapper.find('input[data-test="galaxy"]');
    ismCheckbox.simulate("change", {
      target: { checked: false, value: GALAXY }
    });
    await wait(0);
    expect(onChange).toHaveBeenCalledWith(
      new Set<TargetType>([STAR])
    );
  });
});
