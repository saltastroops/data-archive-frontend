import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import FabryPerot from "../../../../components/searchFormComponents/instruments/FabryPerot";

const onSelect = jest.fn() as any;
describe("FabryPerot", () => {
  it("should be defined", () => {
    expect(
      mount(<FabryPerot fabryPerot={[]} onSelect={onSelect} />)
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(mount(<FabryPerot fabryPerot={[]} onSelect={onSelect} />))
    ).toMatchSnapshot();
  });
});
