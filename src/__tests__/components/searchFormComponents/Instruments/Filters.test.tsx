import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import Filters from "../../../../components/searchFormComponents/instruments/Filters";

const onSelect = jest.fn() as any;
describe("Filters", () => {
  it("should be defined", () => {
    expect(mount(<Filters filters={[]} onSelect={onSelect} />)).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(mount(<Filters filters={[]} onSelect={onSelect} />))
    ).toMatchSnapshot();
  });
});
