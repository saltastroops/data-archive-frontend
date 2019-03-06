import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import Hrs from "../../../../components/searchFormComponents/instruments/Hrs";

const onChange = jest.fn();
describe("Grids ", () => {
  it("should render Hrs", () => {
    expect(
      mount(<Hrs hrs={{ errors: {}, name: "HRS" }} onChange={onChange} />)
    ).toBeDefined();
  });

  it("should render all grids correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<Hrs hrs={{ errors: {}, name: "HRS" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
  });
});
