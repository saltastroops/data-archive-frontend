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
    case DataKeys.INSTRUMENT:
      return { dataKey, name: "Instrument", visible: true };
    case DataKeys.OBSERVATION_NAME:
      return { dataKey, name: "Observation", visible: true };
    case DataKeys.OBSERVATION_NIGHT:
      return { dataKey, name: "Night", visible: true };
    case DataKeys.OBSERVATION_PUBLIC_FROM:
      return { dataKey, name: "Release Date", visible: true };
    case DataKeys.PROPOSAL_CODE:
      return { dataKey, name: "Proposal", visible: true };
    case DataKeys.PROPOSAL_PI_FAMILY_NAME:
      return { dataKey, name: "PI", visible: true };
    case DataKeys.PROPOSAL_TITLE:
      return { dataKey, name: "Proposal Title", visible: true };
    case DataKeys.TARGET_DECLINATION:
      return { dataKey, name: "Declination", visible: true };
    case DataKeys.TARGET_NAME:
      return { dataKey, name: "Target", visible: true };
    case DataKeys.TARGET_RIGHT_ASCENSION:
      return { dataKey, name: "Right Ascension", visible: true };
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
    DataKeys.OBSERVATION_NIGHT,
    DataKeys.TARGET_NAME,
    DataKeys.TARGET_RIGHT_ASCENSION,
    DataKeys.TARGET_DECLINATION,
    DataKeys.TARGET_TYPE_EXPLANATION,
    DataKeys.PROPOSAL_CODE,
    DataKeys.PROPOSAL_PI_FAMILY_NAME,
    DataKeys.PROPOSAL_TITLE,
    DataKeys.TELESCOPE_NAME,
    DataKeys.INSTRUMENT
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
    let v;
    if (index1 !== 1 && index2 !== -1) {
      v = index1 - index2;
    } else if (index1 !== -1 && index2 === -1) {
      v = -1;
    } else if (index1 === -1 && index2 !== -1) {
      v = 1;
    } else {
      v = column1.name.localeCompare(column2.name, "en");
    }
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