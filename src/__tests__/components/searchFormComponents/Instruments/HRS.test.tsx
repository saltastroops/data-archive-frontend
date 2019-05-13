import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import HRS from "../../../../components/searchFormComponents/instruments/HRS";

const onChange = jest.fn();
describe("HRS", () => {
  it("should be defined", () => {
    expect(
      mount(<HRS hrs={{ errors: {}, name: "HRS" }} onChange={onChange} />)
    ).toBeDefined();
  });

  it("should render correctly without a mode", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<HRS hrs={{ errors: {}, name: "HRS" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
  });

  it("should render correctly with a mode", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(
          <HRS
            hrs={{
              errors: {},
              filter: "H-alpha",
              mode: "Imaging",
              name: "HRS"
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
