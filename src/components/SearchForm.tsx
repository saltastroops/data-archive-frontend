import * as React from "react";
import {
  IGeneral,
  ITarget,
  ITelescope
} from "../utils/ObservationQueryParameters";
import {
  ButtonGrid,
  DataGrid,
  ParentGrid,
  ProposalGrid,
  TargetGrid,
  TelescopeGrid
} from "./basicComponents/Grids";
import DataForm from "./searchFormComponents/DataForm";
import ProposalForm, {
  validatedProposal
} from "./searchFormComponents/ProposalForm";
import TargetForm, { validatedTarget } from "./searchFormComponents/TargetForm";
import TelescopeForm, {
  validatedTelescope
} from "./searchFormComponents/TelescopeForm";

class SearchForm extends React.Component {
  public state: {
    general: IGeneral;
    target: ITarget;
    telescope: ITelescope;
  } = {
    general: { errors: {} },
    target: { errors: {} },
    telescope: {}
  };
  public telescopeChange = (value: ITelescope) => {
    const newState = {
      ...this.state,
      telescope: {
        ...value
      }
    };
    this.setState(() => newState);
  };
  public targetChange = (value: ITarget) => {
    console.log(value);
    const newState = {
      ...this.state,
      target: {
        ...value
      }
    };
    this.setState(() => newState);
  };
  public generalChange = (value: IGeneral) => {
    const newState = {
      ...this.state,
      general: {
        ...value
      }
    };
    this.setState(() => newState);
  };

  public searchArchive = async () => {
    const target = await validatedTarget(this.state.target);
    const general = validatedProposal(this.state.general);
    const telescope = validatedTelescope(this.state.telescope);
    this.setState(() => ({
      ...this.state,
      general,
      target,
      telescope
    }));
  };

  public render() {
    const { target, general, telescope } = this.state;

    console.log("STATE: ", this.state);
    return (
      <>
        <ParentGrid>
          <TargetGrid>
            <TargetForm target={target} onChange={this.targetChange} />
          </TargetGrid>
          <ProposalGrid>
            <ProposalForm proposal={general} onChange={this.generalChange} />
          </ProposalGrid>
          <TelescopeGrid>
            <TelescopeForm
              telescope={telescope}
              onChange={this.telescopeChange}
            />
          </TelescopeGrid>
          <DataGrid>
            <DataForm data={general} onChange={this.generalChange} />
          </DataGrid>
          <ButtonGrid>
            <input
              className="button is-primary"
              type="button"
              value="search"
              onClick={this.searchArchive}
            />
          </ButtonGrid>
        </ParentGrid>
      </>
    );
  }
}

export default SearchForm;
