import * as React from "react";
import styled from "styled-components";
import {
  CalibrationType,
  IGeneral
} from "../../utils/ObservationQueryParameters";
import { validateDate } from "../../utils/validators";
import {
  HelpGrid,
  MainGrid,
  Span,
  SubGrid,
  SubGrid4
} from "../basicComponents/Grids";
import HelpButton from "../basicComponents/HelpButton";
import InputField from "../basicComponents/InputField";

const LargeCheckbox = styled.input.attrs({
  className: "checkbox",
  type: "checkbox"
})`
  && {
    width: 18px;
    height: 18px;
  }
`;

interface IProposalFormProps {
  general: IGeneral;
  onChange: (value: IGeneral) => void;
}

// interface IProposalFormState {}

/**
 * A form for selecting general search parameters.
 */
class ProposalForm extends React.Component<IProposalFormProps, {}> {
  state = { showHelpOf: "" };
  // Function for handling input changes.
  change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    this.props.onChange({
      ...this.props.general,
      [name]: value,
      errors: {
        ...this.props.general.errors,
        [name]: ""
      }
    });
  };

  // Add or remove the calibration type corresponding to the clicked checkbox
  changeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as CalibrationType;

    const updated = new Set<CalibrationType>(this.props.general.calibrations);
    if (e.target.checked) {
      updated.add(name);
    } else {
      updated.delete(name);
    }
    this.props.onChange({
      ...this.props.general,
      calibrations: updated
    });
  };

  render() {
    const {
      calibrations,
      errors,
      principalInvestigator,
      observationNight,
      proposalCode,
      proposalTitle
    } = this.props.general;
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
        <MainGrid>
          <SubGrid>
            <h5 className={"title is-5"}>Include:</h5>
          </SubGrid>
        </MainGrid>
        <SubGrid4>
          <label>
            <Span>
              <LargeCheckbox
                id="arcs-checkbox"
                checked={calibrations.has("Arc")}
                data-test="arcs-checkbox"
                onChange={this.changeCheckbox}
                name="Arc"
              />
            </Span>
            <Span>Arcs</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                id="biases-checkbox"
                checked={calibrations.has("Bias")}
                data-test="biases-checkbox"
                onChange={this.changeCheckbox}
                name="Bias"
              />
            </Span>
            <Span>Biases</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                id="flats-checkbox"
                checked={calibrations.has("Flat")}
                data-test="flats-checkbox"
                onChange={this.changeCheckbox}
                name="Flat"
              />
            </Span>
            <Span>Flats</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                id="standards-checkbox"
                checked={calibrations.has("Standard")}
                data-test="standards-checkbox"
                onChange={this.changeCheckbox}
                name="Standard"
              />
            </Span>
            <Span>Standards</Span>
          </label>
        </SubGrid4>
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
