import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List } from "immutable";
import * as React from "react";
import { Mutation } from "react-apollo";
import {
  Column,
  SortDirection,
  SortDirectionType,
  SortIndicator,
  Table
} from "react-virtualized";
import styled from "styled-components";
import cache from "../../../util/cache";
import {
  ADD_TO_CART_MUTATION,
  Cart,
  CART_QUERY,
  REMOVE_FROM_CART_MUTATION
} from "../../../util/Cart";
import { IFile, IObservation } from "../../../utils/ObservationQueryParameters";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";
import DataKeys from "./DataKeys";
import ImageModal from "./ImageModal";

interface ISearchResultsTableProps {
  columns: string[];
  maxHeight?: number;
  searchResults: IObservation[];
}

interface ISearchResultsTableState {
  cart: Cart;
  image: string;
  open: boolean;
  sortBy?: string;
  sortDirection?: SortDirectionType;
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

/**
 * Comparison function for table row data in the search results table.
 *
 * The rows are sorted in the following order
 *
 * 1. By the property indicated by the sortBy parameter.
 * 2. By the observation index.
 * 3. By the file index within an observation.
 *
 * The sort direction (scending or descending) is indicated by the sortDirection
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

/**
 * The table of search results.
 *
 * react-virtualized is used to ensure good performance. The customisation is
 * done via the properties of the Table and Column elements, which use the
 * following class methods.
 *
 * cellRendererFactory:
 *     Creates the cell renderer. This is a factory rather than a function as
 *     cart mutation functions need to be passed.
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
 *     Returns the table height. The height should only be computed once (in
 *     the constructor).
 * tableWidth:
 *     Returns the table width in pixels.
 * unsort:
 *     Reverts the table to the original unsorted state.
 * _unsortedRowData:
 *     Parses the given search results for use in the table.
 * _updateCart:
 *     Updates the cart.
 *
 * Properties:
 * -----------
 * columns:
 *    The columns to display. The values must be valid data keys.
 * maxHeight:
 *    The maximum table height in pixels. The default is 700.
 * searchResults:
 *    The search results to display.
 */
class SearchResultsTable extends React.Component<
  ISearchResultsTableProps,
  ISearchResultsTableState
> {
  /**
   * The height of the table header in pixels.
   */
  private static HEADER_HEIGHT = 30;

  /**
   * The height of a table row in pixels.
   */
  private static ROW_HEIGHT = 50;

  /**
   * Return the table height.
   */
  private static tableHeight = (
    unsortedRowData: List<IRowDatum>,
    maxHeight: number
  ) => {
    const overallHeight =
      SearchResultsTable.HEADER_HEIGHT +
      unsortedRowData.size * SearchResultsTable.ROW_HEIGHT;

    return Math.min(overallHeight, maxHeight);
  };

  /**
   * The height of the table header in pixels
   */
  private height: number;

  constructor(props: ISearchResultsTableProps) {
    super(props);

    // Get current cart content
    const cartContent: any = cache.readQuery({ query: CART_QUERY }) || {
      cart: []
    };
    const cart = new Cart(cartContent.cart);

    const unsortedRowData = this.unsortedRowData();
    const sortedRowData = this.sortedRowData(
      unsortedRowData,
      "",
      SortDirection.ASC
    );

    // Set the initial state
    this.state = {
      cart,
      image: "",
      open: false,
      sortBy: "",
      sortDirection: SortDirection.ASC,
      sortedRowData,
      unsortedRowData
    };

    // Calculate the table height
    this.height = SearchResultsTable.tableHeight(
      unsortedRowData,
      props.maxHeight || 700
    );
  }

  public render() {
    const { columns } = this.props;
    const { image, open, sortBy, sortDirection, sortedRowData } = this.state;

    return (
      <>
        {/* TODO see ImageModal for todo */}
        <ImageModal
          closeModal={this.closePreviewModal}
          image={{ url: image, alt: "Some text to show" }}
          open={open}
        />
        <Mutation
          mutation={ADD_TO_CART_MUTATION}
          refetchQueries={[{ query: CART_QUERY }]}
        >
          {addToCart => (
            <Mutation
              mutation={REMOVE_FROM_CART_MUTATION}
              refetchQueries={[{ query: CART_QUERY }]}
            >
              {removeFromCart => (
                <>
                  <Table
                    className="search results table"
                    data-test="search-results-table"
                    width={this.tableWidth()}
                    height={this.height || 700}
                    headerHeight={SearchResultsTable.HEADER_HEIGHT}
                    rowHeight={SearchResultsTable.ROW_HEIGHT}
                    rowCount={sortedRowData.size}
                    rowGetter={({ index }) => sortedRowData.get(index)}
                    rowClassName={this.rowClassName}
                    sort={this.sort}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                  >
                    {columns.map(column => (
                      <Column
                        key={column}
                        label={column}
                        dataKey={column}
                        cellRenderer={this.cellRendererFactory(
                          addToCart,
                          removeFromCart
                        )}
                        headerRenderer={this.headerRenderer}
                        width={this.columnWidth(column)}
                      />
                    ))}
                  </Table>
                  <button className="button is-normal" onClick={this.unsort}>
                    Don't sort
                  </button>
                </>
              )}
            </Mutation>
          )}
        </Mutation>
      </>
    );
  }

  /**
   * Create a cell renderer which uses the given mutations for updating the
   * cart.
   */
  private cellRendererFactory = (addToCart: any, removeFromCart: any) => {
    return ({ dataKey, rowIndex }: { dataKey: string; rowIndex: number }) => {
      const rowDatum = this.state.sortedRowData.get(rowIndex);
      if (!rowDatum) {
        return "not defined";
      } // Should never happen, but let's keep Typescript happy
      if (!rowDatum.meta.observationHeader) {
        // A normal table row
        const file =
          rowDatum.meta.observation.files[
            rowDatum.meta.observationFileIndex as number
          ];
        switch (dataKey) {
          case DataKeys.CART:
            // Checkbox for adding the file to the cart (or for removing it)
            return (
              <LargeCheckbox
                data-test="observation-header-input"
                checked={this.state.cart.contains(file)}
                onChange={e =>
                  this.updateCart(e, [file], addToCart, removeFromCart)
                }
              />
            );
          case DataKeys.DECLINATION:
            return rowDatum[dataKey].toFixed(4);
          case DataKeys.FILENAME:
            return rowDatum[DataKeys.PREVIEW_IMAGE_URL] ? (
              <a
                onClick={() => {
                  this.openPreviewModal(rowDatum[DataKeys.PREVIEW_IMAGE_URL]);
                }}
              >
                {rowDatum[DataKeys.FILENAME]}
              </a>
            ) : (
              rowDatum[DataKeys.FILENAME]
            );
          case DataKeys.RIGHT_ASCENSION:
            return rowDatum[dataKey].toFixed(4);
          default:
            return rowDatum[dataKey];
        }
      } else {
        // Am observation header row.
        const files = rowDatum.meta.observation.files;
        const allInCart = files.every((file: IFile) =>
          this.state.cart.contains(file)
        );
        switch (dataKey) {
          case DataKeys.CART:
            // Checkbox for adding all the files of the observation to the cart
            // (or for removing them)
            return (
              <LargeCheckbox
                checked={allInCart}
                onChange={e =>
                  this.updateCart(e, files, addToCart, removeFromCart)
                }
              />
            );
          case DataKeys.OBSERVATION_NAME:
            return <i>{allInCart ? "Unselect all" : "Select all"}</i>;
          default:
            return "";
        }
      }
    };
  };

  /**
   * Close the preview modal.
   */
  private closePreviewModal = () => {
    this.setState({ open: false, image: "" });
  };

  /**
   * The width of a column (in pixels).
   */
  private columnWidth = (column: string) =>
    column === DataKeys.CART ? 20 : 200;

  /**
   * The renderer for the header row.
   *
   * If the data is sorted by this column, a sort indicator for the sort
   * direction (ascending or descending) is included.
   */
  private headerRenderer = ({
    dataKey,
    sortBy,
    sortDirection
  }: {
    dataKey: string;
    sortBy?: string;
    sortDirection?: SortDirectionType | undefined;
  }) => {
    let label;
    switch (dataKey) {
      case DataKeys.CART:
        label = <FontAwesomeIcon icon={faShoppingCart} />;
        break;
      case DataKeys.DECLINATION:
        label = "Dec";
        break;
      case DataKeys.OBSERVATION_NAME:
        label = "Observation";
        break;
      case DataKeys.PROPOSAL_CODE:
        label = "Proposal Code";
        break;
      case DataKeys.RIGHT_ASCENSION:
        label = "RA";
        break;
      default:
        label = dataKey;
    }

    const showSortIndicator = sortBy === dataKey;

    return (
      <>
        {label}
        {showSortIndicator && (
          <SortIndicator key="SortIndicator" sortDirection={sortDirection} />
        )}
      </>
    );
  };

  /**
   * Open the preview modal.
   */
  private openPreviewModal = (url: string) => {
    this.setState({ open: true, image: url });
  };

  /**
   * The class name to add to the table row. This is used for styling the rows
   * (using CSS rules defined in App.css).
   *
   * The chosen class names take into account whether there are observation
   * headers.
   */
  private rowClassName = ({ index }: { index: number }) => {
    if (index === -1) {
      return "";
    }
    const rowDatum = this.state.sortedRowData.get(index);
    if (!rowDatum) {
      return "";
    } // Should never happen, but let's keep Typescript happy
    if (rowDatum.meta.observationHeader) {
      return "search-results observation-header";
    } else {
      const fileIndex = rowDatum.meta.observationFileIndex;
      const indexToUse = !this.state.sortBy ? fileIndex : index;
      return (indexToUse || 0) % 2
        ? "search-results file-row-even"
        : "search-results file-row-file-odd";
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
    const sortedRowData = this.sortedRowData(
      this.state.unsortedRowData,
      sortBy,
      sortDirection
    );

    this.setState({ sortBy, sortDirection, sortedRowData });
  };

  /**
   * Create sorted row data from given unsorted row data.
   *
   * If the data is sorted, observation headers are included; otherwise they are
   * ignored.
   */
  private sortedRowData = (
    unsortedRowData: List<IRowDatum>,
    sortBy: string,
    sortDirection: SortDirectionType
  ) => {
    console.log(sortBy, sortDirection);
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
   * The width (in pixels) the table should have. This is the sum of all the
   * column widths.
   */
  private tableWidth = () =>
    this.props.columns.reduce(
      (total: number, column) => total + this.columnWidth(column),
      0
    );

  /**
   * Revert the table to the original unsorted state.
   */
  private unsort = () => {
    const sortBy = "";
    const sortDirection = SortDirection.ASC;
    const sortedRowData = this.sortedRowData(
      this.state.unsortedRowData,
      sortBy,
      sortDirection
    );

    this.setState({ sortBy, sortDirection, sortedRowData });
  };

  /**
   * Generate the row data for the table.
   */
  private unsortedRowData = () => {
    const data: IRowDatum[] = [];
    this.props.searchResults.forEach((result, observationIndex) => {
      const observation = result;
      data.push({
        meta: {
          observation,
          observationFileIndex: -1,
          observationHeader: true,
          observationIndex
        },
        [DataKeys.OBSERVATION_NAME]: observation.name || "",
        [DataKeys.PROPOSAL_CODE]: observation.proposal || ""
      });
      result.files.forEach((file, observationFileIndex) => {
        data.push({
          meta: {
            observation,
            observationFileIndex,
            observationHeader: false,
            observationIndex
          },
          [DataKeys.OBSERVATION_NAME]: observation.name || "",
          [DataKeys.PROPOSAL_CODE]: observation.proposal || "",
          ...file
        });
      });
    });

    return List(data);
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
      id: file.id,
      name: file.name,
      observation: {
        __typename: "CartObservation",
        id: file.observationId,
        name: "Obs " + file.observationId
      }
    }));

    // Add or remove from the cart, depending on the checkbox state
    if (event.target.checked) {
      await addToCart({ variables: { files: updatedFiles } });
    } else {
      await removeFromCart({ variables: { files: updatedFiles } });
    }

    // Get current cart content
    const cartContent: any = cache.readQuery({ query: CART_QUERY }) || {
      cart: []
    };
    const cart = new Cart(cartContent.cart);

    // Update the cart in the state
    this.setState(() => ({ cart }));
  };
}

export default SearchResultsTable;
