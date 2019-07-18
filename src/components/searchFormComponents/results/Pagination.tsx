import * as React from "react";
import styled from "styled-components";

const PaginationContainer = styled.div.attrs({
  className: ""
})`
  && {
    display: block;
    margin-top: 20px
    margin-left: 30%
  }
`;

interface IPaginationProps {
  fetchPage: (startIndex: number, limit: number) => void;
  itemsOnCurrentPage: number;
  itemsPerPage: number;
  itemsTotal: number;
  startIndex: number;
}

/**
 * A component for offset-based pagination.
 *
 * The following properties need to be passed to the component.
 *
 * fetchPage:
 *     A method for fetching the next page. The method must expect a start index
 *     and a limit as its arguments.
 * itemsOnCurrentPage:
 *     The number of items on the current page. Unless the current page is the
 *     last page, this will be the same as the items per page.
 * itemsPerPage:
 *     The number of items to include on a page. For the last page the actual
 *     number of items may be less.
 * itemsTotal:
 *     The total number of items for all pages combined.
 * startIndex:
 *     The index of the first item on the current page. An index offset of 0,
 *     i.e. the start index for the first page is 0.
 */
const Pagination = (props: IPaginationProps) => {
  const {
    fetchPage,
    itemsOnCurrentPage,
    itemsPerPage,
    itemsTotal,
    startIndex
  } = props;
  const previousIndex = startIndex - itemsPerPage;
  const nextIndex = startIndex + itemsOnCurrentPage;

  return (
    <PaginationContainer>
      <div>
        <button
          disabled={startIndex <= 0}
          className="pagination-previous"
          onClick={() => fetchPage(previousIndex, itemsPerPage)}
        >
          Previous page
        </button>
        <a>
          <span className="pagination-ellipsis">{startIndex + 1}</span>
          <span className="pagination-ellipsis">&hellip;</span>
          <span className="pagination-ellipsis">
            {startIndex + itemsPerPage >= itemsTotal
              ? itemsTotal
              : itemsPerPage + startIndex}
          </span>
          <span className="pagination-ellipsis">of</span>
          <span className="pagination-ellipsis">{itemsTotal}</span>
        </a>
        <button
          disabled={startIndex + itemsPerPage >= itemsTotal}
          className="pagination-next"
          onClick={() => fetchPage(nextIndex, itemsPerPage)}
        >
          Next page
        </button>
      </div>
    </PaginationContainer>
  );
};
export default Pagination;
