import * as _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import {
  IGeneral,
  ISearchFormState,
  ITarget,
  ITelescope,
  ProductType
} from "../../utils/ObservationQueryParameters";
import { TargetType } from "../../utils/TargetType";
import { isError, validateDate } from "../../utils/validators";
import {
  ButtonGrid,
  ParentGrid,
  ParentGridSingle,
  ProposalGrid,
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

const SearchButtonsContainer = styled.div.attrs({
  className: "main-grid"
})`
  && {
    display: grid;
    grid-template-columns: auto auto 33%;
    padding: 10px;
    @media (max-width: 988px) {
      grid-template-columns: auto;
    }
  }
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
      productTypes: new Set<ProductType>(["Science"]),
      rejected: ""
    },
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
    const { error, loading, openColumnSelector } = this.props;
    const { general, target, telescope } = this.state;

    return (
      <>
        <ParentGrid>
          <TargetGrid>
            <TargetForm target={target} onChange={this.targetChange} />
          </TargetGrid>
          <ProposalGrid>
            <ProposalForm general={general} onChange={this.generalChange} />
          </ProposalGrid>
        </ParentGrid>
        <ParentGridSingle>
          <TelescopeGrid>
            <TelescopeForm
              telescope={telescope}
              onChange={this.telescopeChange}
            />
          </TelescopeGrid>
        </ParentGridSingle>

        <div className={"is-pulled-right"}>
          <br />
          <button
            className={"button is-text"}
            data-test="reset-all-button"
            onClick={this.resetAll}
          >
            reset all
          </button>
        </div>

        {error && <div className="has-text-danger">{error.message}</div>}
        <ButtonGrid>
          <SearchButtonsContainer>
            <SubGrid>
              <div className={"is-text"}>Number of results per page</div>
              <div className="field is-grouped">
                <p className="control">
                  <InputField
                    error={general.errors.limit}
                    name={"items-per-page"}
                    value={general.limit}
                    onChange={this.updateItemsPerPage}
                  />
                </p>
                <p className="control">
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
                </p>
              </div>
            </SubGrid>
            <SubGrid>
              <br />
              <button className={"button"} onClick={openColumnSelector}>
                Manage columns to display
              </button>
            </SubGrid>
          </SearchButtonsContainer>
        </ButtonGrid>
      </>
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

    this.updateState({
      ...this.state,
      general,
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
    if (Number(limit) > 10000) {
      return "The maximum number of results to display is 10000.";
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
