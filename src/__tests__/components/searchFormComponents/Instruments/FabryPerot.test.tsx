import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import RssFabryPerotModeSelector from "../../../../components/searchFormComponents/instruments/RssFabryPerotModeSelector";

const onSelect = jest.fn() as any;
describe("FabryPerot", () => {
  it("should be defined", () => {
    expect(
      mount(
        <RssFabryPerotModeSelector fabryPerotModes={[]} onSelect={onSelect} />
      )
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(
          <RssFabryPerotModeSelector fabryPerotModes={[]} onSelect={onSelect} />
        )
      )
    ).toMatchSnapshot();
  });
});
