import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import HRS from "../../../../components/searchFormComponents/instruments/HRS";

const onChange = jest.fn();
describe("Grids ", () => {
  it("should render HRS", () => {
    expect(
      mount(<HRS hrs={{ errors: {}, name: "HRS" }} onChange={onChange} />)
    ).toBeDefined();
  });

  it("should render all grids correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<HRS hrs={{ errors: {}, name: "HRS" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
  });
});
