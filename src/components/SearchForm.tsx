import * as React from "react";
import {
  IGeneral,
  IGeneralErrors,
  IObservation,
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
    cart: any;
    general: IGeneral;
    target: ITarget;
    results: IObservation[];
    telescope: ITelescope;
    loading: boolean;
  } = {
    cart: [],
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

  public updateCart = (cart: any) => {
    const newState = {
      ...this.state,
      cart: [...cart]
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
                category: "cat-5",
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
                telescope: "string",
                url: "./image0.jpg"
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
                category: "cat-1",
                dataType: "string",
                declination: "string",
                filename: "string",
                instrument: "string",
                isReduced: true,
                name: "name-2",
                observationId: "string",
                rightAscension: "string",
                targetName: "string",
                telescope: "string"
              },
              {
                category: "cat-2",
                dataType: "string",
                declination: "string",
                filename: "string",
                instrument: "string",
                isReduced: true,
                name: "name-4",
                observationId: "string",
                rightAscension: "string",
                targetName: "string",
                telescope: "string",
                url: "./image0.jpg"
              },
              {
                category: "cat-3",
                dataType: "string",
                declination: "string",
                filename: "string",
                instrument: "string",
                isReduced: true,
                name: "name-5",
                observationId: "string",
                rightAscension: "string",
                targetName: "string",
                telescope: "string",
                url: "./image4.jpg"
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
                category: "cat-4",
                dataType: "string",
                declination: "string",
                filename: "string",
                instrument: "string",
                isReduced: true,
                name: "name-3",
                observationId: "string",
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
    const { target, general, telescope, loading, results, cart } = this.state;
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
            <button
              disabled={loading}
              className="button is-primary"
              onClick={this.searchArchive}
            >
              search
            </button>
          </ButtonGrid>
        </ParentGrid>
        {results && results.length !== 0 && (
          <SearchResults
            searchResults={results}
            cart={cart}
            updateCart={this.updateCart}
          />
        )}
      </>
    );
  }
}

export default SearchForm;
