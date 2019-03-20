import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import Salticam from "../../../../components/searchFormComponents/instruments/Salticam";

const onChange = jest.fn();
describe("Salticam ", () => {
  it("should be defined", () => {
    expect(
      mount(
        <Salticam
          salticam={{ errors: {}, name: "Salticam" }}
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
          <Salticam
            salticam={{ errors: {}, name: "Salticam" }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
