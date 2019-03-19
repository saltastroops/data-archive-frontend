import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import HIPPO from "../../../../components/searchFormComponents/instruments/HIPPO";

const onChange = jest.fn();
describe("Grids ", () => {
  it("should render HIPPO", () => {
    expect(
      mount(<HIPPO hippo={{ errors: {}, name: "HIPPO" }} onChange={onChange} />)
    ).toBeDefined();
  });

  it("should render all grids correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(
          <HIPPO hippo={{ errors: {}, name: "HIPPO" }} onChange={onChange} />
        )
      )
    ).toMatchSnapshot();
  });
});
