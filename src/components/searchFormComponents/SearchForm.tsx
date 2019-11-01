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
  MainGrid,
  NumberGrid,
  ParentGrid,
  ParentGridSingle,
  ProposalGrid,
  Span,
  SubGrid,
  TargetGrid,
  TelescopeGrid
} from "../basicComponents/Grids";
import InputField from "../basicComponents/InputField";
import ISearchFormCache from "./ISearchFormCache";
import ProposalForm, { validatedProposal } from "./ProposalForm";
import TargetForm, { validatedTarget } from "./TargetForm";
import TelescopeForm, { validatedTelescope } from "./TelescopeForm";

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
  updateItemsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  limit: any;
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
    general: {
      calibrations: new Set<CalibrationType>(),
      errors: {},
      rejected: "",
      science: "Science"
    },
    limitError: undefined,
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
    const { error, loading, limit, updateItemsPerPage } = this.props;
    const { general, limitError, target, telescope } = this.state;

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
        <ParentGrid>
          <ButtonGrid>
            <MainGrid>
              <SubGrid>
                <a
                  className={"button is-text"}
                  data-test="reset-all-button"
                  onClick={this.resetAll}
                >
                  reset all
                </a>
                <NumberGrid>
                  <p>Number of results</p>
                  <InputField
                    error={limitError}
                    name={"items-per-page"}
                    value={limit}
                    onChange={updateItemsPerPage}
                  />
                </NumberGrid>
              </SubGrid>
              <SubGrid>
                <p />
              </SubGrid>
              <SubGrid>
                <NumberGrid>
                  <Span>
                    {error && (
                      <div className="has-text-danger">{error.message}</div>
                    )}
                    <button
                      disabled={loading}
                      className={`button is-primary ${loading && "is-loading"}`}
                      data-test="search-button"
                      type="button"
                      value="Search"
                      onClick={this.onSubmit}
                    >
                      search
                    </button>
                  </Span>
                </NumberGrid>
              </SubGrid>
            </MainGrid>
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
    this.setState({
      ...this.state,
      limitError: validatedLimit(this.props.limit)
    });

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
      ) &&
      isValidLimit(this.props.limit)
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

  private resetAll = () => {
    const newState = {
      ...this.state,
      general: { calibrations: new Set<CalibrationType>(), errors: {} },
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
const isValidLimit = (limit: string) => {
  return /^\+?(0|[1-9]\d*)$/.test(limit);
};
const validatedLimit = (limit: string) => {
  return !isValidLimit(limit)
    ? "Limit should be a positive integer"
    : undefined;
};
export default SearchForm;
