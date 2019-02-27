import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SearchForm from "../../../components/SearchForm";
import ProposalForm from "../../../components/searchFormComponents/ProposalForm";
import { CalibrationType } from "../../../utils/ObservationQueryParameters";

const onChange = jest.fn();

describe("Proposal Form", () => {
  it("should render", () => {
    expect(
      <ProposalForm
        proposal={{ calibrations: new Set<CalibrationType>(), errors: {} }}
        onChange={onChange}
      />
    ).toBeDefined();
  });

  it("render correctly", () => {
    expect(
      toJson(
        shallow(
          <ProposalForm
            proposal={{ calibrations: new Set<CalibrationType>(), errors: {} }}
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
              calibrations: new Set<CalibrationType>(),
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
              calibrations: new Set<CalibrationType>(),
              errors: {
                principalInvestigator: "invalid Principal Investigator",
                proposalCode: "invalid proposal code",
                proposalTitle: "invalid proposal title"
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
  it("should call onChange with the correct value", () => {
    const wrapper = mount(
      <ProposalForm
        proposal={{ calibrations: new Set<CalibrationType>(), errors: {} }}
        onChange={onChange}
      />
    );

    // Principal investigator

    const pi = wrapper.find('input[data-test="principal-investigator-input"]');
    pi.simulate("change", {
      target: { value: "John Doe", name: "principalInvestigator" }
    });
    expect(onChange).toBeCalledWith({
      calibrations: new Set<CalibrationType>(),
      errors: { principalInvestigator: "" },
      principalInvestigator: "John Doe"
    });

    // Proposal code

    const proposalCode = wrapper.find('input[data-test="proposal-code-input"]');
    proposalCode.simulate("change", {
      target: { value: "2019-1-SCI-042", name: "proposalCode" }
    });
    expect(onChange).toBeCalledWith({
      calibrations: new Set<CalibrationType>(),
      errors: { proposalCode: "" },
      proposalCode: "2019-1-SCI-042"
    });

    // Proposal title

    const proposalTitle = wrapper.find(
      'input[data-test="proposal-title-input"]'
    );
    proposalTitle.simulate("change", {
      target: { value: "2019-1-SCI-042", name: "proposalTitle" }
    });
    expect(onChange).toBeCalledWith({
      calibrations: new Set<CalibrationType>(),
      errors: { proposalTitle: "" },
      proposalTitle: "2019-1-SCI-042"
    });
  });
});
