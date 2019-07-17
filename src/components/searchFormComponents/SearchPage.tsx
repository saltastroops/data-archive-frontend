import * as React from "react";
import { Query } from "react-apollo";
import { DATA_FILES_QUERY } from "../../graphql/Query";
import { prune, whereCondition } from "../../util/query/whereCondition";
import {
  IFile,
  IGeneral,
  ITarget
} from "../../utils/ObservationQueryParameters";
import ISearchFormCache from "./ISearchFormCache";
import DataKeys from "./results/DataKeys";
import ISearchResultsTableColumn from "./results/ISearchResultsTableColumn";
import Pagination from "./results/Pagination";
import SearchResultsTable from "./results/SearchResultsTable";
import { searchResultsTableColumns } from "./results/SearchResultsTableColumns";
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
 * dbColumns:
 *     The (database) columns whose values should be returned by the search
 *     query,
 * error:
 *     An error. This does not include GraphQL errors.
 * tableColumns:
 *     The (table) columns to display in the search results table.
 *  where:
 *     JSON string with the where condition for the search query.
 */
interface ISearchPageState {
  databaseColumns: string[];
  error: Error | null;
  tableColumns: ISearchResultsTableColumn[];
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
  files: [IFile];
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

    this.state = {
      databaseColumns: [],
      error: null,
      tableColumns: [],
      where: ""
    };
  }

  render() {
    const { cache, screenDimensions } = this.props;
    const { error: validationError, tableColumns } = this.state;

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
      <>
        <Query
          query={DATA_FILES_QUERY}
          variables={{
            columns: this.state.databaseColumns,
            where: this.state.where
          }}
          skip={!this.state.where}
        >
          {({ data, error, loading, refetch }: any) => {
            const results =
              data && !loading && !error
                ? this.parseSearchResults(data.dataFiles.dataFiles)
                : [];
            const pageInfo =
              data && !loading && !error ? data.dataFiles.pageInfo : {};
            return (
              <>
                <SearchForm
                  cache={cache}
                  search={this.searchArchive}
                  error={validationError || error}
                  loading={loading}
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
                      <Pagination
                        refetch={refetch}
                        pageInfo={pageInfo}
                        refetchContent={this.refetchContent}
                      />
                      <SearchResultsTable
                        columns={tableColumns}
                        maxWidth={maxResultsTableWidth}
                        searchResults={results}
                      />
                      <Pagination
                        refetch={refetch}
                        pageInfo={pageInfo}
                        refetchContent={this.refetchContent}
                      />
                    </div>
                    <SearchResultsTableColumnSelector
                      columns={tableColumns}
                      onChange={this.updateResultsTableColumnVisibility}
                    />
                  </>
                )}
              </>
            );
          }}
        </Query>
      </>
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
    try {
      const whereObject = prune(whereCondition({ general, target, telescope }));
      const where = JSON.stringify(whereObject);
      const databaseColumns = this.databaseColumns(whereObject);
      const tableColumns = searchResultsTableColumns(databaseColumns);

      this.setState(() => ({
        databaseColumns,
        error: null,
        tableColumns,
        where
      }));
    } catch (e) {
      this.setState(() => ({ error: e }));
      return;
    }
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

      const telescopeName = metadata[DataKeys.TELESCOPE_NAME];
      const telescopeObservationId =
        metadata[DataKeys.TELESCOPE_OBSERVATION_ID];
      const observationName =
        telescopeName +
        (telescopeObservationId ? " #" + telescopeObservationId : "");
      metadata[DataKeys.OBSERVATION_NAME] = observationName;

      const file = (observationName: string, metadata: any) => {
        return {
          ...metadata,
          cartContent: {
            id: metadata[DataKeys.DATA_FILE_ID].toString(),
            name: metadata[DataKeys.DATA_FILE_FILENAME],
            observation: {
              __typename: "CartObservation",
              id: metadata[DataKeys.OBSERVATION_ID].toString(),
              name: metadata[DataKeys.OBSERVATION_NAME]
            },
            target: metadata[DataKeys.TARGET_NAME] || null
          }
        };
      };

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
        const ownedByUser = result.ownedByUser;
        const isPublic = now > metadata[DataKeys.START_TIME];
        const observation: IObservation = {
          available: ownedByUser || isPublic,
          files: [file(observationName, metadata)],
          id: observationId,
          name: observationName,
          publicFrom: new Date(metadata[
            DataKeys.OBSERVATION_PUBLIC_FROM
          ] as number)
        };

        // Store the observation in the map of of observations (to facilitate
        // looking it up) and in the array of observations (to keep track of the
        // correct order
        observations.push(observation);
        observationsMap.set(observationId, observation);
      } else {
        // Add the data file
        (observationsMap.get(observationId) as IObservation).files.push(
          file(observationName, metadata)
        );
      }
    }

    return observations;
  }

  private databaseColumns = (whereObject: any): string[] => {
    const columns = new Set<string>();

    // Parse the where condition recursively for columns
    function _columnsFromObject(o: any) {
      if (o.column) {
        // Store this column
        columns.add(o.column);
      } else if (Array.isArray(o)) {
        for (const item of o) {
          // Collect the columns in the array items
          _columnsFromObject(item);
        }
      } else if (typeof o === "object") {
        // Collect the columns in the child objects
        for (const key of Object.keys(o)) {
          _columnsFromObject(o[key]);
        }
      }
    }

    // Add some columns which should be queried at any rate
    columns.add(DataKeys.DATA_FILE_FILENAME);
    columns.add(DataKeys.DATA_FILE_ID);
    columns.add(DataKeys.OBSERVATION_ID);
    columns.add(DataKeys.OBSERVATION_NIGHT);
    columns.add(DataKeys.OBSERVATION_PUBLIC_FROM);
    columns.add(DataKeys.PROPOSAL_CODE);
    columns.add(DataKeys.TARGET_NAME);
    columns.add(DataKeys.TELESCOPE_NAME);
    columns.add(DataKeys.TELESCOPE_OBSERVATION_ID);

    // Collect all columns needed for the where condition
    _columnsFromObject(whereObject);

    // If the numeric code of the target type is queried, its explanation should
    // be queried as well
    if (columns.has(DataKeys.TARGET_TYPE_NUMERIC_CODE)) {
      columns.add(DataKeys.TARGET_TYPE_EXPLANATION);
    }

    return Array.from(columns);
  };

  /**
   * Update the visibility status of a results table column.
   */
  private updateResultsTableColumnVisibility = (
    dataKey: string,
    visible: boolean
  ) => {
    const columns = this.state.tableColumns;
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
        tableColumns: updatedColumns
      });
    }
  };

  private refetchContent = (fromIndex: number, refetch: any) => {
    refetch({
      columns: this.state.databaseColumns,
      startIndex: fromIndex,
      where: this.state.where
    });
  };
}

export default SearchPage;
