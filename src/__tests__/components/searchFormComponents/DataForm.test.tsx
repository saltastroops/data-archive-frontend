import { mount, ReactWrapper, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SearchForm from "../../../components/SearchForm";
import DataForm from "../../../components/searchFormComponents/DataForm";
import { CalibrationType } from "../../../utils/ObservationQueryParameters";

const onChange = jest.fn();

describe("Data Form", () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(
      <DataForm
        general={{ calibrations: new Set<CalibrationType>(), errors: {} }}
        onChange={onChange}
      />
    );
  });

  it("should render", () => {
    expect(wrapper).toBeDefined();
  });

  it("should render correctly", () => {
    expect(
      toJson(
        shallow(
          <DataForm
            general={{
              calibrations: new Set<CalibrationType>(["arc"]),
              errors: {}
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <DataForm
            general={{
              calibrations: new Set<CalibrationType>(["arc", "standard"]),
              errors: {}
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <DataForm
            general={{
              calibrations: new Set<CalibrationType>([
                "arc",
                "bias",
                "flat",
                "standard"
              ]),
              errors: {}
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });

  it("should call onChange with the correct values", () => {
    // Select flats...
    const flats = wrapper.find('[data-test="flats-checkbox"] input');
    flats.simulate("change", {
      target: { checked: true, name: "flat" }
    });
    expect(onChange).toBeCalledWith({
      calibrations: new Set<CalibrationType>(["flat"]),
      errors: {}
    });

    // ... and unselect them again
    flats.simulate("change", {
      target: { checked: false, name: "flat" }
    });
    expect(onChange).toBeCalledWith({
      calibrations: new Set<CalibrationType>([]),
      errors: {}
    });

    // select arcs
    const arcs = wrapper.find('[data-test="arcs-checkbox"] input');
    arcs.simulate("change", {
      target: { checked: true, name: "arc" }
    });
    expect(onChange).toBeCalledWith({
      calibrations: new Set<CalibrationType>(["arc"]),
      errors: {}
    });
  });
});
