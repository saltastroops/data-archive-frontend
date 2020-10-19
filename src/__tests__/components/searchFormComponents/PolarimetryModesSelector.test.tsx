import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import wait from "waait";
import PolarimetryModesSelector from "../../../components/searchFormComponents/PolarimetryModesSelector";
import { RSSPolarimetryMode } from "../../../utils/ObservationQueryParameters";

describe("PolarimetryModesSelector", () => {
  it("should render correctly with no polarimetry modes", () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <PolarimetryModesSelector
        onChange={onChange}
        polarimetryModes={new Set<RSSPolarimetryMode>()}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("should render correctly with polarimetry modes", () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <PolarimetryModesSelector
        onChange={onChange}
        polarimetryModes={new Set<RSSPolarimetryMode>(["LINEAR", "CIRCULAR"])}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("should call the onChange method with the correct argument when adding a polarimetry mode", async () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <PolarimetryModesSelector
        onChange={onChange}
        polarimetryModes={new Set<RSSPolarimetryMode>(["LINEAR", "CIRCULAR"])}
      />
    );
    const linearHiCheckbox = wrapper.find('input[data-test="linear-hi"]');
    linearHiCheckbox.simulate("change", {
      target: { checked: true, value: "LINEAR HI" },
    });
    await wait(0);
    expect(onChange).toHaveBeenCalledWith(
      new Set<RSSPolarimetryMode>(["LINEAR", "CIRCULAR", "LINEAR HI"])
    );
  });

  it("should call the onChange method with the correct argument when removing a polarimetry mode", async () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <PolarimetryModesSelector
        onChange={onChange}
        polarimetryModes={new Set<RSSPolarimetryMode>(["LINEAR", "CIRCULAR"])}
      />
    );
    const circularCheckbox = wrapper.find('input[data-test="circular"]');
    circularCheckbox.simulate("change", {
      target: { checked: false, value: "CIRCULAR" },
    });
    await wait(0);
    expect(onChange).toHaveBeenCalledWith(
      new Set<RSSPolarimetryMode>(["LINEAR"])
    );
  });
});
