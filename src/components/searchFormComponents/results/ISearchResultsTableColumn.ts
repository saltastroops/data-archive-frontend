/**
 * A search results table column.
 *
 * Properties:
 * -----------
 * dataKey:
 *     A string identifying the type of data in this column.
 * format:
 *     A function for formatting a column value. The value must be a string.
 * name:
 *     A human-friendly column name.
 * visible:
 *     Whether the column should be visible.
 */
export default interface ISearchResultsTableColumn {
  dataKey: string;
  format?: (value: string) => string;
  name: string;
  visible: boolean;
  width?: number;
}
