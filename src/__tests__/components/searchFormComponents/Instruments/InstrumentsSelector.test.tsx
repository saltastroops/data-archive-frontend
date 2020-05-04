import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import InstrumentSelector from "../../../../components/searchFormComponents/instruments/InstrumentSelector";

const onSelect = jest.fn() as any;
describe("InstrumentsSelector", () => {
  it("should be defined", () => {
    expect(
      mount(<InstrumentSelector instruments={[]} onSelect={onSelect} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(mount(<InstrumentSelector instruments={[]} onSelect={onSelect} />))
    ).toMatchSnapshot();
  });
});
