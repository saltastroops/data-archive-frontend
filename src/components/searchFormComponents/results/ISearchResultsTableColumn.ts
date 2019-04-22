/**
 * A search results table column.
 *
 * Properties:
 * -----------
 * dataKey:
 *     A string identifying the type of data in this column.
 * name:
 *     A human-friendly column name.
 * visible:
 *     Whether the column should be visible.
 */
export default interface ISearchResultsTableColumn {
  dataKey: string;
  name: string;
  visible: boolean;
}
