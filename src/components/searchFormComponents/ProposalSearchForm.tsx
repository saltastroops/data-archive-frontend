import * as React from "react";
import styled from "styled-components";
import {
  InnerItem,
  InnerItemLabel,
  MainGrid,
  SubGrid
} from "../basicComponents/Grids";
import InputField from "../basicComponents/InputField";
import {
  ICode,
  IName,
  ITitle,
  IValue
} from "../basicComponents/SearchFormInterface";

const Columns = styled.div.attrs({
  className: "columns field"
})`
  && {
    background-color: ;
  }
`;

interface IProposalSearchForm {
  proposalCode: ICode;
  proposalTitle: ITitle;
  pi: IName;
  obsDate: IValue;
}

const ProposalSearchForm = (props: IProposalSearchForm) => {
  const { proposalCode, proposalTitle, pi, obsDate } = props;
  return (
    <>
      <MainGrid>
        <SubGrid>
          <InnerItemLabel>
            <p>Proposal Code</p>
          </InnerItemLabel>
          <InnerItem>
            <InputField
              error={proposalCode.error}
              name={"proposalCode"}
              onChange={proposalCode.onChange}
              value={proposalCode.code}
            />
          </InnerItem>
        </SubGrid>
        <SubGrid>
          <InnerItemLabel>
            <p>P.I</p>
          </InnerItemLabel>
          <InnerItem>
            <InputField
              name={"pi"}
              value={pi.name}
              error={pi.error}
              onChange={pi.onChange}
            />
          </InnerItem>
        </SubGrid>
      </MainGrid>

      <MainGrid>
        <SubGrid>
          <InnerItemLabel>
            <p>Proposal title</p>
          </InnerItemLabel>
          <InnerItem>
            <InputField
              name={"proposalTitle"}
              value={proposalTitle.title}
              error={proposalTitle.error}
              onChange={proposalTitle.onChange}
            />
          </InnerItem>
        </SubGrid>
        <SubGrid>
          <InnerItemLabel>
            <p>Obs date</p>
          </InnerItemLabel>
          <InnerItem>
            <InputField
              name={"obsDate"}
              value={obsDate.value}
              error={obsDate.error}
              onChange={obsDate.onChange}
              placeholder="dd-mm-yyyy"
            />
          </InnerItem>
        </SubGrid>
      </MainGrid>
    </>
  );
};
export default ProposalSearchForm;
