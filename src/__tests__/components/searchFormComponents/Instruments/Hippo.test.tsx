import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import Hippo from "../../../../components/searchFormComponents/instruments/Hippo";

const onChange = jest.fn();
describe("Hippo ", () => {
  it("should be defined", () => {
    expect(
      <Hippo hippo={{ errors: {}, name: "HIPPO" }} onChange={onChange} />
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(
          <Hippo hippo={{ errors: {}, name: "HIPPO" }} onChange={onChange} />
        )
      )
    ).toMatchSnapshot();
  });
});
