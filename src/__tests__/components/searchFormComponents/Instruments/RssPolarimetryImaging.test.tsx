import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import RssPolarimetryImaging from "../../../../components/searchFormComponents/instruments/RssPolarimetryImaging";

const onSelect = jest.fn() as any;
describe("Rss Polarimetry Imaging", () => {
  it("should be defined", () => {
    expect(
      mount(
        <RssPolarimetryImaging rssPolarimetryImaging={[]} onSelect={onSelect} />
      )
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(
          <RssPolarimetryImaging
            rssPolarimetryImaging={[]}
            onSelect={onSelect}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
