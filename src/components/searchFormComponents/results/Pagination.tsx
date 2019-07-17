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
  pageInfo: {
    startIndex: number;
    itemsPerPage: number;
    itemsTotal: number;
  };
  refetchContent: (fromIndex: number, refetch: any) => void;
  refetch: () => void;
}

const Pagination = (props: IPaginationProps) => {
  const { startIndex, itemsPerPage, itemsTotal } = props.pageInfo;
  const { refetchContent, refetch } = props;
  const previousIndex =
    startIndex + 1 - itemsPerPage <= 0 ? startIndex : startIndex - itemsPerPage;
  const nextIndex =
    startIndex + itemsPerPage >= itemsTotal
      ? itemsTotal - 1
      : startIndex + itemsPerPage;

  console.log(previousIndex, startIndex, nextIndex);
  return (
    <PaginationContainer>
      <div>
        <button
          disabled={startIndex + 1 === 1}
          className="pagination-previous "
          onClick={() => refetchContent(previousIndex, refetch as any)}
        >
          Previous
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
          onClick={() => refetchContent(nextIndex, refetch as any)}
        >
          Next page
        </button>
      </div>
    </PaginationContainer>
  );
};
export default Pagination;
