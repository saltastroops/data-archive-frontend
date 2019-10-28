import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import InstrumentModeSelector from "../../../../components/searchFormComponents/instruments/InstrumentModeSelector";

const onSelect = jest.fn() as any;
describe("Mode Selector", () => {
  it("should be defined", () => {
    expect(
      mount(<InstrumentModeSelector instrumentModes={[]} onSelect={onSelect} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(
          <InstrumentModeSelector instrumentModes={[]} onSelect={onSelect} />
        )
      )
    ).toMatchSnapshot();
  });
});
