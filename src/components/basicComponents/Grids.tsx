import * as React from "react";
import styled from "styled-components";
import "../../App.css";

const ParentGrid = styled.div.attrs({
  className: "grid-container",
  disable: true
})`
  display: grid;
  grid-template-columns: auto auto;
  padding: 10px;
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: auto;
  }
`;

const TargetGrid = styled.div.attrs({
  className: "grid-item target-form"
})`
  background-color: #f6f7e1;
  border: 1px solid rgba(246, 247, 225, 0.5);
  text-align: center;
`;

const ProposalGrid = styled.div.attrs({
  className: "grid-item proposal-form"
})`
  background-color: #f2fffb;
  border: 1px solid rgba(242, 255, 251, 0.5);
  text-align: center;
`;

const DataGrid = styled.div.attrs({
  className: "grid-item data-form"
})`
  background-color: #e0edf9;
  border: 1px solid rgba(224, 237, 249, 0.5);
  text-align: center;
`;
const ButtonGrid = styled.div.attrs({
  className: "grid-item"
})`
  border: 1px solid rgba(255, 255, 255, 0);
  text-align: left;
`;

const TelescopeGrid = styled.div.attrs({
  className: "grid-item telescope-form"
})`
  background-color: #fff4fa;
  border: 1px solid rgba(255, 244, 250, 0.5);
  text-align: center;
`;

const MainGrid = styled.div.attrs({
  className: "main-grid"
})`
  && {
    display: grid;
    grid-template-columns: 50% 50%;
    padding: 10px;
  }
`;

const SingleColumnGrid = styled.div.attrs({
  className: "single-column-grid"
})`
  && {
    display: grid;
    grid-template-columns: 100%;
    padding: 10px;
  }
`;

const InnerMainGrid = styled.div.attrs({
  className: "inner-main-grid"
})`
  && {
    display: grid;
    grid-template-columns: 40% 40%;
  }
`;

const SubGrid = styled.div.attrs({
  className: "sub-grid"
})`
  && {
    text-align: left;
    padding-left: 10px;
  }
`;

const SubGrid4 = styled.div.attrs({
  className: "sub-grid4"
})`
  && {
    display: grid;
    grid-template-columns: auto auto auto auto;
  }
`;

const SubGrid5 = styled.div.attrs({
  className: "sub-grid6"
})`
  && {
    display: grid;
    grid-template-columns: auto auto auto auto auto;
  }
`;

const Span = styled.span.attrs({
  className: "span"
})`
  && {
    font-size: 22px;
    padding-right: 10px;
  }
`;
const LoadSpinnerWrapper = styled.div`
   {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 2;
  }
`;

const LoadSpinner = styled.div`
   {
    border: 10px solid #cccccc;
    border-color: #cccccc transparent #cccccc transparent;
    border-radius: 50%;
    width: 200px;
    height: 200px;
    animation: spin 1s linear infinite;

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;
const Spinner = () => (
  <LoadSpinnerWrapper>
    <LoadSpinner />
  </LoadSpinnerWrapper>
);

export {
  ParentGrid,
  ProposalGrid,
  SingleColumnGrid,
  TelescopeGrid,
  DataGrid,
  TargetGrid,
  SubGrid4,
  SubGrid5,
  SubGrid,
  MainGrid,
  ButtonGrid,
  Span,
  Spinner,
  InnerMainGrid
};
