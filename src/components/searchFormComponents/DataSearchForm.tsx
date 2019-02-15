import * as React from "react";
import styled from "styled-components";
import {
  InnerItem,
  InnerItemLabel,
  MainGrid,
  SubGrid,
  SubGrid4
} from "../basicComponents/Grids";
import SelectField from "../basicComponents/SelectField";

const LargeCheckbox = styled.input.attrs({
  className: "is-checkradio",
  type: "checkbox"
})`
  && {
    width: 20px;
    height: 20px;
  }
`;

interface IDataSearchForm {
  dataTypes: string[];
  selectedDataType: string;
  arcs: boolean;
  biases: boolean;
  flats: boolean;
  standards: boolean;
  onChange: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}

const DataSearchForm = (props: IDataSearchForm) => {
  const {
    dataTypes,
    onChange,
    selectedDataType,
    arcs,
    biases,
    flats,
    standards
  } = props;
  return (
    <>
      <MainGrid>
        <SubGrid>
          <InnerItemLabel>
            <p>Reduce/raw</p>
          </InnerItemLabel>
          <InnerItem>
            <SelectField
              options={dataTypes}
              name={"dataType"}
              onChange={onChange}
              value={selectedDataType}
            />
          </InnerItem>
        </SubGrid>
      </MainGrid>
      <MainGrid>
        <SubGrid>
          <InnerItem>
            <h5 className={"title is-5"}>Include</h5>
          </InnerItem>
        </SubGrid>
      </MainGrid>
      <SubGrid4>
        <InnerItem>
          <label className={"is-horizontal is-ancestor"}>
            <LargeCheckbox checked={arcs} onChange={onChange} name={"arcs"} />
            <div className={"label-field"}>
              <label className={"label"}>arcs</label>
            </div>
          </label>
        </InnerItem>
        <InnerItem>
          <label>
            <LargeCheckbox
              checked={biases}
              onChange={onChange}
              name={"biases"}
            />
            <div className={"label-field"}>
              <label className={"label"}>biases</label>
            </div>
          </label>
        </InnerItem>
        <InnerItem>
          <label>
            <LargeCheckbox checked={flats} onChange={onChange} name={"flats"} />
            <div className={"label-field"}>
              <label className={"label"}>flats</label>
            </div>
          </label>
        </InnerItem>
        <InnerItem>
          <label>
            <LargeCheckbox
              checked={standards}
              onChange={onChange}
              name="standards"
            />
            <div className={"label-field"}>
              <label className={"label"}>standards</label>
            </div>
          </label>
        </InnerItem>
      </SubGrid4>
    </>
  );
};
export default DataSearchForm;
