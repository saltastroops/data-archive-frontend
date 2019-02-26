import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SearchForm from "../../../components/SearchForm";
import ProposalForm from "../../../components/searchFormComponents/ProposalForm";

const onChange = jest.fn();

describe("Proposal Form", () => {
  const wrapper = mount(
    <ProposalForm proposal={{ errors: {} }} onChange={onChange} />
  );
  it("should render correctly", () => {
    expect(wrapper).toBeDefined();
  });
  it("should contains 4 input fields", () => {
    const inputs = wrapper.find("input.input");
    expect(inputs.length).toEqual(4);
  });

  it("should contain inputs with names (proposalCode, proposalTitle, observationNight and principalInvestigator)", () => {
    const proposalCode = wrapper.find("input.input").get(0).props.name;
    expect(proposalCode).toEqual("proposalCode");

    const proposalTitle = wrapper.find("input.input").get(2).props.name;
    expect(proposalTitle).toEqual("proposalTitle");

    const observationNight = wrapper.find("input.input").get(3).props.name;
    expect(observationNight).toEqual("observationNight");

    const principalInvestigator = wrapper.find("input.input").get(1).props.name;
    expect(principalInvestigator).toEqual("principalInvestigator");
  });

  it("render correctly", () => {
    expect(
      toJson(
        shallow(<ProposalForm proposal={{ errors: {} }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <ProposalForm
            proposal={{
              errors: {},
              proposalTitle: "hello"
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <ProposalForm
            proposal={{
              errors: {
                principalInvestigator: "this is an error",
                proposalCode: "this is an error",
                proposalTitle: "this is an error"
              },
              proposalCode: "Code1"
            }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });
});

describe("Proposal form on change", () => {
  const wrapper = mount(
    <ProposalForm proposal={{ errors: {} }} onChange={onChange} />
  );
  it("should find proposal general defined on proposal search form", () => {
    // jest.spyOn(SearchForm.prototype, 'targetChange');
    SearchForm.prototype.generalChange = jest.fn();
    expect(SearchForm.prototype.generalChange).toBeDefined();
  });

  it("should call onChange with any thing", () => {
    const piForm = wrapper.find("input.principal-investigator-input");
    const pi = piForm.find("input");
    pi.simulate("change", {
      target: { value: "hello", name: "principalInvestigator" }
    });
    expect(onChange).toBeCalledWith({
      errors: { principalInvestigator: "" },
      principalInvestigator: "hello"
    });
  });
});
