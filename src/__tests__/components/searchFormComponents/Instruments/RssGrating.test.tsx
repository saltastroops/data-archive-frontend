import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import RssGratingSelector from "../../../../components/searchFormComponents/instruments/RssGratingSelector";

const onSelect = jest.fn() as any;
describe("RssGrating", () => {
  it("should be defined", () => {
    expect(
      mount(<RssGratingSelector rssGratings={[]} onSelect={onSelect} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(mount(<RssGratingSelector rssGratings={[]} onSelect={onSelect} />))
    ).toMatchSnapshot();
  });
});
