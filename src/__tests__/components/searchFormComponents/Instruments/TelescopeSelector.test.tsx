import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import TelescopeSelector from "../../../../components/searchFormComponents/instruments/TelescopeSelector";

const onSelect = jest.fn() as any;
describe("TelescopeSelector ", () => {
  it("should be defined", () => {
    expect(
      mount(<TelescopeSelector telescopes={[]} onSelect={onSelect} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(mount(<TelescopeSelector telescopes={[]} onSelect={onSelect} />))
    ).toMatchSnapshot();
  });
});
