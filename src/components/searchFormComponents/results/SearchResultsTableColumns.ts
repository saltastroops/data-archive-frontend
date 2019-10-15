import moment from "moment";
import DataKeys from "./DataKeys";
import ISearchResultsTableColumn from "./ISearchResultsTableColumn";

/**
 * Get the search results table columns for an array of database column names.
 *
 * The returned array includes a dummy column (required for displaying purposes)
 * and any other columns which should always be included in the search results
 * table.
 *
 * Parameters:
 * -----------
 * dbColumns: string[]
 *     Database columns.
 *
 * Returns:
 * --------
 * The array of columns for the search results table.
 */
export function searchResultsTableColumns(
  dbColumns: string[]
): ISearchResultsTableColumn[] {
  const ignoredDataKeys = [
    DataKeys.DATA_FILE_ID,
    DataKeys.TARGET_TYPE_NUMERIC_CODE,
    DataKeys.TELESCOPE_OBSERVATION_ID,
    DataKeys.OBSERVATION_ID
  ];

  // The SearchResultsTable class sets the first column's width to the cart
  // column's width and puts the former underneath the latter. So
  // effectively the first column is ignored, and a dummy column needs to be
  // added to compensate for that.
  const columns = [
    { dataKey: "dummyName", name: "dummy", visible: true },
    {
      dataKey: DataKeys.OBSERVATION_NAME,
      name: "Observation",
      visible: true
    },
    ...sort(dbColumns.map(tableColumn))
  ];

  return columns.filter(column => !ignoredDataKeys.includes(column.dataKey));
}

/**
 * Return the search results table column for a data key.
 *
 * Parameters:
 * -----------
 * dataKey: string
 *     Data key.
 *
 * Returns:
 * --------
 * Search results table column.
 */
function tableColumn(dataKey: string): ISearchResultsTableColumn {
  switch (dataKey) {
    case DataKeys.DATA_CATEGORY:
      return { dataKey, name: "Data Category", visible: true };
    case DataKeys.DATA_FILE_FILENAME:
      return { dataKey, name: "File", visible: true };
    case DataKeys.DETECTOR_MODE:
      return { dataKey, name: "Detector Mode", visible: true };
    case DataKeys.FILTER:
      return { dataKey, name: "Filter", visible: true };
    case DataKeys.HRS_MODE:
      return { dataKey, name: "HRS Mode", visible: true };
    case DataKeys.INSTRUMENT_MODE:
      return { dataKey, name: "RSS Mode", visible: true };
    case DataKeys.INSTRUMENT_NAME:
      return { dataKey, name: "Instrument", visible: true };
    case DataKeys.OBSERVATION_NAME:
      return { dataKey, name: "Observation", visible: true };
    case DataKeys.OBSERVATION_NIGHT:
      return { dataKey, name: "Night", visible: true, format: formatTimestamp };
    case DataKeys.OBSERVATION_PUBLIC_FROM:
      return {
        dataKey,
        format: formatTimestamp,
        name: "Release Date",
        visible: true
      };
    case DataKeys.POLARIZATION_MODE:
      return { dataKey, name: "Polarimetry Pattern", visible: true };
    case DataKeys.PROPOSAL_CODE:
      return { dataKey, name: "Proposal", visible: true };
    case DataKeys.PROPOSAL_PI:
      return { dataKey, name: "PI", visible: true };
    case DataKeys.PROPOSAL_TITLE:
      return { dataKey, name: "Proposal Title", visible: true };
    case DataKeys.RSS_FABRY_PEROT_MODE:
      return { dataKey, name: "RSS FP Mode", visible: true };
    case DataKeys.RSS_GRATING:
      return { dataKey, name: "RSS Grating", visible: true };
    case DataKeys.TARGET_DECLINATION:
      return {
        dataKey,
        format: formatNumber(4),
        name: "Declination",
        visible: true
      };
    case DataKeys.TARGET_NAME:
      return { dataKey, name: "Target", visible: true };
    case DataKeys.TARGET_RIGHT_ASCENSION:
      return {
        dataKey,
        format: formatNumber(4),
        name: "Right Ascension",
        visible: true
      };
    case DataKeys.TARGET_TYPE_EXPLANATION:
      return { dataKey, name: "TargetType", visible: true };
    case DataKeys.TELESCOPE_NAME:
      return { dataKey, name: "Telescope", visible: true, width: 100 };
    default:
      return { dataKey, name: dataKey, visible: true };
  }
}

/**
 * Return a sorted copy of an array of columns.
 *
 * The original array is unaffected.
 *
 * Parameters:
 * -----------
 * columns: ISearchResultsTableColumn[]
 *     Columns.
 *
 * Returns:
 * --------
 * A sorted copy of the given array of columns.
 */
function sort(columns: ISearchResultsTableColumn[]) {
  const orderedDataKeys = [
    DataKeys.OBSERVATION_NAME,
    DataKeys.DATA_FILE_FILENAME,
    DataKeys.DATA_CATEGORY,
    DataKeys.OBSERVATION_NIGHT,
    DataKeys.TARGET_NAME,
    DataKeys.TARGET_RIGHT_ASCENSION,
    DataKeys.TARGET_DECLINATION,
    DataKeys.TARGET_TYPE_EXPLANATION,
    DataKeys.PROPOSAL_CODE,
    DataKeys.PROPOSAL_PI,
    DataKeys.PROPOSAL_TITLE,
    DataKeys.TELESCOPE_NAME,
    DataKeys.INSTRUMENT_NAME
  ];

  // Compare two columns. The following rules are used:
  //
  // * If the data keys of both columns are in orderedDataKeys, their order in
  //   this array is used.
  // * If only one column's data key is in orderedDataKeys, that column comes
  //   first.
  // * If none of the data keys is in orderedDataKeys, the column names are used
  //   for sorting
  const cmp = (
    column1: ISearchResultsTableColumn,
    column2: ISearchResultsTableColumn
  ) => {
    const index1 = orderedDataKeys.findIndex(key => column1.dataKey === key);
    const index2 = orderedDataKeys.findIndex(key => column2.dataKey === key);
    if (index1 !== -1 && index2 !== -1) {
      return index1 - index2;
    } else if (index1 !== -1 && index2 === -1) {
      return -1;
    } else if (index1 === -1 && index2 !== -1) {
      return 1;
    } else {
      return column1.name.localeCompare(column2.name, "en");
    }
  };

  return [...columns].sort(cmp);
}

/**
 * Returns a function which formats strings as a a number with a fixed number of
 * digits after the decimal point.
 *
 * Parameters:
 * -----------
 * n: number
 *     Number of digits after the decimal point.
 *
 * Returns:
 * --------
 * The format function.
 */
function formatNumber(n: number) {
  return (value: string) => Number(value).toFixed(n);
}

/**
 * Format a Unix timestamp as a string with the day, the month's abbreviated
 * name and the four-digit year, such as 1 Jan 2019 or 23 Aug 2020.
 *
 * Parameters:
 * -----------
 * t: string
 *     Unix timestamp.
 *
 * Returns:
 * --------
 * The formatted date string.
 */
function formatTimestamp(t: string) {
  return moment(parseInt(t, 10)).format("D MMM YYYY");
}
