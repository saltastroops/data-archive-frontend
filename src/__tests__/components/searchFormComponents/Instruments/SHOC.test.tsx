import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SHOC from "../../../../components/searchFormComponents/instruments/SHOC";

const onChange = jest.fn();
describe("SHOC ", () => {
  it("should be defined", () => {
    expect(
      mount(<SHOC shoc={{ errors: {}, name: "SHOC" }} onChange={onChange} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<SHOC shoc={{ errors: {}, name: "SHOC" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
  });
});
