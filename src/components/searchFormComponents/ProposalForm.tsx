import * as React from "react";
import { IGeneral } from "../../utils/ObservationQueryParameters";
import { validateDate } from "../../utils/validators";
import { MainGrid, SubGrid } from "../basicComponents/Grids";
import InputField from "../basicComponents/InputField";

class ProposalForm extends React.Component<
  { proposal: IGeneral; onChange: (value: IGeneral) => void },
  any
> {
  change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    this.props.onChange({
      ...this.props.proposal,
      [name]: value,
      errors: {
        ...this.props.proposal.errors,
        [name]: ""
      }
    });
  };
  render() {
    const {
      errors,
      principalInvestigator,
      observationNight,
      proposalCode,
      proposalTitle
    } = this.props.proposal;
    return (
      <>
        <MainGrid>
          <SubGrid>
            <p>Proposal code</p>
            <InputField
              className={"proposal-code-input"}
              error={errors.proposalCode}
              name={"proposalCode"}
              onChange={this.change}
              value={proposalCode || ""}
            />
          </SubGrid>
          <SubGrid>
            <p>Principal investigator</p>
            <InputField
              className={"principal-investigator-input"}
              name={"principalInvestigator"}
              value={principalInvestigator || ""}
              error={errors.principalInvestigator || ""}
              onChange={this.change}
            />
          </SubGrid>
        </MainGrid>

        <MainGrid>
          <SubGrid>
            <p>Proposal title</p>
            <InputField
              className={"proposal-title-input"}
              name={"proposalTitle"}
              value={proposalTitle || ""}
              error={errors.proposalTitle}
              onChange={this.change}
            />
          </SubGrid>
          <SubGrid>
            <p>Observation night</p>
            <InputField
              className={"observation-night-input"}
              name={"observationNight"}
              value={observationNight || ""}
              error={errors.observationNight}
              onChange={this.change}
            />
          </SubGrid>
        </MainGrid>
      </>
    );
  }
}
export const validatedProposal = (general: IGeneral) => {
  return {
    ...general,
    errors: {
      observationNight: validateDate(general.observationNight || "")
    }
  };
};
export default ProposalForm;
