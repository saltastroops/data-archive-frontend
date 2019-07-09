import * as React from "react";
import { Query } from "react-apollo";
import { DATA_FILES_QUERY } from "../../graphql/Query";
import { whereCondition } from "../../util/query/whereCondition";
import { IGeneral, ITarget } from "../../utils/ObservationQueryParameters";
import ISearchFormCache from "./ISearchFormCache";
import DataKeys from "./results/DataKeys";
import ISearchResultsTableColumn from "./results/ISearchResultsTableColumn";
import SearchResultsTable from "./results/SearchResultsTable";
import SearchResultsTableColumnSelector from "./results/SearchResultsTableColumnSelector";
import SearchForm from "./SearchForm";

/**
 * Properties for the search page.
 *
 * cache:
 *     The cache for storing the form content.
 * screenDimensions:
 *     The inner height and width of the browser window.
 */
interface ISearchPageProps {
  cache?: ISearchFormCache;
  screenDimensions: { innerHeight: number; innerWidth: number };
}

/**
 * The state of the search page.
 *
 * results:
 *     The search results.
 * resultsTableColumns:
 *     The columns for the search results table.
 */
interface ISearchPageState {
  columns: string[];
  error: Error | null;
  resultsTableColumns: ISearchResultsTableColumn[];
  where: string;
}

interface ISearchResult {
  id: number;
  ownedByUser: boolean;
  metadata: [
    {
      name: string;
      value: boolean | number | string;
    }
  ];
}

export interface IObservation {
  available: boolean;
  files: [
    {
      [key: string]: boolean | number | string;
    }
  ];
  id: number | string;
  name: string;
  publicFrom: Date;
}

/**
 * The page for searching observations.
 */
class SearchPage extends React.Component<ISearchPageProps, ISearchPageState> {
  constructor(props: ISearchPageProps) {
    super(props);

    /**
     * The SearchResultsTable class sets first column's width to the cart
     * column's width and puts the former underneath the latter. So
     * effectively the first column is ignored, and a dummy column needs to be
     * added to compensate for that.
     */
    const columns: ISearchResultsTableColumn[] = [
      { dataKey: "dummyName", name: "dummy", visible: true },
      {
        dataKey: DataKeys.OBSERVATION_NAME,
        name: "Observation",
        visible: true
      },
      { dataKey: DataKeys.PROPOSAL_CODE, name: "Proposal", visible: true },
      {
        dataKey: DataKeys.TARGET_TYPE_EXPLANATION,
        name: "Target Type",
        visible: true
      },
      { dataKey: DataKeys.TARGET_NAME, name: "Target", visible: true },
      { dataKey: DataKeys.TARGET_RIGHT_ASCENSION, name: "RA", visible: true },
      { dataKey: DataKeys.TARGET_DECLINATION, name: "RA", visible: true }
    ];

    this.state = {
      columns: [],
      error: null,
      resultsTableColumns: columns,
      where: ""
    };
  }

  render() {
    const { cache, screenDimensions } = this.props;
    const { error: validationError, resultsTableColumns } = this.state;

    // The search form is a child of a Bulma container div element. The width of
    // this div depends on the screen size. We let the results table extend
    // horizontally beyond this div, so that no space is wasted. We keep a left
    // and right margin of 50 pixels around the table.
    const resultsTableMargin = 50;
    const maxResultsTableWidth =
      screenDimensions.innerWidth - 2 * resultsTableMargin;
    let containerDivWidth =
      screenDimensions.innerWidth - 2 * resultsTableMargin;
    if (window.matchMedia("(min-width: 1088px)").matches) {
      containerDivWidth = 960;
    }
    if (window.matchMedia("(min-width: 1280px)").matches) {
      containerDivWidth = 1152;
    }
    if (window.matchMedia("(min-width: 1472px)").matches) {
      containerDivWidth = 1344;
    }

    // The table margin will in general be negative so that the div extends
    // beyond the container div. However, if it isn't, we center the table.
    const resultsTableContainerMargin =
      containerDivWidth - maxResultsTableWidth < 0
        ? (containerDivWidth - maxResultsTableWidth) / 2
        : "auto";
    return (
      <Query
        query={DATA_FILES_QUERY}
        variables={{ where: this.state.where, columns: this.state.columns }}
        skip={!this.state.where}
      >
        {({ data, error, loading }: any) => {
          const results =
            data && !loading && !error
              ? this.parseSearchResults(data.dataFiles.dataFiles)
              : [];
          return (
            <>
              <SearchForm
                cache={cache}
                search={this.searchArchive}
                error={validationError || error}
              />
              {results && results.length !== 0 && (
                <>
                  <div
                    style={{
                      marginLeft: resultsTableContainerMargin,
                      marginRight: resultsTableContainerMargin,
                      width: maxResultsTableWidth
                    }}
                  >
                    <SearchResultsTable
                      columns={resultsTableColumns}
                      maxWidth={maxResultsTableWidth}
                      searchResults={results}
                    />
                  </div>
                  <SearchResultsTableColumnSelector
                    columns={resultsTableColumns}
                    onChange={this.updateResultsTableColumnVisibility}
                  />
                </>
              )}
            </>
          );
        }}
      </Query>
    );
  }

  /**
   * Perform an observation with the currently selected search parameters.
   */
  private searchArchive = async ({
    general,
    target,
    telescope
  }: {
    general: IGeneral;
    target: ITarget;
    telescope: any; // fighting TypeScript; telescope might be undefined
  }) => {
    let where: string;
    try {
      where = JSON.stringify(whereCondition({ general, target, telescope }));
      this.setState(() => ({ error: null }));
    } catch (e) {
      this.setState(() => ({ error: e }));
      return;
    }

    this.setState(() => ({
      columns: this.searchColumns(),
      where
    }));
  };

  /**
   * Parse search results, grouping them into observations.
   *
   * The observations are sorted in the order they are found in the search
   * results.
   *
   * The array of observations is returned.
   *
   */
  private parseSearchResults(results: ISearchResult[]): IObservation[] {
    const observationsMap = new Map<string, IObservation>();
    const observations = [];

    const now = Date.now();

    for (const result of results) {
      // The metadata is a list of name-value pairs. We need to convert this
      // into a plain object.
      const metadata = result.metadata.reduce(
        (o, item) => ({ ...o, [item.name]: item.value }),
        {} as any
      );

      const observationId = metadata[DataKeys.OBSERVATION_ID].toString();
      if (!observationsMap.has(observationId)) {
        // Create a new observations object. A string of the form "TN - #id" is
        // used as observation name, where TN is the telescope name and id is
        // identifier used by the telescope for the observation. If there is
        // no such identifier for the observation, only the telescope name is
        // used.
        // It is assumed that an observation is public if and only if the
        // currently considered data file is public, and that it is owned by the
        // user if the currently considered data file is owned by the user.
        // The assumptions are valid because both properties are indeed defined
        // per observation (and not per data file).
        const telescopeName = metadata[DataKeys.TELESCOPE_NAME];
        const telescopeObservationId =
          metadata[DataKeys.TELESCOPE_OBSERVATION_ID];
        const observationName =
          telescopeName +
          (telescopeObservationId ? " #" + telescopeObservationId : "");
        const ownedByUser = result.ownedByUser;
        const isPublic = now > metadata[DataKeys.START_TIME];
        const observation: IObservation = {
          available: ownedByUser || isPublic,
          files: [metadata],
          id: observationId,
          name: observationName,
          publicFrom: new Date(metadata[DataKeys.PUBLIC_FROM] as number)
        };

        // Store the observation in the map of of observations (to facilitate
        // looking it up) and in the array of observations (to keep track of the
        // correct order
        observations.push(observation);
        observationsMap.set(observationId, observation);
      } else {
        // Add the data file
        (observationsMap.get(observationId) as IObservation).files.push(
          metadata
        );
      }
    }

    return observations;
  }

  private searchColumns = () => {
    return [
      DataKeys.OBSERVATION_ID,
      DataKeys.PROPOSAL_CODE,
      DataKeys.TARGET_TYPE_EXPLANATION,
      DataKeys.TARGET_TYPE_NUMERIC_CODE,
      DataKeys.PUBLIC_FROM,
      DataKeys.RSS_EXPOSUSURE_TIME,
      DataKeys.START_TIME,
      DataKeys.TARGET_RIGHT_ASCENSION,
      DataKeys.TARGET_DECLINATION,
      DataKeys.TARGET_NAME,
      DataKeys.TELESCOPE_NAME,
      DataKeys.TELESCOPE_OBSERVATION_ID
    ];
  };

  /**
   * Update the visibility status of a results table column.
   */
  private updateResultsTableColumnVisibility = (
    dataKey: string,
    visible: boolean
  ) => {
    const columns = this.state.resultsTableColumns;
    const columnIndex = columns.findIndex(column => column.dataKey === dataKey);
    const updatedColumn = {
      ...columns[columnIndex],
      visible
    };
    if (columnIndex >= 0) {
      const updatedColumns = [
        ...columns.slice(0, columnIndex),
        updatedColumn,
        ...columns.slice(columnIndex + 1)
      ];
      this.setState({
        resultsTableColumns: updatedColumns
      });
    }
  };
}

export default SearchPage;
