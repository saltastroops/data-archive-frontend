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

  it("Should update state when typing on target form", () => {
    let value: any;
    const targetForm = wrapper.find("input.target-name-input");
    const targetName = targetForm.find("input");

    value = "apple";
    targetName.simulate("change", { target: { value, name: "name" } });
    expect((wrapper.state() as any).target.name).toEqual("apple");

    value = "";
    targetName.simulate("change", { target: { value, name: "name" } });
    expect((wrapper.state() as any).target.name).toEqual("");

    value = undefined;
    targetName.simulate("change", { target: { value, name: "name" } });
    expect((wrapper.state() as any).target.name).toEqual("");

    value = null;
    targetName.simulate("change", { target: { value, name: "name" } });
    expect((wrapper.state() as any).target.name).toEqual("");

    value = "\\ \t";
    targetName.simulate("change", { target: { value, name: "name" } });
    expect((wrapper.state() as any).target.name).toEqual("\\ \t");
  });

  it("Should update state when change a select", () => {
    let value: any;
    const resolverForm = wrapper.find("div.resolver-select");
    const resolver = resolverForm.find("select");
    value = "NED";
    const event = { target: { value, name: "resolver" } };
    resolver.simulate("change", event);
    expect((wrapper.state() as any).target.resolver).toEqual("NED");
  });

  it("render correctly", () => {
    expect(toJson(shallow(<SearchForm />))).toMatchSnapshot();
  });
});
