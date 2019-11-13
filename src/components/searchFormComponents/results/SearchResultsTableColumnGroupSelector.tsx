import * as React from "react";
import styled from "styled-components";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";
import SearchResultsTableColumn from "./ISearchResultsTableColumn";

const ColumnGroupHeading = styled.h2`
  font-size: 1em;
  font-weight: 700;
`;

interface ISearchResultsTableColumnGroupSelectorProps {
  category: string;
  columns: SearchResultsTableColumn[];
  onChange: (dataKey: string, visible: boolean) => void;
}

class SearchResultsTableColumnGroupSelector extends React.Component<
  ISearchResultsTableColumnGroupSelectorProps
> {
  render() {
    return (
      <div className="column-group-selector">
        <ColumnGroupHeading>{this.props.category}</ColumnGroupHeading>
        <ul>
          {this.props.columns.map(column => (
            <li key={column.dataKey}>
              <label>
                <LargeCheckbox
                  type="checkbox"
                  name={column.dataKey}
                  onChange={this.handleChange}
                  checked={column.visible}
                />
                {column.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.target.name, e.target.checked);
  };
}

export default SearchResultsTableColumnGroupSelector;
