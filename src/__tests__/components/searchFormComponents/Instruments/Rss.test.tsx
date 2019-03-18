import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import Rss from "../../../../components/searchFormComponents/instruments/Rss";

const onChange = jest.fn();
describe("Rss ", () => {
  it("should be defined", () => {
    expect(
      <Rss rss={{ errors: {}, name: "RSS" }} onChange={onChange} />
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<Rss rss={{ errors: {}, name: "RSS" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
  });
});
