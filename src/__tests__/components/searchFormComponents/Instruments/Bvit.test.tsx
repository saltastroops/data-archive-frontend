import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import Bvit from "../../../../components/searchFormComponents/instruments/Bvit";

const onChange = jest.fn();
describe("Bvit ", () => {
  it("should be defined", () => {
    expect(
      <Bvit bvit={{ errors: {}, name: "BVIT" }} onChange={onChange} />
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<Bvit bvit={{ errors: {}, name: "BVIT" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
  });
});
