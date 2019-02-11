import styled from "styled-components";

const ParentGrid = styled.div.attrs({
  className: "grid-container"
})`
  && {
    display: grid;
    grid-template-columns: auto auto;
    padding: 10px;
    gap: 20px;
  }
`;
const TargetGrid = styled.div.attrs({
  className: "grid-item"
})`
  background-color: #f6f7e1;
  border: 1px solid rgba(246, 247, 225, 0.5);
  text-align: center;
`;
const ProposalGrid = styled.div.attrs({
  className: "grid-item"
})`
  background-color: #f2fffb;
  border: 1px solid rgba(242, 255, 251, 0.5);
  text-align: center;
`;
const DataGrid = styled.div.attrs({
  className: "grid-item"
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
  className: "grid-item"
})`
    background-color: #fff4fa;
    border: 1px solid rgba(255, 244, 250), 0.5);
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
const SubGrid = styled.div.attrs({
  className: "sub-grid"
})`
  && {
    display: grid;
    grid-template-columns: 30% auto;
    padding: 10px;
  }
`;
const SubGrid4 = styled.div.attrs({
  className: "sub-grid4"
})`
  && {
    display: grid;
    grid-template-columns: auto auto auto auto;
    padding: 10px;
  }
`;
const InnerItem = styled.div.attrs({
  className: "inner-item"
})`
  text-align: left;
`;
const InnerItemLabel = styled.div.attrs({
  className: "inner-item-label"
})`
  text-align: right;
  margin-right: 15px;
`;

export {
  ParentGrid,
  ProposalGrid,
  TelescopeGrid,
  DataGrid,
  TargetGrid,
  SubGrid4,
  InnerItemLabel,
  InnerItem,
  SubGrid,
  MainGrid,
  ButtonGrid
};
