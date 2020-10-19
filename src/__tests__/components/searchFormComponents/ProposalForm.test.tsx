import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import ProposalForm from "../../../components/searchFormComponents/ProposalForm";
import { ProductType, Status } from "../../../utils/ObservationQueryParameters";

const onChange = jest.fn();

describe("Proposal Form", () => {
  it("should render", () => {
    expect(
      <ProposalForm
        general={{
          errors: {},
          observationStatuses: new Set<Status>(),
          productTypes: new Set<ProductType>(),
        }}
        onChange={onChange}
      />
    ).toBeDefined();
  });

  it("render correctly", () => {
    expect(
      toJson(
        shallow(
          <ProposalForm
            general={{
              errors: {},
              observationStatuses: new Set<Status>(),
              productTypes: new Set<ProductType>(),
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
            general={{
              errors: {},
              observationStatuses: new Set<Status>(),
              productTypes: new Set<ProductType>(),
              proposalTitle: "hello",
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
            general={{
              errors: {
                principalInvestigator: "invalid Principal Investigator",
                proposalCode: "invalid proposal code",
                proposalTitle: "invalid proposal title",
              },
              observationStatuses: new Set<Status>(),
              productTypes: new Set<ProductType>(),
              proposalCode: "Code1",
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
        general={{
          errors: {},
          observationStatuses: new Set<Status>(),
          productTypes: new Set<ProductType>(),
        }}
        onChange={onChange}
      />
    );

    // Principal investigator

    const pi = wrapper.find('input[data-test="principal-investigator-input"]');
    pi.simulate("change", {
      target: { value: "John Doe", name: "principalInvestigator" },
    });
    expect(onChange).toBeCalledWith({
      errors: { principalInvestigator: "" },
      observationStatuses: new Set<Status>(),
      principalInvestigator: "John Doe",
      productTypes: new Set<ProductType>(),
    });

    // Proposal code

    const proposalCode = wrapper.find('input[data-test="proposal-code-input"]');
    proposalCode.simulate("change", {
      target: { value: "2019-1-SCI-042", name: "proposalCode" },
    });
    expect(onChange).toBeCalledWith({
      errors: { proposalCode: "" },
      observationStatuses: new Set<Status>(),
      productTypes: new Set<ProductType>(),
      proposalCode: "2019-1-SCI-042",
    });

    // Proposal title

    const proposalTitle = wrapper.find(
      'input[data-test="proposal-title-input"]'
    );
    proposalTitle.simulate("change", {
      target: { value: "2019-1-SCI-042", name: "proposalTitle" },
    });
    expect(onChange).toBeCalledWith({
      errors: { proposalTitle: "" },
      observationStatuses: new Set<Status>(),
      productTypes: new Set<ProductType>(),
      proposalTitle: "2019-1-SCI-042",
    });
  });
});
