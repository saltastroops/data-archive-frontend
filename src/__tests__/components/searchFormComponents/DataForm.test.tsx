import { mount, ReactWrapper, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import DataForm from "../../../components/searchFormComponents/DataForm";
import { ProductType } from "../../../utils/ObservationQueryParameters";

const onChange = jest.fn();

describe("Data Form", () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(
      <DataForm
        general={{ productTypes: new Set<ProductType>(), errors: {} }}
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
              errors: {},
              productTypes: new Set<ProductType>(["arc"])
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
              errors: {},
              productTypes: new Set<ProductType>(["Arc", "Standard"])
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
              errors: {},
              productTypes: new Set<ProductType>([
                "Arc",
                "Bias",
                "Flat",
                "Standard"
              ])
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
      target: { checked: true, name: "Flat" }
    });
    expect(onChange).toBeCalledWith({
      errors: {},
      productTypes: new Set<ProductType>(["Flat"])
    });

    // ... and unselect them again
    flats.simulate("change", {
      target: { checked: false, name: "Flat" }
    });
    expect(onChange).toBeCalledWith({
      errors: {},
      productTypes: new Set<ProductType>([])
    });

    // select arcs
    const arcs = wrapper.find('[data-test="arcs-checkbox"] input');
    arcs.simulate("change", {
      target: { checked: true, name: "Arc" }
    });
    expect(onChange).toBeCalledWith({
      errors: {},
      productTypes: new Set<ProductType>(["Arc"])
    });
  });
});
