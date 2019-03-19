import { shallow, mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import BVIT from "../../../../components/searchFormComponents/instruments/BVIT";

const onChange = jest.fn();
describe("Grids ", () => {
  it("should render BVIT", () => {
    expect(
      shallow(<BVIT bvit={{ errors: {}, name: "BVIT" }} onChange={onChange} />)
    ).toBeDefined();
  });

  it("should render all grids correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<BVIT bvit={{ errors: {}, name: "BVIT" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
  });
});
