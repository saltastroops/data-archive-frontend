import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SearchForm from "../../../components/SearchForm";
import DataForm from "../../../components/searchFormComponents/DataForm";
import { CalibrationType } from "../../../utils/ObservationQueryParameters";

const onChange = jest.fn();

describe("Data Form", () => {
  const wrapper = mount(
    <DataForm
      general={{ calibrations: new Set<CalibrationType>(), errors: {} }}
      onChange={onChange}
    />
  );

  it("should render", () => {
    expect(wrapper).toBeDefined();
  });

  it("should contains 4 checkbox and 1 select ", () => {
    const inputs = wrapper.find("input.checkbox");
    expect(inputs.length).toEqual(4);
  });

  it("should contains 4 checkbox with names arcs, biases, flats & standards ", () => {
    const arcs = wrapper.find("input.checkbox").get(0).props.name;
    expect(arcs).toEqual("arc");
    const biases = wrapper.find("input.checkbox").get(1).props.name;
    expect(biases).toEqual("bias");
    const flats = wrapper.find("input.checkbox").get(2).props.name;
    expect(flats).toEqual("flat");
    const standards = wrapper.find("input.checkbox").get(3).props.name;
    expect(standards).toEqual("standard");
  });

  it("render correctly", () => {
    expect(
      toJson(
        shallow(
          <DataForm
            general={{ calibrations: new Set<CalibrationType>(), errors: {} }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
