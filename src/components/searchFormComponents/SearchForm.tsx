import * as _ from "lodash";
import * as React from "react";
import {
  CalibrationType,
  IGeneral,
  ISearchFormState,
  ITarget,
  ITelescope
} from "../../utils/ObservationQueryParameters";
import { TargetType } from "../../utils/TargetType";
import { isError } from "../../utils/validators";
import {
  ButtonGrid,
  DataGrid,
  ParentGrid,
  ProposalGrid,
  Spinner,
  TargetGrid,
  TelescopeGrid
} from "../basicComponents/Grids";
import DataForm from "./DataForm";
import ISearchFormCache from "./ISearchFormCache";
import ProposalForm, { validatedProposal } from "./ProposalForm";
import DataKeys from "./results/DataKeys";
import ISearchResultsTableColumn from "./results/ISearchResultsTableColumn";
import SearchResultsTable from "./results/SearchResultsTable";
import TargetForm, { validatedTarget } from "./TargetForm";
import TelescopeForm, { validatedTelescope } from "./TelescopeForm";

/**
 * Properties for the search form.
 *
 * cache:
 *     The cache for storing the form content.
 * search:
 *     The function for carrying out the search. It must expect an object with
 *     the general, target and telescope data as its only argument.
 */
interface ISearchFormProps {
  cache?: ISearchFormCache;
  search: ({
    general,
    target,
    telescope
  }: {
    general: IGeneral;
    target: ITarget;
    telescope: ITelescope | undefined;
  }) => void;
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
      searchConeRadius: "",
      searchConeRadiusUnits: "arcseconds",
      targetTypes: new Set<TargetType>()
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
            <button
              disabled={loading}
              className="button is-primary"
              data-test="search-button"
              type="button"
              value="Search"
              onClick={this.onSubmit}
            >
              search
            </button>
          </ButtonGrid>
        </ParentGrid>
      </>
    );
  }

  /**
   * Initiate the search.
   */
  private onSubmit = async () => {
    // Add errors to the search parameter details
    const target = await validatedTarget(this.state.target);
    const general = await validatedProposal(this.state.general);
    const telescope = await validatedTelescope(this.state.telescope);

    this.updateState({
      ...this.state,
      general,
      loading: false,
      target,
      telescope
    });
    if (
      !isError(
        general.errors,
        target.errors,
        (telescope && telescope.errors) || {}
      )
    ) {
      this.props.search({ general, target, telescope });
    }
  };

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
          this.props.cache.telescope = _.cloneDeep(this.state.telescope);
        }
      }
    );
  };
}

export default SearchForm;
