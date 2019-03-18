import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SpUpNIC from "../../../../components/searchFormComponents/instruments/SpUpNIC";

const onChange = jest.fn();
describe("SpUpNIC ", () => {
  it("should be defined", () => {
    expect(
      <SpUpNIC spUpNic={{ errors: {}, name: "SpUpNIC" }} onChange={onChange} />
    ).toBeDefined();
  });

  it("should render correctly", () => {
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
