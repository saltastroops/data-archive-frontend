import * as _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import {
  IGeneral,
  ISearchFormState,
  ITarget,
  ITelescope,
  ProductType,
  Status
} from "../../utils/ObservationQueryParameters";
import { TargetType } from "../../utils/TargetType";
import { isError, validateDate } from "../../utils/validators";
import {
  ButtonGrid,
  ParentGrid,
  ParentGridSingle,
  ProposalGrid,
  SearchGrid,
  SubGrid,
  TargetGrid,
  TelescopeGrid
} from "../basicComponents/Grids";
import InputField from "../basicComponents/InputField";
import ISearchFormCache from "./ISearchFormCache";
import ProposalForm from "./ProposalForm";
import { DEFAULT_LIMIT } from "./SearchPage";
import TargetForm, { validatedTarget } from "./TargetForm";
import TelescopeForm, { validatedTelescope } from "./TelescopeForm";

const LimitGrid = styled.div.attrs({
  className: "grid-item"
})`
  display: grid;
  grid-template-columns: 10%
  border: 1px solid rgba(255, 255, 255, 0);
  text-align: left;
`;

/**
 * Properties for the search form.
 *
 * cache:
 *     The cache for storing the form content.
 * error:
 *     An error.
 * search:
 *     The function for carrying out the search. It must expect an object with
 *     the general, target and telescope data as its only argument.
 */
interface ISearchFormProps {
  cache?: ISearchFormCache;
  error?: Error;
  limitError?: string;
  loading: boolean;
  openColumnSelector: () => void;
  search: (
    startIndex: number
  ) => ({
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
    general: {
      errors: {},
      limit: DEFAULT_LIMIT,
      observationStatuses: new Set<Status>(["Accepted"]),
      productTypes: new Set<ProductType>(["Science"])
    },
    hasSearchFormError: false,
    target: {
      errors: {},
      resolver: "Simbad",
      searchConeRadius: "",
      searchConeRadiusUnits: "arcseconds",
      targetTypes: new Set<TargetType>()
    },
    telescope: {
      telescopes: []
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
      ...value,
      hasSearchFormError: false,
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
      hasSearchFormError: false,
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
      },
      hasSearchFormError: false
    };
    this.updateState(newState);
  };

  public render() {
    const { error, loading, openColumnSelector } = this.props;
    const { general, target, telescope } = this.state;

    return (
      <SearchGrid>
        <ParentGridSingle>
          <ParentGrid>
            <TargetGrid>
              <TargetForm target={target} onChange={this.targetChange} />
            </TargetGrid>
            <div
              style={{
                height: "20px"
              }}
            />
            <ProposalGrid>
              <ProposalForm general={general} onChange={this.generalChange} />
            </ProposalGrid>
          </ParentGrid>
        </ParentGridSingle>
        <ParentGridSingle>
          <TelescopeGrid>
            <TelescopeForm
              telescope={telescope}
              onChange={this.telescopeChange}
            />
          </TelescopeGrid>
        </ParentGridSingle>

        <div className={"is-text"}>Number of results per page</div>
        <LimitGrid>
          <div className="field ">
            <p className="control">
              <InputField
                error={general.errors.limit}
                name={"items-per-page"}
                value={general.limit}
                onChange={this.updateItemsPerPage}
              />
            </p>
          </div>
        </LimitGrid>

        {this.state.hasSearchFormError && (
          <div className="has-text-danger">
            Please make sure that all form content is valid
          </div>
        )}
        {error && (
          <div className="has-text-danger">
            {error.message
              ? error.message
              : "Something's wrong. Please try again later or contact salthelp@salt.ac.za."}
          </div>
        )}
        <div>
          <ButtonGrid>
            <button
              disabled={loading}
              className={`button is-info ${loading && "is-loading"}`}
              data-test="search-button"
              type="button"
              value="Search"
              onClick={this.onSubmit}
            >
              Search
            </button>

            <div
              style={{
                height: "1em"
              }}
            />

            <button
              className={"button is-text has-text-info has-text-left"}
              type="button"
              onClick={openColumnSelector}
            >
              Manage columns to display
            </button>
            <div
              style={{
                height: "1em"
              }}
            />

            <button
              className={"button is-text has-text-left"}
              data-test="reset-all-button"
              onClick={this.resetAll}
            >
              reset all
            </button>

            <div
              style={{
                height: "1em"
              }}
            />
          </ButtonGrid>
        </div>
      </SearchGrid>
    );
  }

  /**
   * Initiate the search.
   */
  private onSubmit = async () => {
    // Add errors to the search parameter details
    const target = await validatedTarget(this.state.target);
    const general = this.validatedGeneral(this.state.general);
    const telescope = await validatedTelescope(this.state.telescope);
    const hasSearchFormError = isError(
      general.errors,
      target.errors,
      (telescope && telescope.errors) || {}
    );

    this.updateState({
      ...this.state,
      general,
      hasSearchFormError,
      target,
      telescope
    });
    if (!hasSearchFormError) {
      // Search with a start index of 0
      this.props.search(0)({ general, target, telescope });
    }
  };

  /**
   * Validate the general details.
   */
  private validatedGeneral = (general: IGeneral) => {
    return {
      ...general,
      errors: {
        limit: this.validateLimit(general.limit || ""),
        observationNight: validateDate(general.observationNight || "")
      }
    };
  };

  /**
   * Validate the limit, i.e. the maximum number of search results per page.
   */
  private validateLimit = (limit: string) => {
    const isPositiveInt = /^\+?([1-9]\d*)$/.test(limit);
    if (!isPositiveInt) {
      return "The number of search results must be a positive integer.";
    }
    if (Number(limit) > 1000) {
      return "The maximum number of results to display is 1000.";
    }
    return "";
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

  /**
   * Update the number of items to show per page.
   */
  private updateItemsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.generalChange({
      ...this.state.general,
      errors: {
        ...this.state.general.errors
      },
      limit: value
    });
  };

  /**
   * Reset the query parameters.
   */
  private resetAll = () => {
    const newState = {
      ...this.state,
      general: {
        errors: {},
        limit: DEFAULT_LIMIT,
        productTypes: new Set<ProductType>(["Science"]),
        rejected: false
      },
      target: {
        errors: {},
        resolver: "Simbad",
        searchConeRadius: "",
        searchConeRadiusUnits: "arcseconds",
        targetTypes: new Set<TargetType>()
      },
      telescope: {}
    };
    this.updateState(newState);
  };
}

export default SearchForm;
