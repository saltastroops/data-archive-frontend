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
  Spinner,
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
import SearchResults from "./searchFormComponents/results/SearchResults";

class SearchForm extends React.Component {
  public state: {
    general: IGeneral;
    target: ITarget;
    telescope: ITelescope;
    loading: boolean;
  } = {
    general: { errors: {} },
    loading: false,
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
    this.setState(() => ({
      ...this.state,
      loading: true
    }));
    const target = await validatedTarget(this.state.target);
    const general = validatedProposal(this.state.general);
    const telescope = validatedTelescope(this.state.telescope);
    this.setState(() => ({
      ...this.state,
      general,
      loading: false,
      target,
      telescope
    }));
  };

  public render() {
    const { target, general, telescope, loading } = this.state;
    return (
      <>
        {loading && (
          <div className="dimScreen">
            <Spinner />
          </div>
        )}
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
        <ParentGrid>
          <SearchResults
            searchResults={[
              {
                name: "obs1",
                files: [
                  {
                    filename: "string",
                    name: "name-1",
                    dataType: "string",
                    isRedused: true,
                    targetName: "string",
                    rightAscension: "string",
                    declination: "string",
                    observationNight: "string",
                    category: "string",
                    telescope: "string",
                    instrument: "string",
                    proposalCode: "string"
                  }
                ]
              },
              {
                name: "obs2",
                files: [
                  {
                    filename: "string",
                    name: "name-2",
                    dataType: "string",
                    isRedused: true,
                    targetName: "string",
                    rightAscension: "string",
                    declination: "string",
                    observationNight: "string",
                    category: "string",
                    telescope: "string",
                    instrument: "string",
                    proposalCode: "string"
                  },
                  {
                    filename: "string",
                    name: "name-4",
                    dataType: "string",
                    isRedused: true,
                    targetName: "string",
                    rightAscension: "string",
                    declination: "string",
                    observationNight: "string",
                    category: "string",
                    telescope: "string",
                    instrument: "string",
                    proposalCode: "string"
                  },
                  {
                    filename: "string",
                    name: "name-5",
                    dataType: "string",
                    isRedused: true,
                    targetName: "string",
                    rightAscension: "string",
                    declination: "string",
                    observationNight: "string",
                    category: "string",
                    telescope: "string",
                    instrument: "string",
                    proposalCode: "string"
                  }
                ]
              },
              {
                name: "obs3",
                files: [
                  {
                    filename: "string",
                    name: "name-3",
                    dataType: "string",
                    isRedused: true,
                    targetName: "string",
                    rightAscension: "string",
                    declination: "string",
                    observationNight: "string",
                    category: "string",
                    telescope: "string",
                    instrument: "string",
                    proposalCode: "string"
                  }
                ]
              }
            ]}
          />
        </ParentGrid>
        <h1>Hello</h1>
      </>
    );
  }
}

export default SearchForm;
