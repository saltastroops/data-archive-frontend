import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SearchForm from "../../components/SearchForm";

describe("Search Form", () => {
  const wrapper = mount(<SearchForm />);
  it("should render", () => {
    expect(wrapper).toBeDefined();
  });
  it("Should always renders a div of class name grid-container", () => {
    const mainDiv = wrapper.find("div");
    expect(mainDiv.length).toBeGreaterThan(0);
    const mainContainer = wrapper.find("div.grid-container");
    expect(mainContainer.length).toEqual(1);
  });
  it("should contain five grid-item and one button", () => {
    const items = wrapper.find("div.grid-item");
    expect(items.length).toEqual(5);
    const button = wrapper.find("input.is-primary");
    expect(button.length).toEqual(1);
  });
  it("should contain target, proposal, telescope and data form", () => {
    const target = wrapper.find("div.target-form");
    expect(target.length).toEqual(1);
    const proposal = wrapper.find("div.proposal-form");
    expect(proposal.length).toEqual(1);
    const telescope = wrapper.find("div.telescope-form");
    expect(telescope.length).toEqual(1);
    const data = wrapper.find("div.data-form");
    expect(data.length).toEqual(1);
  });
  it("render correctly", () => {
    expect(toJson(shallow(<SearchForm />))).toMatchSnapshot();
  });
});
