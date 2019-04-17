import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import {
  SortDirection,
  SortDirectionType,
  SortIndicator
} from "react-virtualized";

interface ISearchResultsTableHeaderProps {
  dataKey: string;
  sort: ({
    sortBy,
    sortDirection
  }: {
    sortBy: string;
    sortDirection: SortDirectionType;
  }) => void;
  sortBy?: string;
  style: object;
}

interface ISearchResultsTableHeaderState {
  nextSortDirection: SortDirectionType;
  previousSortBy?: string;
}

class SearchResultsTableHeader extends React.Component<
  ISearchResultsTableHeaderProps,
  ISearchResultsTableHeaderState
> {
  static getDerivedStateFromProps(
    props: ISearchResultsTableHeaderProps,
    state: ISearchResultsTableHeaderState
  ) {
    if (props.sortBy !== state.previousSortBy) {
      return {
        nextSortDirection:
          props.sortBy === props.dataKey
            ? SortDirection.DESC
            : SortDirection.ASC,
        previousSortBy: props.sortBy
      };
    } else {
      return null;
    }
  }
  constructor(props: ISearchResultsTableHeaderProps) {
    super(props);

    this.state = { nextSortDirection: SortDirection.ASC };
  }

  render() {
    const { children, dataKey, sortBy, style } = this.props;

    const showSortIndicator = sortBy === dataKey;

    return (
      <div
        className="search-results cell header"
        data-test="header"
        style={style}
        onClick={this.onClick}
      >
        {children}
        {showSortIndicator && (
          <FontAwesomeIcon
            icon={
              this.state.nextSortDirection === SortDirection.DESC
                ? faSortUp
                : faSortDown
            }
            style={{ paddingLeft: 3 }}
          />
        )}
      </div>
    );
  }

  onClick = () => {
    const nextSortDirection = this.state.nextSortDirection || SortDirection.ASC;
    const currentSortDirection =
      nextSortDirection === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

    this.props.sort({
      sortBy: this.props.dataKey,
      sortDirection: nextSortDirection
    });

    this.setState(() => ({ nextSortDirection: currentSortDirection }));
  };
}

export default SearchResultsTableHeader;
