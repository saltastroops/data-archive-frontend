import * as React from "react";
import { IGeneral } from "../../utils/ObservationQueryParameters";
import { validateDate } from "../../utils/validators";
import { HelpGrid, MainGrid, SubGrid } from "../basicComponents/Grids";
import HelpButton from "../basicComponents/HelpButton";
import InputField from "../basicComponents/InputField";

interface IProposalFormProps {
  proposal: IGeneral;
  onChange: (value: IGeneral) => void;
}

interface IProposalFormState {}

/**
 * A form for selecting general search parameters.
 */
class ProposalForm extends React.Component<
  IProposalFormProps,
  IProposalFormState
> {
  state = { showHelpOf: "" };
  // Function for handling input changes.
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
            <HelpGrid>
              <p>Proposal code</p>
              <HelpButton
                toolTipMessage={"Proposal code, such as 2019-1-SCI-042."}
              />
            </HelpGrid>
            <InputField
              data-test="proposal-code-input"
              error={errors.proposalCode}
              name={"proposalCode"}
              onChange={this.change}
              value={proposalCode || ""}
            />
          </SubGrid>
          <SubGrid>
            <HelpGrid>
              <p>Principal investigator</p>
              <HelpButton
                toolTipMessage={"Principal investigator for the proposal."}
              />
            </HelpGrid>
            <InputField
              data-test="principal-investigator-input"
              name={"principalInvestigator"}
              value={principalInvestigator || ""}
              error={errors.principalInvestigator || ""}
              onChange={this.change}
            />
          </SubGrid>
        </MainGrid>

        <MainGrid>
          <SubGrid>
            <HelpGrid>
              <p>Proposal title</p>
              <HelpButton toolTipMessage={"Proposal title."} />
            </HelpGrid>
            <InputField
              data-test="proposal-title-input"
              name={"proposalTitle"}
              value={proposalTitle || ""}
              error={errors.proposalTitle}
              onChange={this.change}
            />
          </SubGrid>
          <SubGrid>
            <HelpGrid>
              <p>Observation night</p>
              <HelpButton
                toolTipMessage={
                  'Night of the observation. You can input a date range by separating two dates with "..." For example: 2019-01-01 .. 2019-02-28.'
                }
              />
            </HelpGrid>
            <InputField
              data-test="observation-night-input"
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
