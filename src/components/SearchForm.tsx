import * as React from "react";
import {
  IGeneral,
  IGeneralErrors,
  ISearchResults,
  ITarget,
  ITargetErrors,
  ITelescope
} from "../utils/ObservationQueryParameters";
import { isError } from "../utils/validators";
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
import SearchResults from "./searchFormComponents/results/SearchResults";
import TargetForm, { validatedTarget } from "./searchFormComponents/TargetForm";
import TelescopeForm, {
  validatedTelescope
} from "./searchFormComponents/TelescopeForm";

class SearchForm extends React.Component {
  public state: {
    general: IGeneral;
    target: ITarget;
    results: ISearchResults[];
    telescope: ITelescope;
    loading: boolean;
  } = {
    general: { errors: {} },
    loading: false,
    results: [],
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
    const general = await validatedProposal(this.state.general);
    const telescope = await validatedTelescope(this.state.telescope);
    await this.setState(() => ({
      ...this.state,
      general,
      target,

      telescope
    }));
    if (
      !isError(general.errors as IGeneralErrors, target.errors as ITargetErrors)
    ) {
      // TODO query the server
      this.setState(() => ({
        ...this.state,
        results: [
          {
            files: [
              {
                category: "string",
                dataType: "string",
                declination: "string",
                filename: "string",
                instrument: "string",
                isReduced: true,
                name: "name-1",
                observationNight: "string",
                proposalCode: "string",
                rightAscension: "string",
                targetName: "string",
                telescope: "string"
              }
            ],
            id: "obs1",
            name: "obs1",
            proposal: "proposal 1",
            startTime: "2018-02-02 17:55:23",
            telescope: "telescope 1"
          },
          {
            files: [
              {
                category: "string",
                dataType: "string",
                declination: "string",
                filename: "string",
                instrument: "string",
                isReduced: true,
                name: "name-2",
                observationNight: "string",
                proposalCode: "string",
                rightAscension: "string",
                targetName: "string",
                telescope: "string"
              },
              {
                category: "string",
                dataType: "string",
                declination: "string",
                filename: "string",
                instrument: "string",
                isReduced: true,
                name: "name-4",
                observationNight: "string",
                proposalCode: "string",
                rightAscension: "string",
                targetName: "string",
                telescope: "string"
              },
              {
                category: "string",
                dataType: "string",
                declination: "string",
                filename: "string",
                instrument: "string",
                isReduced: true,
                name: "name-5",
                observationNight: "string",
                proposalCode: "string",
                rightAscension: "string",
                targetName: "string",
                telescope: "string"
              }
            ],
            id: "obs2",
            name: "obs2",
            proposal: "proposal 2",
            startTime: "2018-02-02 17:55:23",
            telescope: "telescope 1"
          },
          {
            files: [
              {
                category: "string",
                dataType: "string",
                declination: "string",
                filename: "string",
                instrument: "string",
                isReduced: true,
                name: "name-3",
                observationNight: "string",
                proposalCode: "string",
                rightAscension: "string",
                targetName: "string",
                telescope: "string"
              }
            ],
            id: "obs3",
            name: "obs3",
            proposal: "proposal 3",
            startTime: "2018-02-02 17:55:23",
            telescope: "telescope 2"
          }
        ]
      }));
    }
    this.setState(() => ({
      ...this.state,
      loading: false
    }));
  };

  public render() {
    const { target, general, telescope, loading, results } = this.state;
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
          {results && results.length !== 0 && (
            <SearchResults searchResults={results} />
          )}
        </ParentGrid>
      </>
    );
  }
}

export default SearchForm;
