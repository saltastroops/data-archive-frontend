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

interface IProposalFormState {
  showHelpOf: string;
}

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
  showHelpOf = (name: string) => {
    if (this.state.showHelpOf === name) {
      this.setState(() => ({ showHelpOf: "" }));
    } else {
      this.setState(() => ({ showHelpOf: name }));
    }
  };

  render() {
    const {
      errors,
      principalInvestigator,
      observationNight,
      proposalCode,
      proposalTitle
    } = this.props.proposal;
    const { showHelpOf } = this.state;
    return (
      <>
        <MainGrid>
          <SubGrid>
            <p>Proposal code</p>
            <HelpGrid>
              <InputField
                data-test="proposal-code-input"
                error={errors.proposalCode}
                name={"proposalCode"}
                onChange={this.change}
                help={{
                  message: `
                      Proposal code, such as 2019-1-SCI-042
                    `,
                  showHelp: showHelpOf === "proposalCode"
                }}
                value={proposalCode || ""}
              />
              <HelpButton name={"proposalCode"} showHelp={this.showHelpOf} />
            </HelpGrid>
          </SubGrid>
          <SubGrid>
            <p>Principal investigator</p>
            <HelpGrid>
              <InputField
                data-test="principal-investigator-input"
                name={"principalInvestigator"}
                value={principalInvestigator || ""}
                error={errors.principalInvestigator || ""}
                onChange={this.change}
                help={{
                  message: "Principal investigator for the proposal",
                  showHelp: showHelpOf === "principalInvestigator"
                }}
              />
              <HelpButton
                name={"principalInvestigator"}
                showHelp={this.showHelpOf}
              />
            </HelpGrid>
          </SubGrid>
        </MainGrid>

        <MainGrid>
          <SubGrid>
            <p>Proposal title</p>
            <HelpGrid>
              <InputField
                data-test="proposal-title-input"
                name={"proposalTitle"}
                value={proposalTitle || ""}
                error={errors.proposalTitle}
                onChange={this.change}
                help={{
                  message: "Proposal title",
                  showHelp: showHelpOf === "proposalTitle"
                }}
              />
              <HelpButton name={"proposalTitle"} showHelp={this.showHelpOf} />
            </HelpGrid>
          </SubGrid>
          <SubGrid>
            <p>Observation night</p>
            <HelpGrid>
              <InputField
                data-test="observation-night-input"
                name={"observationNight"}
                value={observationNight || ""}
                error={errors.observationNight}
                onChange={this.change}
                help={{
                  message: `
                      Night of the observation. You can input a date range by separating two dates with "..." For example: 2019-01-01 .. 2019-02-28

                    `,
                  showHelp: showHelpOf === "observationNight"
                }}
              />
              <HelpButton
                name={"observationNight"}
                showHelp={this.showHelpOf}
              />
            </HelpGrid>
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
