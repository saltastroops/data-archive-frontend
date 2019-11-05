import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import RssPolarimetryModeSelector from "../../../../components/searchFormComponents/instruments/RssPolarimetryModeSelector";

const onSelect = jest.fn() as any;
describe("Rss Polarimetry Imaging", () => {
  it("should be defined", () => {
    expect(
      mount(
        <RssPolarimetryModeSelector
          rssPolarimetryModes={[]}
          onSelect={onSelect}
        />
      )
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(
          <RssPolarimetryModeSelector
            rssPolarimetryModes={[]}
            onSelect={onSelect}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
