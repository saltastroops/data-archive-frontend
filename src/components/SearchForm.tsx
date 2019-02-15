import * as React from "react";
import { IGeneral } from "../utils/ObservationQueryParameters";
import {
  ButtonGrid,
  DataGrid,
  ParentGrid,
  ProposalGrid,
  TargetGrid,
  TelescopeGrid
} from "./basicComponents/Grids";
import { ITarget } from "./basicComponents/SearchFormInterface";
import { updateState } from "./basicComponents/util";
import DataForm from "./searchFormComponents/DataForm";
import ProposalForm from "./searchFormComponents/ProposalForm";
import TargetForm, { validateTarget } from "./searchFormComponents/TargetForm";
import TelescopeForm from "./searchFormComponents/TelescopeForm";

class SearchForm extends React.Component {
  public onChange = (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => {
    // e.preventDefault();

    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    const newState = updateState(this.state, name, value);
    this.setState(() => newState);
  };
  public changeTelescope = (value: any) => {
    const newState = {
      ...this.state,
      telescope: {
        ...value
      }
    };
    this.setState(() => newState);
  };
  public targetChange = (value: any) => {
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

  public SearchArchive = () => {
    const newState = validateTarget(this.state.target, this.targetChange);
    this.setState(() => newState);
  };

  public state: {
    data: any;
    general: IGeneral;
    proposal: any;
    target: ITarget;
    telescope: any;
  } = {
    data: {
      arcs: false,
      biases: false,
      dataType: ["any", "reduced", "raw"],
      flats: false,
      selectedDataType: "any",
      standards: false
    },
    general: { errors: {} },
    proposal: {
      obsDate: {
        error: "",
        onChange: this.onChange,
        value: ""
      },
      pi: {
        error: "",
        name: "",
        onChange: this.onChange
      },
      proposalCode: {
        code: "",
        error: "",
        onChange: this.onChange
      },
      proposalTitle: {
        error: "",
        onChange: this.onChange,
        title: ""
      }
    },
    target: {
      errors: {}
    },
    telescope: {}
  };
  public render() {
    const { target, general, data, telescope } = this.state;

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
              onChange={this.changeTelescope}
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
              onClick={this.SearchArchive}
            />
          </ButtonGrid>
        </ParentGrid>
      </>
    );
  }
}

export default SearchForm;
