import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SALTICAM from "../../../../components/searchFormComponents/instruments/SALTICAM";

const onChange = jest.fn();
describe("Grids ", () => {
  it("should render SALTICAM", () => {
    expect(
      mount(
        <SALTICAM
          salticam={{ errors: {}, name: "SALTICAM" }}
          onChange={onChange}
        />
      )
    ).toBeDefined();
  });

  it("should render all grids correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(
          <SALTICAM
            salticam={{ errors: {}, name: "SALTICAM" }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
