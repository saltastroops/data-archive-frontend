import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import Salticam from "../../../../components/searchFormComponents/instruments/Salticam";
import { ISalticam } from "../../../../utils/ObservationQueryParameters";

describe("Salticam ", () => {
  it("should be defined", () => {
    const onChange = jest.fn();
    expect(
      mount(
        <Salticam
          salticam={{ errors: {}, name: "Salticam" }}
          onChange={onChange}
        />
      )
    ).toBeDefined();
  });

  it("should render correctly without detector mode and filter", () => {
    // Use mount instead of shallow for better snapshots
    const onChange = jest.fn();
    expect(
      toJson(
        mount(
          <Salticam
            salticam={{ errors: {}, name: "Salticam" }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });

  it("should render correctly with detector mode and filter", () => {
    // Use mount instead of shallow for better snapshots
    const onChange = jest.fn();
    expect(
      toJson(
        mount(
          <Salticam
            salticam={{
              detectorMode: "Normal",
              errors: {},
              filter: "V-S1",
              name: "Salticam"
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });

  it("should call the onChange method if the detector mode changes", () => {
    const onChange = jest.fn();
    const salticam: ISalticam = {
      detectorMode: "Normal",
      errors: {},
      name: "Salticam"
    };
    const wrapper = mount(<Salticam onChange={onChange} salticam={salticam} />);
    const detectorModeSelect = wrapper.find('[name="detectorMode"] select');
    detectorModeSelect.simulate("change", {
      target: { name: "detectorMode", value: "Slot Mode" }
    });
    expect(onChange).toHaveBeenCalledWith({
      ...salticam,
      detectorMode: "Slot Mode"
    });
  });

  it("should call the onChange method if the filter changes", () => {
    const onChange = jest.fn();
    const salticam: ISalticam = {
      errors: {},
      filter: "V-S1",
      name: "Salticam"
    };
    const wrapper = mount(<Salticam onChange={onChange} salticam={salticam} />);
    const detectorModeSelect = wrapper.find('[name="filter"] select');
    detectorModeSelect.simulate("change", {
      target: { name: "filter", value: "B-S1" }
    });
    expect(onChange).toHaveBeenCalledWith({ ...salticam, filter: "B-S1" });
  });
});
