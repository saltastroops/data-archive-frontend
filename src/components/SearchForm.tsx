import * as React from "react";
import {
  CalibrationType,
  IGeneral,
  ISearchFormState,
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
import * as _ from "lodash";

interface ISearchFormProps {
  cache?: ISearchFormCache;
}

/**
 * The cache for the search form.
 *
 * The general and target details (and errors) are cached.
 */
export interface ISearchFormCache {
  general?: IGeneral;
  target?: ITarget;
}

/**
 * A form for defining search parameters for an observation search, and for
 * initiating the search.
 */
class SearchForm extends React.Component<ISearchFormProps, ISearchFormState> {
  public state: ISearchFormState = {
    general: { calibrations: new Set<CalibrationType>(), errors: {} },
    loading: false,
    target: {
      errors: {},
      resolver: "Simbad",
      searchConeRadiusUnits: "arcseconds"
    }
  };

  /**
   * Populate the state from cached values.
   */
  componentDidMount() {
    this.setState(() => (this.props.cache as any) || {});
  }

  /**
   * Handle changes of telescope-related parameters.
   */
  public telescopeChange = (value: ITelescope) => {
    const newState = {
      ...this.state,
      telescope: {
        ...value
      }
    };
    this.updateState(newState);
  };

  /**
   * Handle changes of target-related parameters.
   */
  public targetChange = (value: ITarget) => {
    const newState = {
      ...this.state,
      target: {
        ...value
      }
    };
    this.updateState(newState);
  };

  /**
   * Handle changes of general parameters.
   */
  public generalChange = (value: IGeneral) => {
    const newState = {
      ...this.state,
      general: {
        ...value
      }
    };
    this.updateState(newState);
  };

  /**
   * Perform an observation with the currently selected search parameters.
   */
  public searchArchive = async () => {
    this.updateState({
      ...this.state,
      loading: true
    });

    // Add errors to the search parameter details
    const target = await validatedTarget(this.state.target);
    const general = validatedProposal(this.state.general);
    const telescope = validatedTelescope(this.state.telescope);

    this.updateState({
      ...this.state,
      general,
      loading: false,
      target,
      telescope
    });
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
            <DataForm general={general} onChange={this.generalChange} />
          </DataGrid>
          <ButtonGrid>
            <input
              className="button is-primary"
              data-test="search-button"
              type="button"
              value="Search"
              onClick={this.searchArchive}
            />
          </ButtonGrid>
        </ParentGrid>
      </>
    );
  }

  /**
   * Update the form state and the cache.
   */
  private updateState = (update: object) => {
    this.setState(
      () => update,
      () => {
        if (this.props.cache) {
          this.props.cache.general = _.cloneDeep(this.state.general);
          this.props.cache.target = _.cloneDeep(this.state.target);
        }
      }
    );
  };
}

export default SearchForm;
