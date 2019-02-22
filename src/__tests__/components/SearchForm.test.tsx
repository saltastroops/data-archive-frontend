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

  it("Should update state when typing target name", () => {
    let value: any;
    const targetForm = wrapper.find("input.target-name-input");
    const targetName = targetForm.find("input");

    value = "apple";
    targetName.simulate("change", { target: { value, name: "name" } });
    expect((wrapper.state() as any).target.name).toEqual("apple");

    value = "apple";
    targetName.simulate("change", { target: { value, name: "name" } });
    expect((wrapper.state() as any).target.name).toEqual("apple");
    value = "apple";

    const event = { target: { value, name: "name" } };
    targetName.simulate("change", event);
    expect((wrapper.state() as any).target.name).toEqual("apple");
  });
  it("Should update state when typing right ascension", () => {
    let value: any;
    let event: any;
    const raForm = wrapper.find("input.right-ascension-input");
    const ra = raForm.find("input");
    value = "123.3";
    event = { target: { value, name: "rightAscension" } };
    ra.simulate("change", event);
    expect(wrapper.state()).toEqual({
      general: { errors: {} },
      loading: false,
      target: {
        errors: { name: "", rightAscension: "" },
        name: "apple",
        rightAscension: "123.3"
      },
      telescope: {}
    });

    value = "12:12:12";
    event = { target: { value, name: "rightAscension" } };
    ra.simulate("change", event);
    expect(wrapper.state()).toEqual({
      general: { errors: {} },
      loading: false,
      target: {
        errors: { name: "", rightAscension: "" },
        name: "apple",
        rightAscension: "12:12:12"
      },
      telescope: {}
    });

    value = null;
    event = { target: { value, name: "rightAscension" } };
    ra.simulate("change", event);
    expect(wrapper.state()).toEqual({
      general: { errors: {} },
      loading: false,
      target: {
        errors: { name: "", rightAscension: "" },
        name: "apple",
        rightAscension: ""
      },
      telescope: {}
    });

    value = undefined;
    event = { target: { value, name: "rightAscension" } };
    ra.simulate("change", event);
    expect(wrapper.state()).toEqual({
      general: { errors: {} },
      loading: false,
      target: {
        errors: { name: "", rightAscension: "" },
        name: "apple",
        rightAscension: ""
      },
      telescope: {}
    });
  });
  it("Should update state when resolver change", () => {
    let value: any;
    const resolverForm = wrapper.find("div.resolver-select");
    const resolver = resolverForm.find("select");
    value = "NED";
    const event = { target: { value, name: "resolver" } };
    resolver.simulate("change", event);
    expect(wrapper.state()).toEqual({
      general: { errors: {} },
      loading: false,
      target: {
        errors: { name: "", resolver: "", rightAscension: "" },
        name: "apple",
        resolver: "NED",
        rightAscension: ""
      },
      telescope: {}
    });
  });
  it("render correctly", () => {
    expect(toJson(shallow(<SearchForm />))).toMatchSnapshot();
  });
});
