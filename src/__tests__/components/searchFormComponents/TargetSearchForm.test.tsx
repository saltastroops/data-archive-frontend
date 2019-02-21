import { mount, shallow } from "enzyme";
import * as React from "react";
import TargetForm from "../../../components/searchFormComponents/TargetForm";
import toJson from "enzyme-to-json";

const onChange = jest.fn();

describe("TargetForm", () => {
  const wrapper = mount(
    <TargetForm target={{ errors: {} }} onChange={onChange} />
  );
  it("should render", () => {
    expect(wrapper).toBeDefined();
  });
  it("should contains 4 inputs and 2 selects and a button", () => {
    const inputs = wrapper.find("input.input");
    expect(inputs.length).toEqual(4);
    const select = wrapper.find("select");
    expect(select.length).toEqual(2);
    const button = wrapper.find("input.button");
    expect(button.length).toEqual(1);
  });
  it("should contains input of name (name, resolver, rightAscension, declination, searchConeRadius and radiusUnits", () => {
    const name = wrapper.find("input").get(0).props.name;
    expect(name).toEqual("name");

    const resolver = wrapper.find("select").get(0).props.name;
    expect(resolver).toEqual("resolver");

    const rightAscension = wrapper.find("input").get(2).props.name;
    expect(rightAscension).toEqual("rightAscension");

    const declination = wrapper.find("input").get(3).props.name;
    expect(declination).toEqual("declination");

    const searchConeRadius = wrapper.find("input").get(4).props.name;
    expect(searchConeRadius).toEqual("searchConeRadius");

    const radiusUnits = wrapper.find("select").get(1).props.name;
    expect(radiusUnits).toEqual("radiusUnits");
  });

  it("render correctly", () => {
    expect(
      toJson(
        shallow(<TargetForm target={{ errors: {} }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <TargetForm
            target={{
              errors: {},
              name: "hello"
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <TargetForm
            target={{
              errors: {
                name: "this is an error"
              },
              searchConeRadius: "12.1"
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });
});