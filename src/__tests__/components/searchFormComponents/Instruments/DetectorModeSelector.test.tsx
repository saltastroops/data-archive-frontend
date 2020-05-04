import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import DetectorModeSelector from "../../../../components/searchFormComponents/instruments/DetectorModeSelector";

const onSelect = jest.fn() as any;
describe("Detector Mode Selector", () => {
  it("should be defined", () => {
    expect(
      mount(<DetectorModeSelector detectorModes={[]} onSelect={onSelect} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<DetectorModeSelector detectorModes={[]} onSelect={onSelect} />)
      )
    ).toMatchSnapshot();
  });
});
