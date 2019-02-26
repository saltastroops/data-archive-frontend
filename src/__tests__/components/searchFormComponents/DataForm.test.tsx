import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SearchForm from "../../../components/SearchForm";
import DataForm from "../../../components/searchFormComponents/DataForm";

const onChange = jest.fn();

describe("Data Form", () => {
  const wrapper = mount(<DataForm data={{ errors: {} }} onChange={onChange} />);

  it("should render", () => {
    expect(wrapper).toBeDefined();
  });

  it("should contains 4 checkbox and 1 select ", () => {
    const select = wrapper.find("div.data-type-select");
    expect(select.length).toEqual(1);
    const inputs = wrapper.find("input.checkbox");
    expect(inputs.length).toEqual(4);
  });

  it("should contains 4 checkbox with names arcs, biases, flats & standards ", () => {
    const arcs = wrapper.find("input.checkbox").get(0).props.name;
    expect(arcs).toEqual("arcs");
    const biases = wrapper.find("input.checkbox").get(1).props.name;
    expect(biases).toEqual("biases");
    const flats = wrapper.find("input.checkbox").get(2).props.name;
    expect(flats).toEqual("flats");
    const standards = wrapper.find("input.checkbox").get(3).props.name;
    expect(standards).toEqual("standards");
  });

  it("should contains one select with name dataType", () => {
    const dataType = wrapper.find("select").get(0).props.name;
    expect(dataType).toEqual("dataType");
  });

  it("render correctly", () => {
    expect(
      toJson(
        shallow(
          <DataForm
            data={{ arcs: true, biases: false, errors: {} }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <DataForm
            data={{
              arcs: true,
              biases: false,
              errors: {},
              flats: false,
              standards: true
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
            data={{
              arcs: true,
              biases: true,
              errors: {},
              flats: true,
              standardss: true
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });

  it("should call onChange with any thing", () => {
    const flatForm = wrapper.find("input#flats-checkbox");
    const flats = flatForm.find("input");
    flats.simulate("change", {
      target: { checked: true, name: "flats" }
    });
    expect(onChange).toBeCalledWith({
      errors: {},
      flats: true
    });
    flats.simulate("change", {
      target: { checked: false, name: "flats" }
    });
    expect(onChange).toBeCalledWith({
      errors: {},
      flats: false
    });
    const arcForm = wrapper.find("input#arcs-checkbox");
    const arcs = arcForm.find("input");
    arcs.simulate("change", {
      target: { checked: true, name: "arcs" }
    });
    expect(onChange).toBeCalledWith({
      arcs: true,
      errors: {}
    });

    const dataTypeForm = wrapper.find("select");
    const dataType = dataTypeForm.find("select");
    dataType.simulate("change", {
      target: { value: "raw", name: "dataType" }
    });
    expect(onChange).toBeCalledWith({
      dataType: "raw",
      errors: {}
    });
  });
});
