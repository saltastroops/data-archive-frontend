import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import RssGrating from "../../../../components/searchFormComponents/instruments/RssGrating";

const onSelect = jest.fn() as any;
describe("RssGrating", () => {
  it("should be defined", () => {
    expect(
      mount(<RssGrating rssGrating={[]} onSelect={onSelect} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(mount(<RssGrating rssGrating={[]} onSelect={onSelect} />))
    ).toMatchSnapshot();
  });
});
