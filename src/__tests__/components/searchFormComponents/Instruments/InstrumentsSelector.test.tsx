import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import InstrumentsSelector from "../../../../components/searchFormComponents/instruments/InstrumentsSelector";

const onSelect = jest.fn() as any;
describe("InstrumentsSelector", () => {
  it("should be defined", () => {
    expect(
      mount(<InstrumentsSelector instruments={[]} onSelect={onSelect} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<InstrumentsSelector instruments={[]} onSelect={onSelect} />)
      )
    ).toMatchSnapshot();
  });
});
