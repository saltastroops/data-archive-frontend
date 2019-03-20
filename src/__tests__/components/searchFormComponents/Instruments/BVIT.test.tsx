import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import BVIT from "../../../../components/searchFormComponents/instruments/BVIT";

const onChange = jest.fn();
describe("Bvit ", () => {
  it("should be defined", () => {
    expect(
      mount(<BVIT bvit={{ errors: {}, name: "BVIT" }} onChange={onChange} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<BVIT bvit={{ errors: {}, name: "BVIT" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
  });
});
