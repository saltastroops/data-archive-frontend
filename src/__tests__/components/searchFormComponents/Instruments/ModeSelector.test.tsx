import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import ModeSelector from "../../../../components/searchFormComponents/instruments/ModeSelector";

const onSelect = jest.fn() as any;
describe("Mode Selector", () => {
  it("should be defined", () => {
    expect(
      mount(<ModeSelector modes={[]} onSelect={onSelect} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(mount(<ModeSelector modes={[]} onSelect={onSelect} />))
    ).toMatchSnapshot();
  });
});
