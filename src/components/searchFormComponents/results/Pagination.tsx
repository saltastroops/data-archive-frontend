import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

/**
 * Whether the user is moving to the next or the previous page.
 */
export type PaginationDirection = "NEXT" | "PREVIOUS";

interface IPaginationProps {
  fetchPage: (
    startIndex: number,
    limit: number,
    direction: PaginationDirection
  ) => void;
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
    startIndex,
  } = props;
  const previousIndex = startIndex - itemsPerPage;
  const nextIndex = startIndex + itemsOnCurrentPage;

  return (
    <div className="pagination-controls">
      <button
        disabled={startIndex <= 0}
        className="button is-medium is-rounded"
        data-test="pagination-previous"
        onClick={() => fetchPage(previousIndex, itemsPerPage, "PREVIOUS")}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <span>
        <div className="pagination-ellipsis">{startIndex + 1}</div>
        <div className="pagination-ellipsis">&hellip;</div>
        <div className="pagination-ellipsis">
          {startIndex + itemsOnCurrentPage}
        </div>
        <div className="pagination-ellipsis">of</div>
        <div className="pagination-ellipsis">{itemsTotal}</div>
      </span>
      <button
        disabled={startIndex + itemsPerPage >= itemsTotal}
        className="button is-medium is-rounded"
        data-test="pagination-next"
        onClick={() => fetchPage(nextIndex, itemsPerPage, "NEXT")}
      >
        <FontAwesomeIcon className={""} icon={faChevronRight} />
      </button>
    </div>
  );
};

export default Pagination;
