import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import Hrs from "../../../../components/searchFormComponents/instruments/Hrs";

const onChange = jest.fn();
describe("Hrs ", () => {
  it("should be defined", () => {
    expect(
      <Hrs hrs={{ errors: {}, name: "HRS" }} onChange={onChange} />
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<Hrs hrs={{ errors: {}, name: "HRS" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
  });
});
