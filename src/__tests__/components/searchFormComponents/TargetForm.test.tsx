import { mount, ReactWrapper, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SearchForm from "../../../components/SearchForm";
import TargetForm from "../../../components/searchFormComponents/TargetForm";

describe("TargetForm", () => {
  const onChange = jest.fn();

  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(
      <TargetForm
        target={{
          errors: {},
          resolver: "Simbad",
          searchConeRadiusUnits: "arcseconds"
        }}
        onChange={onChange}
      />
    );

    onChange.mockReset();
  });

  it("should render", () => {
    expect(wrapper).toBeDefined();
  });

  it("should render correctly", () => {
    expect(
      toJson(
        shallow(
          <TargetForm
            target={{
              errors: {},
              resolver: "Simbad",
              searchConeRadiusUnits: "arcseconds"
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();

    expect(
      toJson(
        shallow(
          <TargetForm
            target={{
              errors: {},
              name: "NGC 1234",
              resolver: "Simbad",
              searchConeRadiusUnits: "arcseconds"
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();

    expect(
      toJson(
        shallow(
          <TargetForm
            target={{
              errors: {
                name: "this is an error"
              },
              resolver: "Simbad",
              searchConeRadius: "12.1",
              searchConeRadiusUnits: "arcminutes"
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });

  it("should find target change defined on target search form", () => {
    SearchForm.prototype.targetChange = jest.fn();
    expect(SearchForm.prototype.targetChange).toBeDefined();
  });

  it("should call onChange with targetName", () => {
    const target = wrapper.find('input[data-test="target-name-input"]');
    target.simulate("change", "");
    expect(onChange).toBeCalled();
  });

  it("should call onChange with right ascension", () => {
    let value: any;
    let event: any;
    const resolverForm = wrapper.find(
      'input[data-test="right-ascension-input"]'
    );
    const resolver = resolverForm.find("input");
    value = "123.1";
    event = { target: { value, name: "rightAscension" } };
    resolver.simulate("change", event);
    expect(onChange).toBeCalledWith({
      errors: { rightAscension: "" },
      resolver: "Simbad",
      rightAscension: "123.1",
      searchConeRadiusUnits: "arcseconds"
    });

    value = "";
    event = { target: { value, name: "rightAscension" } };
    resolver.simulate("change", event);
    expect(onChange).toBeCalledWith({
      errors: { rightAscension: "" },
      resolver: "Simbad",
      rightAscension: "",
      searchConeRadiusUnits: "arcseconds"
    });

    value = undefined;
    event = { target: { value, name: "rightAscension" } };
    resolver.simulate("change", event);
    expect(onChange).toBeCalledWith({
      errors: { rightAscension: "" },
      resolver: "Simbad",
      rightAscension: "",
      searchConeRadiusUnits: "arcseconds"
    });
  });

  it("should call onChange for selectors as well", () => {
    const resolver = wrapper.find('select[data-test="resolver-select"]');
    resolver.simulate("change", "");
    expect(onChange).toBeCalled();

    const rUnits = wrapper.find('select[data-test="radius-units-select"]');
    rUnits.simulate("change", "");
    expect(onChange).toBeCalled();
  });
});