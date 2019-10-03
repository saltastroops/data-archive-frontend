import * as React from "react";
import styled from "styled-components";
import {
  CalibrationType,
  IGeneral
} from "../../utils/ObservationQueryParameters";
import { validateDate } from "../../utils/validators";
import { MainGrid, Span, SubGrid, SubGrid4 } from "../basicComponents/Grids";
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
  proposal: IGeneral;
  general: IGeneral;
  onChange: (value: IGeneral) => void;
}

/**
 * A form for selecting general search parameters.
 */
class ProposalForm extends React.Component<IProposalFormProps, {}> {
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
    const { calibrations } = this.props.general;
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
              data-test="proposal-code-input"
              error={errors.proposalCode}
              name={"proposalCode"}
              onChange={this.change}
              title="Proposal code, such as 2019-1-SCI-042"
              value={proposalCode || ""}
            />
          </SubGrid>
          <SubGrid>
            <p>Principal investigator</p>
            <InputField
              data-test="principal-investigator-input"
              name={"principalInvestigator"}
              value={principalInvestigator || ""}
              error={errors.principalInvestigator || ""}
              title="Principal investigator for the proposal"
              onChange={this.change}
            />
          </SubGrid>
        </MainGrid>

        <MainGrid>
          <SubGrid>
            <p>Proposal title</p>
            <InputField
              data-test="proposal-title-input"
              name={"proposalTitle"}
              value={proposalTitle || ""}
              error={errors.proposalTitle}
              title="Proposal title"
              onChange={this.change}
            />
          </SubGrid>
          <SubGrid>
            <p>Observation night</p>
            <InputField
              data-test="observation-night-input"
              name={"observationNight"}
              value={observationNight || ""}
              error={errors.observationNight}
              title='Night of the observation. You can input a date range by separating two dates with "..." For example: 2019-01-01 .. 2019-02-28'
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
                checked={calibrations.has("arc")}
                data-test="arcs-checkbox"
                onChange={this.changeCheckbox}
                name="arc"
              />
            </Span>
            <Span>Arcs</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                id="biases-checkbox"
                checked={calibrations.has("bias")}
                data-test="biases-checkbox"
                onChange={this.changeCheckbox}
                name="bias"
              />
            </Span>
            <Span>Biases</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                id="flats-checkbox"
                checked={calibrations.has("flat")}
                data-test="flats-checkbox"
                onChange={this.changeCheckbox}
                name="flat"
              />
            </Span>
            <Span>Flats</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                id="standards-checkbox"
                checked={calibrations.has("standard")}
                data-test="standards-checkbox"
                onChange={this.changeCheckbox}
                name="standard"
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
