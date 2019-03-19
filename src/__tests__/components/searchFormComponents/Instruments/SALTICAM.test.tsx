import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SALTICAM from "../../../../components/searchFormComponents/instruments/SALTICAM";

const onChange = jest.fn();
describe("SALTICAM ", () => {
  it("should be defined", () => {
    expect(
      mount(
        <SALTICAM
          salticam={{ errors: {}, name: "SALTICAM" }}
          onChange={onChange}
        />
      )
    ).toBeDefined();
  });

  it("should render correctly", () => {
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
