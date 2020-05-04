import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import HrsMode from "../../../../components/searchFormComponents/instruments/HrsMode";

const onSelect = jest.fn() as any;
describe("Hrs Mode", () => {
  it("should be defined", () => {
    expect(mount(<HrsMode hrsModes={[]} onSelect={onSelect} />)).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(mount(<HrsMode hrsModes={[]} onSelect={onSelect} />))
    ).toMatchSnapshot();
  });
});
