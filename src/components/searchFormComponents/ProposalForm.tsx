import * as React from "react";
import { IGeneral } from "../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../basicComponents/Grids";
import InputField from "../basicComponents/InputField";

class ProposalForm extends React.Component<
  { proposal: IGeneral; onChange: (value: IGeneral) => void },
  any
> {
  change = (e: React.FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    this.props.onChange({
      ...this.props.proposal,
      [name]: value
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
            <p>Proposal Code</p>
            <InputField
              error={errors.proposalCode}
              name={"proposalCode"}
              onChange={this.change}
              value={proposalCode}
            />
          </SubGrid>
          <SubGrid>
            <p>Principal investigator</p>
            <InputField
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
              name={"proposalTitle"}
              value={proposalTitle}
              error={errors.proposalTitle}
              onChange={this.change}
            />
          </SubGrid>
          <SubGrid>
            <p>Observation night</p>
            <InputField
              name={"observationNight"}
              value={observationNight}
              error={errors.observationNight}
              onChange={this.change}
              placeholder="dd-mm-yyyy"
            />
          </SubGrid>
        </MainGrid>
      </>
    );
  }
}
export default ProposalForm;
