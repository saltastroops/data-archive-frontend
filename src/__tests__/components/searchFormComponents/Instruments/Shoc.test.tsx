import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import Shoc from "../../../../components/searchFormComponents/instruments/Shoc";

const onChange = jest.fn();
describe("Shoc ", () => {
  it("should be defined", () => {
    expect(
      <Shoc shoc={{ errors: {}, name: "SHOC" }} onChange={onChange} />
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<Shoc shoc={{ errors: {}, name: "SHOC" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
  });
});
