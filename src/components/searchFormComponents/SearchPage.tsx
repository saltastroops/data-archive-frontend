import { QueryOptions } from "apollo-client";
import * as React from "react";
import { ApolloConsumer } from "react-apollo";
import styled from "styled-components";
import { DATA_FILES_QUERY } from "../../graphql/Query";
import cache from "../../util/cache";
import { prune, whereCondition } from "../../util/query/whereCondition";
import {
  IFile,
  IGeneral,
  ITarget,
} from "../../utils/ObservationQueryParameters";
import InfoMessage from "../basicComponents/InfoMessage";
import ISearchFormCache from "./ISearchFormCache";
import DataKeys from "./results/DataKeys";
import ISearchResultsTableColumn from "./results/ISearchResultsTableColumn";
import Pagination, { PaginationDirection } from "./results/Pagination";
import SearchResultsTable from "./results/SearchResultsTable";
import {
  availableResultsTableColumns,
  searchResultsTableColumns,
} from "./results/SearchResultsTableColumns";
import SearchResultsTableColumnSelector from "./results/SearchResultsTableColumnSelector";
import SearchForm from "./SearchForm";
import SearchQuery from "./SearchQuery";
import moment from "moment";
import { CSVLink } from "react-csv";

/**
 * The default maximum number of results a query should return.
 */
export const DEFAULT_LIMIT = "100";

/**
 * The default start index for a query.
 */
export const DEFAULT_START_INDEX = 0;

/**
 * Properties for the search page.
 *
 * cache:
 *     The cache for storing the form content.
 * screenDimensions:
 *     The inner height and width of the browser window.
 */
interface ISearchPageProps {
  searchFormCache: ISearchFormCache;
  searchPageCache: ISearchPageCache;
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
export interface ISearchPageState {
  databaseColumns: string[];
  error: Error | null;
  modal: {
    open: boolean;
  };
  startIndex: number;
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

export interface ISearchPageCache {
  databaseColumns?: string[];
  startIndex: number;
  tableColumns?: ISearchResultsTableColumn[];
  where?: string;
}

export interface IObservation {
  files: [IFile];
  id: number | string;
  name: string;
}

/**
 * A blank div acting as a placeholder if there is no data to displace to minimize pagination and searching shift/jump
 *
 */
const ResultsPlaceholder = styled.div`
  display: block;
  width: 100%;
  height: 744px;
`;

export function download(columns: any[], SearchResults: any) {
  const tableHeaderContent: ISearchResultsTableColumn[] = [];
  columns.forEach((column) => {
    if (column.name !== "dummy") {
      tableHeaderContent.push(column);
    }
  });
  const results: any = {};

  function isNumeric(n: string | number) {
    return !isNaN(parseFloat(n as string)) && isFinite(n as number);
  }
  SearchResults.forEach((result: any) => {
    result.files.forEach((artifact: any) => {
      const finalObj: any = {};
      tableHeaderContent.map((header) => {
        if (
          !(header.name in finalObj) &&
          artifact[header.dataKey] !== undefined
        ) {
          if (
            artifact[header.dataKey] % 1 !== 0 &&
            isNumeric(artifact[header.dataKey])
          ) {
            finalObj[header.name.toLowerCase()] = parseFloat(
              artifact[header.dataKey]
            ).toFixed(4);
            results[artifact["artifact.name"]] = finalObj;
          } else if (
            artifact[header.dataKey] % 1 === 0 &&
            isNumeric(artifact[header.dataKey])
          ) {
            finalObj[header.name.toLowerCase()] = moment(
              parseInt(artifact[header.dataKey], 10)
            ).format("D MMM YYYY");
            results[artifact["artifact.name"]] = finalObj;
          } else {
            finalObj[header.name.toLowerCase()] = artifact[header.dataKey];
            results[artifact["artifact.name"]] = finalObj;
          }
        }
      });
    });
  });
  const csvData: any = [];
  const csvHeaders: any = [];

  Object.keys(results).forEach((key) => {
    csvData.push(results[key]);
  });

  tableHeaderContent.forEach((header) => {
    const finalHeaders: any = {};
    if (header.name === "Info") {
      delete finalHeaders[header.name];
    } else {
      finalHeaders.label = header.name;
      finalHeaders.key = header.name.toLowerCase();
      csvHeaders.push(finalHeaders);
    }
  });
  return [csvData, csvHeaders];
}

const PaginationContainer = styled.div<{
  marginTop: number;
  marginBottom: number;
}>`
  && {
    display: grid;
    grid-template-columns: 700px;
    justify-content: center;
    margin-bottom: ${(props) => props.marginBottom}px;
    margin-top: ${(props) => props.marginTop}px;
  }
`;

/**
 * The page for searching observations.
 */
class SearchPage extends React.Component<ISearchPageProps, ISearchPageState> {
  constructor(props: ISearchPageProps) {
    super(props);

    const { searchPageCache } = props;
    const databaseColumns = searchPageCache.databaseColumns || [];
    const startIndex = searchPageCache.startIndex;
    const tableColumns =
      searchPageCache.tableColumns || availableResultsTableColumns();
    const where = searchPageCache.where || "";

    this.state = {
      databaseColumns,
      error: null,
      modal: {
        open: false,
      },
      startIndex,
      tableColumns,
      where,
    };
  }

  render() {
    const { screenDimensions, searchFormCache } = this.props;
    const { error: validationError, startIndex, where } = this.state;

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
    const options: QueryOptions = {
      query: DATA_FILES_QUERY,
      variables: {
        columns: this.state.databaseColumns,
        limit: parseInt(
          (searchFormCache.general && searchFormCache.general.limit) ||
            DEFAULT_LIMIT,
          10
        ),
        startIndex,
        where,
      },
    };

    return (
      <ApolloConsumer>
        {(client) => (
          <SearchQuery
            client={client}
            options={options}
            skip={!this.state.where}
          >
            {({ data, error, loading, fetch, preload }: any) => {
              const results =
                data && !loading && !error
                  ? this.parseSearchResults(data.dataFiles.dataFiles)
                  : [];
              const pageInfo =
                data && !loading && !error ? data.dataFiles.pageInfo : {};
              const dataFilesCount =
                data && !loading && !error
                  ? data.dataFiles.dataFiles.length
                  : 0;
              const displayedTableColumns = searchResultsTableColumns(
                this.state.tableColumns
              );

              return (
                <>
                  {this.state.modal.open && (
                    <SearchResultsTableColumnSelector
                      closeModal={this.closeColumnSelectionModal(
                        fetch,
                        preload
                      )}
                      columns={this.state.tableColumns}
                      onChange={this.updateResultsTableColumnVisibility}
                    />
                  )}

                  <SearchForm
                    cache={searchFormCache}
                    search={this.searchArchive(fetch, preload)}
                    error={validationError || error}
                    loading={loading}
                    openColumnSelector={this.openColumnSelector}
                  />
                  {results && results.length !== 0 ? (
                    <>
                      <div
                        style={{
                          marginLeft: resultsTableContainerMargin,
                          marginRight: resultsTableContainerMargin,
                          width: maxResultsTableWidth,
                        }}
                      >
                        <PaginationContainer marginBottom={10} marginTop={20}>
                          <Pagination
                            fetchPage={this.fetchPage(fetch, preload)}
                            itemsOnCurrentPage={dataFilesCount}
                            itemsPerPage={pageInfo.itemsPerPage}
                            itemsTotal={pageInfo.itemsTotal}
                            startIndex={pageInfo.startIndex}
                          />
                        </PaginationContainer>
                        <CSVLink
                          data={download(displayedTableColumns, results)[0]}
                          headers={download(displayedTableColumns, results)[1]}
                          filename={"results.csv"}
                          style={{ marginLeft: 75 }}
                        >
                          Download results as CSV
                        </CSVLink>
                        <InfoMessage
                          message={
                            "You may scroll horizontally and vertically within the table."
                          }
                        />
                        <SearchResultsTable
                          columns={displayedTableColumns}
                          maxWidth={maxResultsTableWidth}
                          searchResults={results}
                        />
                        <PaginationContainer marginBottom={40} marginTop={10}>
                          <Pagination
                            fetchPage={this.fetchPage(fetch, preload)}
                            itemsOnCurrentPage={dataFilesCount}
                            itemsPerPage={pageInfo.itemsPerPage}
                            itemsTotal={pageInfo.itemsTotal}
                            startIndex={pageInfo.startIndex}
                          />
                        </PaginationContainer>
                      </div>
                    </>
                  ) : (
                    <ResultsPlaceholder>
                      {!loading &&
                        !error &&
                        results &&
                        results.length === 0 &&
                        this.state.where && (
                          <div>
                            Oops. There are no results for this search query.
                          </div>
                        )}
                    </ResultsPlaceholder>
                  )}
                </>
              );
            }}
          </SearchQuery>
        )}
      </ApolloConsumer>
    );
  }

  /**
   * Close the preview modal and redo the search if new database is required.
   */
  private closeColumnSelectionModal = (
    fetch: (options: QueryOptions) => void,
    preload: (options: QueryOptions) => void
  ) => {
    return async () => {
      this.setState(() => ({ ...this.state, modal: { open: false } }));

      // Repeat the search query
      const { general, target, telescope } = this.props.searchFormCache;
      if (general && target && telescope) {
        await this.searchArchive(fetch, preload)(this.state.startIndex)({
          general,
          target,
          telescope,
        });
      }
    };
  };

  /**
   * Return a function which returns a function which performs a data file
   * search with the currently selected search parameters and a given start
   * index.
   *
   * Parameters
   * ----------
   * fetch: (v: QueryOptions) => void
   *     Function that triggers a new query.
   * reload: (v: QueryOptions) => void
   *     Function that preloads data.
   */
  private searchArchive = (
    fetch: (options: QueryOptions) => void,
    preload: (options: QueryOptions) => void
  ) => {
    return (startIndex: number) => ({
      general,
      target,
      telescope,
    }: {
      general: IGeneral;
      target: ITarget;
      telescope: any; // fighting TypeScript; telescope might be undefined
    }) => {
      try {
        const searchPageCache = this.props.searchPageCache;
        const whereObject = prune(
          whereCondition({ general, target, telescope })
        );
        const where = JSON.stringify(whereObject);
        const databaseColumns = this.databaseColumns(whereObject);

        // It seems that when it comes to the meta data Apollo does not update
        // the cache content correctly. We therefore delete all data files from
        // cache before refetching the query. This code is taken from
        // https://medium.com/@martinseanhunt/how-to-invalidate-cached-data-in-apollo-and-handle-updating-paginated-queries-379e4b9e4698
        Object.keys((cache as any).data.data).forEach((key) => {
          if (key.match(/^DataFile/)) {
            (cache as any).data.delete(key);
          }
        });

        // Record the search parameters
        searchPageCache.databaseColumns = [...databaseColumns];
        searchPageCache.where = where;

        // Clicking on the submit button should always trigger a new search
        // query (even if none of the search parameters has changed) hence we
        // use refetch after updating the state
        this.setState(
          () => ({
            databaseColumns,
            error: null,
            startIndex,
            where,
          }),
          async () => {
            const limit = parseInt(general.limit || DEFAULT_LIMIT, 10);
            const options: QueryOptions = {
              fetchPolicy: "network-only",
              query: DATA_FILES_QUERY,
              variables: {
                columns: databaseColumns,
                limit,
                startIndex: this.state.startIndex,
                where,
              },
            };
            await fetch(options);

            // Update the cache with the new database columns and start index
            this.props.searchPageCache.databaseColumns = this.state.databaseColumns;
            this.props.searchPageCache.startIndex = this.state.startIndex;

            this.preloadPage(preload, limit, limit + this.state.startIndex);
          }
        );
      } catch (e) {
        this.setState(() => ({ error: e }));
        return;
      }
    };
  };

  /**
   * Return a function which fetches a new page.
   */
  private fetchPage = (
    fetch: (options: QueryOptions) => void,
    preload: (options: QueryOptions) => void
  ) => {
    return async (
      startIndex: number,
      limit: number,
      direction: PaginationDirection
    ) => {
      // Update the cache with the new start index
      this.props.searchPageCache.startIndex = startIndex;

      // Perform the query for the new page
      const fetchPageOptions: QueryOptions = {
        fetchPolicy: "cache-first",
        query: DATA_FILES_QUERY,
        variables: {
          columns: this.state.databaseColumns,
          limit,
          startIndex,
          where: this.state.where,
        },
      };
      await fetch(fetchPageOptions);

      // Preload the previous or next page
      if (direction === "NEXT") {
        this.preloadPage(preload, limit, startIndex + limit);
      } else {
        (fetchPageOptions.variables as any).startIndex = startIndex - limit;
        this.preloadPage(preload, limit, startIndex + limit);
      }

      // Update the state and cache with the new start index
      this.setState(
        () => ({ startIndex }),
        () => {
          this.props.searchPageCache.startIndex = startIndex;
        }
      );
    };
  };

  /**
   * Preload a page.
   *
   * Parameters
   * ----------
   * preload: (options: QueryOptions) => void
   *     Function for carrying out the preloading.
   * limit: string
   *     Maximum number of results to return.
   * startIndex: number
   *     Start index of the first result to return.
   */
  private preloadPage = (
    preload: (options: QueryOptions) => void,
    limit: number,
    startIndex: number
  ) => {
    const { databaseColumns, where } = this.state;
    const options: QueryOptions = {
      fetchPolicy: "cache-first",
      query: DATA_FILES_QUERY,
      variables: {
        columns: databaseColumns,
        limit,
        startIndex,
        where,
      },
    };
    preload(options);
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

    let calibrationCounter = 1;

    for (const result of results) {
      // The metadata is a list of name-value pairs. We need to convert this
      // into a plain object.
      const metadata = result.metadata.reduce(
        (o, item) => ({ ...o, [item.name]: item.value }),
        {} as any
      );

      // Add the id to the metadata as some code may look for it there.
      metadata[DataKeys.DATA_FILE_ID] = result.id;

      const telescopeName = metadata[DataKeys.TELESCOPE_NAME];
      const telescopeObservationId =
        metadata[DataKeys.TELESCOPE_OBSERVATION_ID];
      const observationName =
        telescopeName +
        (telescopeObservationId ? " #" + telescopeObservationId : "");
      metadata[DataKeys.OBSERVATION_NAME] = observationName;

      const observationId = metadata[DataKeys.OBSERVATION_ID]
        ? metadata[DataKeys.OBSERVATION_ID].toString()
        : `Calibration-${calibrationCounter++}`;
      const file = () => {
        const ownedByUser = result.ownedByUser;
        const isPublic = now > metadata[DataKeys.OBSERVATION_PUBLIC_FROM];
        return {
          ...metadata,
          available: ownedByUser || isPublic,
          cartContent: {
            id: metadata[DataKeys.DATA_FILE_ID].toString(),
            name: metadata[DataKeys.DATA_FILE_FILENAME],
            observation: {
              __typename: "CartObservation",
              id: observationId,
              name: observationName,
            },
            target: metadata[DataKeys.TARGET_NAME] || null,
          },
        };
      };

      if (!observationsMap.has(observationId)) {
        // Create a new observations object. A string of the form "TN - #id" is
        // used as observation name, where TN is the telescope name and id is
        // identifier used by the telescope for the observation. If there is
        // no such identifier for the observation, only the telescope name is
        // used.
        const observation: IObservation = {
          files: [file()],
          id: observationId,
          name: observationName,
        };

        // Store the observation in the map of of observations (to facilitate
        // looking it up) and in the array of observations (to keep track of the
        // correct order
        observations.push(observation);
        observationsMap.set(observationId, observation);
      } else {
        // Add the data file
        (observationsMap.get(observationId) as IObservation).files.push(file());
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

    // Add the user-selected table columns
    this.state.tableColumns
      .filter((column) => column.visible)
      .forEach((column) => columns.add(column.dataKey));

    // Add some columns which should be queried at any rate
    columns.add(DataKeys.DATA_CATEGORY);
    columns.add(DataKeys.DATA_FILE_FILENAME);
    columns.add(DataKeys.DATA_FILE_ID);
    columns.add(DataKeys.INSTRUMENT_NAME);
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
    const changedColumn = this.state.tableColumns.find(
      (column) => column.dataKey === dataKey
    );
    if (!changedColumn) {
      throw new Error(`Unknown data key for table column: ${dataKey}`);
    }
    this.setState(
      (prevState) => ({
        tableColumns: [
          ...prevState.tableColumns.filter(
            (column) => column.dataKey !== dataKey
          ),
          {
            ...changedColumn,
            visible,
          },
        ],
      }),
      () => {
        // Keep the cache up-to-date
        this.props.searchPageCache.tableColumns = this.state.tableColumns;
      }
    );
  };

  /**
   * Update the visibility status of a results table column.
   */
  private openColumnSelector = () => {
    this.setState({
      ...this.state,
      modal: { open: !this.state.modal.open },
    });
  };
}

export default SearchPage;
