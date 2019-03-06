import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SpUpNIC from "../../../../components/searchFormComponents/instruments/SpUpNIC";

const onChange = jest.fn();
describe("Grids ", () => {
  it("should render SpUpNIC", () => {
    expect(
      mount(
        <SpUpNIC
          spUpNic={{ errors: {}, name: "SpUpNIC" }}
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
          <SpUpNIC
            spUpNic={{ errors: {}, name: "SpUpNIC" }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
