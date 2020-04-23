import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import scrollbarSize from "dom-helpers/util/scrollbarSize";
import { List } from "immutable";
import { debounce } from "lodash";
import * as React from "react";
import { Mutation } from "react-apollo";
import Query from "react-apollo/Query";
import ReactTooltip from "react-tooltip";
import {
  AutoSizer,
  Grid,
  ScrollSync,
  SortDirection,
  SortDirectionType
} from "react-virtualized";
import styled from "styled-components";
import {
  ADD_TO_CART_MUTATION,
  Cart,
  CART_QUERY,
  REMOVE_FROM_CART_MUTATION
} from "../../../util/Cart";
import { IFile } from "../../../utils/ObservationQueryParameters";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";
import WarningButton from "../../basicComponents/WarningButton";
import { JS9ViewContext } from "../../JS9View";
import { IObservation } from "../SearchPage";
import DataKeys from "./DataKeys";
import ISearchResultsTableColumn from "./ISearchResultsTableColumn";
import SearchResultsTableHeader from "./SearchResultsTableHeader";

interface ISearchResultsTableProps {
  columns: ISearchResultsTableColumn[];
  maxHeight?: number;
  maxWidth: number;
  searchResults: IObservation[];
}

interface ISearchResultsTableState {
  dataFileId?: string;
  sortBy: string;
  sortDirection: SortDirectionType;
  sortedRowData: List<IRowDatum>;
  unsortedRowData: List<IRowDatum>;
}

/**
 * Meta information for data used for populating a table row.
 *
 * Properties
 * ----------
 * observation:
 *     The observation for the file to which the row refers.
 * observationFileIndex:
 *     The index in the observation's list of files for the file to which the
 *     row refers.
 * observationHeader:
 *     Whether the row is the header row for the observation.
 * observationIndex:
 *     The observation's index in the list of observations.
 */
interface IRowDatumMeta {
  available: boolean;
  observation: any;
  observationFileIndex: number;
  observationHeader: boolean;
  observationIndex: number;
}

/**
 * Data used for populating a table row.
 *
 * Properties:
 * -----------
 * meta:
 *     Meta information for the data.
 * [key]:
 *     Any other key-value pairs.
 */
interface IRowDatum {
  meta: IRowDatumMeta;
  [key: string]: any;
}

const GridRow = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const GridColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

interface ICartContainerProps {
  top: number;
}

const CartContainer = styled.div<ICartContainerProps>`
  flex: 0 0 25px;
  position: absolute;
  left: 0;
  top: ${props => props.top}px;
  z-index: 10;
`;

/**
 * Comparison function for table row data in the search results table.
 *
 * The rows are sorted in the following order
 *
 * 1. By the property indicated by the sortBy parameter.
 * 2. By the observation index.
 * 3. By the file index within an observation.
 *
 * The sort direction (ascending or descending) is indicated by the sortDirection
 * parameter.
 *
 * Observation headers are always ranked top within an observation.
 */
function cmp(
  a: IRowDatum,
  b: IRowDatum,
  sortBy: string,
  sortDirection: SortDirectionType
) {
  const sortDirectionFactor = sortDirection === SortDirection.DESC ? -1 : 1;
  if (a[sortBy] < b[sortBy]) {
    return -sortDirectionFactor;
  } else if (a[sortBy] > b[sortBy]) {
    return sortDirectionFactor;
  } else {
    if (a.meta.observationIndex < b.meta.observationIndex) {
      return -sortDirectionFactor;
    } else if (a.meta.observationIndex > b.meta.observationIndex) {
      return sortDirectionFactor;
    } else {
      if (a.meta.observationHeader) {
        return -1;
      } else if (b.meta.observationHeader) {
        return 1;
      } else {
        if (a.meta.observationFileIndex < b.meta.observationFileIndex) {
          return -sortDirectionFactor;
        } else if (a.meta.observationFileIndex > b.meta.observationFileIndex) {
          return sortDirectionFactor;
        }
      }
    }
  }

  return 0;
}

// Handle tooltip to rebuild when the component is rendered.
const rebuildTooltip = debounce(() => ReactTooltip.rebuild(), 200, {
  leading: false,
  trailing: true
});

/**
 * The table of search results.
 *
 * react-virtualized is used to ensure good performance. The customisation is
 * done via the properties of the Table and Column elements, which use the
 * following class methods.
 *
 * cartCellRendererFactory:
 *     Creates the renderer for rendering the first column, which provides the
 *     functionality to put files into the cart. This is a factory rather than a
 *     function as the cart mutation functions need to be passed.
 * cartHeaderRenderer:
 *     The renderer for the header of the first column.
 * cellContent:
 *     Returns the content of a table data cell.
 * cellRenderer:
 *     The renderer for a table data cell.
 * closePreviewModal:
 *     Closes the preview modal.
 * columnWidth:
 *     Returns the column width in pixels.
 * headerRenderer:
 *     Returns the column header.
 * openPreviewModal:
 *     Opens the preview modal.
 * rowClassName:
 *     Returns the class name(s) to be added to a table row div. This can be
 *     used to provide a row-specific background color.
 * sort:
 *     Sorts the row data. This includes updating the state with the new row
 *     data, search by value and search direction.
 * sortedRowData:
 *     Creates a new list with the sorted row data and returns that list.
 * tableHeight:
 *     Returns the table height.
 * tableWidth:
 *     Returns the table width in pixels.
 * unsort:
 *     Reverts the table to the original unsorted state.
 * unsortedRowData:
 *     Parses the given search results for use in the table.
 * updateCart:
 *     Updates the cart.
 * visibleColumns:
 *     Returns the visible columns.
 *
 * Properties:
 * -----------
 * columns:
 *    The columns to display. The values must be valid data keys.
 * maxHeight:
 *    The maximum table height in pixels. The default is 700.
 * maxWidth:
 *    The maximum table width in pixels.
 * searchResults:
 *    The search results to display.
 */
class SearchResultsTable extends React.Component<
  ISearchResultsTableProps,
  ISearchResultsTableState
> {
  /**
   * Return the visible columns.
   */
  private get visibleColumns() {
    return this.props.columns.filter(column => column.visible);
  }
  /**
   * The height of the table header in pixels.
   */
  public static HEADER_HEIGHT = 40;

  /**
   * The height of a table row in pixels.
   */
  public static ROW_HEIGHT = 30;

  /**
   * The width of the cart column in pixels.
   */
  public static CART_COLUMN_WIDTH = 25;

  static getDerivedStateFromProps(
    props: ISearchResultsTableProps,
    state: ISearchResultsTableState
  ) {
    const unsortedRowData = SearchResultsTable.unsortedRowData(
      props.searchResults
    );
    const sortedRowData = SearchResultsTable.sortedRowData(
      unsortedRowData,
      state.sortBy,
      state.sortDirection
    );

    return {
      sortedRowData,
      unsortedRowData
    };
  }

  /**
   * Create sorted row data from given unsorted row data.
   *
   * If the data is sorted, observation headers are included; otherwise they are
   * ignored.
   */
  private static sortedRowData = (
    unsortedRowData: List<IRowDatum>,
    sortBy: string,
    sortDirection: SortDirectionType
  ) => {
    if (sortBy) {
      const comparator = (a: IRowDatum, b: IRowDatum) =>
        cmp(a, b, sortBy, sortDirection);
      const retainObservationHeaders = sortBy === DataKeys.OBSERVATION_NAME;
      return unsortedRowData
        .filter(
          item => retainObservationHeaders || !item.meta.observationHeader
        )
        .sort(comparator);
    } else {
      return List(unsortedRowData);
    }
  };

  /**
   * Generate the row data for the table.
   */
  private static unsortedRowData = (searchResults: IObservation[]) => {
    const data: IRowDatum[] = [];
    searchResults.forEach((result, observationIndex) => {
      const observation = result;
      data.push({
        meta: {
          available: observation.available,
          observation,
          observationFileIndex: -1,
          observationHeader: true,
          observationIndex
        },
        [DataKeys.OBSERVATION_NAME]: observation.name || ""
      });
      result.files.forEach((file, observationFileIndex) => {
        data.push({
          meta: {
            available: observation.available,
            observation,
            observationFileIndex,
            observationHeader: false,
            observationIndex
          },
          [DataKeys.OBSERVATION_NAME]: observation.name || "",
          ...file
        });
      });
    });

    return List(data);
  };

  constructor(props: ISearchResultsTableProps) {
    super(props);

    // Set the initial state.
    // The sorted and unsorted row data will be populated by the
    // getDerivedStateFromProps lifecycle method.
    this.state = {
      sortBy: "",
      sortDirection: SortDirection.ASC,
      sortedRowData: List(),
      unsortedRowData: List()
    };
  }

  componentDidMount() {
    // Rebuild the tooltip when it is re-rendered.
    rebuildTooltip();
  }

  /**
   * Render the search results table.
   *
   * The table consists of four grids:
   *
   * Grid 1: A single cell placed at the top left. This serves as the header for
   *         the column providing the cart functionality. It cannot scroll.
   * Grid 2: A grid consisting of a single column placed at the left.
   * Grid 3: A single row of cells, which can scroll horizontally. It serves as
   *         the header row for all columns other than the first one.
   * Grid 4: A grid covering the whole table. It contains the table data.
   *
   * Both Grid 2 and 4 have a "dummy" column as first column, which (if not
   * scrolled) is underneath Grid 1 and/or Grid 3 and hence is not visible.
   * However, for this to work properly all cells of Grid 1 and Grid 3 must have
   * a background with full opacity.
   */
  public render() {
    // Calculate the table height
    const height = this.tableHeight();

    return (
      <Query query={CART_QUERY}>
        {({ data }: any) => {
          const cart = new Cart(
            data.cart.files || [],
            data.cart.includeStandards,
            data.cart.includeArcsFlatsBiases,
            data.cart.includedCalibrationLevels
          );
          return (
            <>
              <Mutation
                mutation={ADD_TO_CART_MUTATION}
                refetchQueries={[{ query: CART_QUERY }]}
              >
                {(addToCart: any) => (
                  <Mutation
                    mutation={REMOVE_FROM_CART_MUTATION}
                    refetchQueries={[{ query: CART_QUERY }]}
                  >
                    {(removeFromCart: any) => (
                      <>
                        <div
                          className="search-results table"
                          style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: this.tableWidth()
                          }}
                        >
                          <ScrollSync>
                            {({ onScroll, scrollLeft, scrollTop }) => {
                              return (
                                <GridRow
                                  data-test="search-results-table"
                                  onScroll={rebuildTooltip}
                                >
                                  <CartContainer top={0}>
                                    <Grid
                                      cellRenderer={this.cartHeaderRenderer}
                                      className="HeaderGrid"
                                      columnCount={1}
                                      columnWidth={
                                        SearchResultsTable.CART_COLUMN_WIDTH
                                      }
                                      height={SearchResultsTable.HEADER_HEIGHT}
                                      rowCount={1}
                                      rowHeight={
                                        SearchResultsTable.HEADER_HEIGHT
                                      }
                                      width={
                                        SearchResultsTable.CART_COLUMN_WIDTH
                                      }
                                    />
                                  </CartContainer>
                                  <CartContainer
                                    top={SearchResultsTable.HEADER_HEIGHT}
                                  >
                                    <Grid
                                      cellRenderer={this.cartCellRendererFactory(
                                        {
                                          addToCart,
                                          cart,
                                          removeFromCart
                                        }
                                      )}
                                      columnWidth={
                                        SearchResultsTable.CART_COLUMN_WIDTH
                                      }
                                      columnCount={1}
                                      style={{ overflow: "hidden" }}
                                      height={height - scrollbarSize()}
                                      rowHeight={SearchResultsTable.ROW_HEIGHT}
                                      rowCount={this.state.sortedRowData.size}
                                      scrollTop={scrollTop}
                                      width={
                                        SearchResultsTable.CART_COLUMN_WIDTH
                                      }
                                    />
                                  </CartContainer>
                                  <GridColumn>
                                    <AutoSizer
                                      disableHeight={true}
                                      onResize={rebuildTooltip}
                                    >
                                      {({ width }) => (
                                        <div>
                                          <div
                                            style={{
                                              height:
                                                SearchResultsTable.HEADER_HEIGHT,
                                              width: width - scrollbarSize()
                                            }}
                                          >
                                            <Grid
                                              style={{
                                                overflow: "hidden",
                                                width: "100%"
                                              }}
                                              columnWidth={this.columnWidth}
                                              columnCount={
                                                this.visibleColumns.length
                                              }
                                              height={height}
                                              cellRenderer={this.headerRenderer}
                                              rowHeight={
                                                SearchResultsTable.HEADER_HEIGHT
                                              }
                                              rowCount={1}
                                              scrollLeft={scrollLeft}
                                              width={width - scrollbarSize()}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              height: height - scrollbarSize(),
                                              width
                                            }}
                                          >
                                            <Grid
                                              style={{ width: "100%" }}
                                              columnWidth={this.columnWidth}
                                              columnCount={
                                                this.visibleColumns.length
                                              }
                                              height={height}
                                              onScroll={onScroll}
                                              cellRenderer={this.cellRenderer(
                                                cart
                                              )}
                                              rowHeight={
                                                SearchResultsTable.ROW_HEIGHT
                                              }
                                              rowCount={
                                                this.state.sortedRowData.size
                                              }
                                              width={width}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </AutoSizer>
                                  </GridColumn>
                                  <ReactTooltip />
                                </GridRow>
                              );
                            }}
                          </ScrollSync>
                        </div>
                      </>
                    )}
                  </Mutation>
                )}
              </Mutation>
            </>
          );
        }}
      </Query>
    );
  }

  /**
   * A factory for the renderer rendering the cells of the first column, which
   * lets the user put files into the cart (or remove them from the cart).
   */
  private cartCellRendererFactory = ({
    addToCart,
    removeFromCart,
    cart
  }: any) => {
    return ({
      key,
      rowIndex,
      style
    }: {
      key: string;
      rowIndex: number;
      style: object;
    }) => {
      const rowDatum = this.state.sortedRowData.get(rowIndex);
      if (!rowDatum) {
        // Should never happen, but let's keep Typescript happy
        return "not defined";
      }
      if (!rowDatum.meta.observationHeader) {
        // A normal table row
        const file =
          rowDatum.meta.observation.files[
            rowDatum.meta.observationFileIndex as number
          ];
        // Checkbox for adding the file to the cart (or for removing it)
        return (
          <div className={this.rowClassName(rowIndex)} key={key} style={style}>
            <span>
              {rowDatum.meta.available && (
                <LargeCheckbox
                  data-test="observation-header-input"
                  checked={cart.contains(file.cartContent)}
                  onChange={e =>
                    this.updateCart(e, [file], addToCart, removeFromCart)
                  }
                />
              )}
            </span>
          </div>
        );
      } else {
        // An observation header row.
        const files = rowDatum.meta.observation.files;
        const allInCart = files.every((file: IFile) =>
          cart.contains(file.cartContent)
        );
        // Checkbox for adding all the files of the observation to the cart
        // (or for removing them)
        return (
          <div
            className="search-results cell observation-header"
            key={key}
            style={style}
          >
            <span>
              {rowDatum.meta.observation.available && (
                <LargeCheckbox
                  checked={allInCart}
                  onChange={e =>
                    this.updateCart(e, files, addToCart, removeFromCart)
                  }
                />
              )}
            </span>
          </div>
        );
      }
    };
  };

  /**
   * The renderer for the first column's header cell.
   */
  private cartHeaderRenderer = ({
    key,
    style
  }: {
    key: string;
    style: object;
  }) => {
    return (
      <div className="search-results header cell cart" key={key} style={style}>
        <span>
          <FontAwesomeIcon icon={faShoppingCart} />
        </span>
      </div>
    );
  };

  /**
   * The content for a table data cell. The column index does not include the
   * first column, i.e. technically columnIndex = 1 refers to the second column.
   * Similarly, the row index does not include the header.
   */
  private cellContent = ({ cart, columnIndex, rowIndex }: any) => {
    const rowDatum = this.state.sortedRowData.get(rowIndex);
    const dataKey = this.visibleColumns[columnIndex].dataKey;
    if (!rowDatum) {
      // Should never happen, but let's keep Typescript happy
      return "not defined";
    }
    if (!rowDatum.meta.observationHeader) {
      // A normal table row
      if (dataKey === DataKeys.INFO) {
        if (rowDatum[DataKeys.OBSERVATION_STATUS] === "Rejected") {
          return (
            <WarningButton
              toolTipMessage={
                "This observation is marked as deleted, its data could be incorrect."
              }
            />
          );
        }

        if (rowDatum[DataKeys.PROPOSAL_TYPE] === "Science Verification") {
          return (
            <WarningButton
              toolTipMessage={
                "This observation belongs to a proposal which is for science verication. Its data could be incorrect."
              }
            />
          );
        }

        if (rowDatum[DataKeys.PROPOSAL_TYPE] === "Commissioning") {
          return (
            <WarningButton
              toolTipMessage={
                "This observation belongs to a proposal which is commissioned. Its data could be incorrect."
              }
            />
          );
        }
      }

      if (dataKey === DataKeys.DATA_FILE_FILENAME) {
        if (rowDatum[DataKeys.DATA_FILE_ID]) {
          return rowDatum.meta.available ? (
            <JS9ViewContext.Consumer>
              {({ load, open }) => (
                <button
                  className="is-link"
                  onClick={() => {
                    const dataFileId = rowDatum[DataKeys.DATA_FILE_ID]
                      ? rowDatum[DataKeys.DATA_FILE_ID].toString()
                      : rowDatum[DataKeys.DATA_FILE_ID];
                    load(
                      `${
                        process.env.REACT_APP_BACKEND_URI
                          ? process.env.REACT_APP_BACKEND_URI.replace(
                              /\/+$/,
                              ""
                            )
                          : ""
                      }/data/${dataFileId}/${
                        rowDatum[DataKeys.DATA_FILE_FILENAME]
                      }`
                    );
                    open();
                  }}
                >
                  {rowDatum[DataKeys.DATA_FILE_FILENAME]}
                </button>
              )}
            </JS9ViewContext.Consumer>
          ) : null;
        } else {
          return rowDatum[DataKeys.DATA_FILE_FILENAME];
        }
      } else {
        const format = this.visibleColumns[columnIndex].format;
        if (
          format &&
          rowDatum[dataKey] !== undefined &&
          rowDatum[dataKey] !== null
        ) {
          return format(rowDatum[dataKey].toString());
        } else {
          return rowDatum[dataKey];
        }
      }
    } else {
      // An observation header row.
      const files = rowDatum.meta.observation.files;
      const allInCart = files.every((file: IFile) =>
        cart.contains(file.cartContent)
      );
      if (columnIndex === 1) {
        if (rowDatum.meta.observation.available) {
          return <i>{allInCart ? "Unselect all" : "Select all"}</i>;
        } else {
          return <i>Proprietary</i>;
        }
      } else {
        return "";
      }
    }
  };

  /**
   * The renderer for a table data cell. A column index of 0 refers to the
   * dummy column, and hence an empty string is returned for it.
   */
  private cellRenderer = (cart: Cart) => {
    return ({
      columnIndex,
      key,
      rowIndex,
      style
    }: {
      columnIndex: number;
      key: string;
      rowIndex: number;
      style: object;
    }) => {
      /**
       * The first column has the same width as the cart column and lies
       * underneath. It should therefore be considered a dummy column, and no
       * content should be returned for it. Also see the documentation for the
       * render method.
       */
      if (columnIndex < 1) {
        return "";
      }

      return (
        <div className={this.rowClassName(rowIndex)} key={key} style={style}>
          <span>{this.cellContent({ cart, columnIndex, rowIndex })}</span>
        </div>
      );
    };
  };

  /**
   * The width of a column (in pixels). A column index of 0 refers to the first
   * column.
   */
  private columnWidth = ({ index }: { index: number }) => {
    if (index < 1) {
      return SearchResultsTable.CART_COLUMN_WIDTH;
    }

    return this.visibleColumns[index].width || 200;
  };

  /**
   * The renderer for the header row cells other than the cart one.
   */
  private headerRenderer = ({
    columnIndex,
    key,
    style
  }: {
    columnIndex: number;
    key: string;
    style: object;
  }) => {
    /**
     * The first column has the same width as the cart column and lies
     * underneath. It should therefore be considered a dummy column, and no
     * content should be returned for it. Also see the documentation for the
     * render method.
     */
    if (columnIndex < 1) {
      return "";
    }

    const dataKey = this.visibleColumns[columnIndex].dataKey;
    const label = this.visibleColumns[columnIndex].name;

    return (
      <SearchResultsTableHeader
        dataKey={dataKey}
        key={key}
        sort={this.sort}
        sortBy={this.state.sortBy}
        style={style}
      >
        {label}
      </SearchResultsTableHeader>
    );
  };

  /**
   * The class name to add to the table row. This is used for styling the rows
   * (using CSS rules defined in App.css).
   *
   * The chosen class names take into account whether the cell is part of an
   * observation header.
   */
  private rowClassName = (rowIndex: number) => {
    const rowDatum = this.state.sortedRowData.get(rowIndex);
    if (!rowDatum) {
      // Should never happen, but let's keep Typescript happy
      return "";
    }
    if (rowDatum.meta.observationHeader) {
      return `search-results observation-header cell`;
    } else {
      const fileIndex = rowDatum.meta.observationFileIndex;
      const indexToUse = !this.state.sortBy ? fileIndex : rowIndex;
      return (indexToUse || 0) % 2
        ? `search-results file-row-even cell`
        : `search-results file-row-odd cell`;
    }
  };

  /**
   * Sort the row data.
   */
  private sort = ({
    sortBy,
    sortDirection
  }: {
    sortBy: string;
    sortDirection: SortDirectionType;
  }) => {
    const sortedRowData = SearchResultsTable.sortedRowData(
      this.state.unsortedRowData,
      sortBy,
      sortDirection
    );

    this.setState({ sortBy, sortDirection, sortedRowData });
  };

  /**
   * Return the table height.
   */
  private tableHeight = () => {
    const overallHeight =
      SearchResultsTable.HEADER_HEIGHT +
      this.state.unsortedRowData.size * SearchResultsTable.ROW_HEIGHT +
      scrollbarSize();

    return Math.min(overallHeight, this.props.maxHeight || 700);
  };

  /**
   * Return the table width.
   */
  private tableWidth = () => {
    // There is no need to add the width of the shopping cart column as the first visible
    // column is a dummy column of the same width, and it is located underneath that column.
    const overallWidth =
      this.visibleColumns.reduce(
        (total: number, column, index) => total + this.columnWidth({ index }),
        0
      ) + scrollbarSize();

    return Math.min(overallWidth, this.props.maxWidth);
  };

  /**
   * Revert the table to the original unsorted state.
   */
  private unsort = () => {
    const sortBy = "";
    const sortDirection = SortDirection.ASC;
    const sortedRowData = SearchResultsTable.sortedRowData(
      this.state.unsortedRowData,
      sortBy,
      sortDirection
    );

    this.setState({ sortBy, sortDirection, sortedRowData });
  };

  /**
   * Update the cart.
   */
  private updateCart = async (
    event: React.ChangeEvent<HTMLInputElement>,
    files: IFile[],
    addToCart: any,
    removeFromCart: any
  ) => {
    // Get the list of files to add or remove
    const updatedFiles = files.map(file => ({
      __typename: "CartFile",
      ...file.cartContent
    }));

    // Add or remove from the cart, depending on the checkbox state
    if (event.target.checked) {
      await addToCart({ variables: { files: updatedFiles } });
    } else {
      await removeFromCart({ variables: { files: updatedFiles } });
    }
  };
}

export default SearchResultsTable;
