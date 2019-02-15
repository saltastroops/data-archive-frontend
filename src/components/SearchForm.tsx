import * as React from "react";
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
import DataSearchForm from "./searchFormComponents/DataSearchForm";
import ProposalSearchForm from "./searchFormComponents/ProposalSearchForm";
import TargetSearchForm, {
  validateTarget
} from "./searchFormComponents/TargetSearchForm";
import TelescopeSearchForm from "./searchFormComponents/TelescopeSearchForm";
import { IGeneral } from "../utils/ObservationQueryParameters";

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
            <TargetSearchForm target={target} onChange={this.targetChange} />
          </TargetGrid>
          <ProposalGrid>
            <ProposalSearchForm
              proposal={general}
              onChange={this.generalChange}
            />
          </ProposalGrid>
          <TelescopeGrid>
            <TelescopeSearchForm
              telescope={telescope}
              onChange={this.changeTelescope}
            />
          </TelescopeGrid>
          <DataGrid>
            <DataSearchForm
              dataTypes={data.dataType}
              selectedDataType={data.selectedDataType}
              arcs={data.arcs}
              biases={data.biases}
              flats={data.flats}
              standards={data.standards}
              onChange={this.onChange}
            />
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
