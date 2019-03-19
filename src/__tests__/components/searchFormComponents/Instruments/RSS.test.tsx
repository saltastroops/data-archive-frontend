import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import RSS from "../../../../components/searchFormComponents/instruments/RSS";

const onChange = jest.fn();
describe("RSS ", () => {
  it("should be defined", () => {
    expect(
      mount(<RSS rss={{ errors: {}, name: "RSS" }} onChange={onChange} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        mount(<RSS rss={{ errors: {}, name: "RSS" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
  });
});
