import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SHOC from "../../../../components/searchFormComponents/instruments/SHOC";

const onChange = jest.fn();
describe("Grids ", () => {
  it("should render SHOC", () => {
    expect(
      mount(<SHOC shoc={{ errors: {}, name: "SHOC" }} onChange={onChange} />)
    ).toBeDefined();
  });

  it("should render all grids correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<SHOC shoc={{ errors: {}, name: "SHOC" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
  });
});
