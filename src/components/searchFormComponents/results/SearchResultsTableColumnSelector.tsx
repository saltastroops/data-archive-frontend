import * as React from "react";
import styled from "styled-components";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";
import SearchResultsTableColumn from "./ISearchResultsTableColumn";

/**
 * Properties for the search results table column selector.
 *
 * columns:
 *     The array of table columns.
 * onChange:
 *     The function to call when a checkbox is clicked. This must implement
 *     changing the column visibility. The function must expect a column's
 *     data key and the new visibility status (true for visible, false for
 *     hidden) as its arguments.
 */
interface ISearchResultsTableColumnSelectorProps {
  columns: SearchResultsTableColumn[];
  onChange: (dataKey: string, visible: boolean) => void;
}

/**
 * Responsive grid for the checkboxes.
 */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 10px;
  justify-content: center;
  margin-top: 15px;

  @media screen and (min-width: 440px) {
    grid-template-columns: 190px 190px;
  }

  @media screen and (min-width: 640px) {
    grid-template-columns: 190px 190px 190px;
  }

  @media screen and (min-width: 840px) {
    grid-template-columns: 190px 190px 190px 190px;
  }

  @media screen and (min-width: 1040px) {
    grid-template-columns: 190px 190px 190px 190px 190px;
  }

  @media screen and (min-width: 1472px) {
    grid-template-columns: 190px 190px 190px 190px 190px 190px;
  }
`;

/**
 * Checkboxes for toggling the visibility of columns in the search results
 * table.
 */
class SearchResultsTableColumnSelector extends React.Component<
  ISearchResultsTableColumnSelectorProps,
  {}
> {
  render() {
    const { columns } = this.props;

    return (
      <Grid>
        {columns.map((column, index) => (
          <div key={index}>
            <label className="label">
              <LargeCheckbox
                type="checkbox"
                checked={column.visible}
                name={column.dataKey}
                onChange={this.onChange}
              />
              {column.name}
            </label>
          </div>
        ))}
      </Grid>
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.target.name, e.target.checked);
  };
}

export default SearchResultsTableColumnSelector;
