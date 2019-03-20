import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import HIPPO from "../../../../components/searchFormComponents/instruments/HIPPO";

const onChange = jest.fn();
describe("HIPPO ", () => {
  it("should be defined", () => {
    expect(
      mount(<HIPPO hippo={{ errors: {}, name: "HIPPO" }} onChange={onChange} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
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
