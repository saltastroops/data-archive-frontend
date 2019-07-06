import * as React from "react";
import {
  IGeneral,
  ITarget,
  ITelescope
} from "../../utils/ObservationQueryParameters";
import { fakeSearchResults } from "../fakeSearchResults";
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
  results: any[];
  resultsTableColumns: ISearchResultsTableColumn[];
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
      { dataKey: DataKeys.TARGET_NAME, name: "Target", visible: true },
      { dataKey: DataKeys.RIGHT_ASCENSION, name: "RA", visible: true },
      { dataKey: DataKeys.DECLINATION, name: "Dec", visible: true },
      { dataKey: DataKeys.TELESCOPE, name: "Telescope", visible: true },
      { dataKey: DataKeys.INSTRUMENT, name: "Instrument", visible: true },
      { dataKey: DataKeys.FILENAME, name: "File", visible: true }
    ];

    this.state = {
      results: [],
      resultsTableColumns: columns
    };
  }

  render() {
    const { cache, screenDimensions } = this.props;
    const { resultsTableColumns, results } = this.state;

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
        <SearchForm cache={cache} search={this.searchArchive} />
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
    telescope: ITelescope | undefined;
  }) => {
    // TODO query the server
    this.setState(() => ({
      results: fakeSearchResults(10000)
    }));
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
