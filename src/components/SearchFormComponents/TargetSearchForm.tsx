import * as React from "react";
import styled from "styled-components";
import DACheckbox from "../basicComponents/DACheckbox";
import DAInput from "../basicComponents/DAInput";
import DASelect from "../basicComponents/DASelect";

const PaddedTile = styled.div.attrs({
  className: "is-child tile"
})`
  && {
    padding: 1px;
  }
`;
const TargetParent = styled.div.attrs({
  className: "tile is-parent is-vertical"
})`
  && {
    padding: 1px;
    background-color: #f6f7e1;
  }
`;
const HorizontalField = styled.div.attrs({
  className: "is-child is-parent is-horizontal field"
})`
  && {
    padding: 1px;
    background-color: #f6f7e1;
  }
`;

interface ITargetSearchForm {
  name?: string;
  other?: string;
}

const TargetSearchForm = (props: ITargetSearchForm) => {
  // const {name} = props;
  return (
    <TargetParent>
      <HorizontalField>
        <PaddedTile>
          <DAInput name={"title"} label={"Tittle name"} />
        </PaddedTile>
        <PaddedTile>
          <DASelect
            options={["Simbad", "Other"]}
            name={"resolver"}
            label={"Resolver"}
          />
        </PaddedTile>
      </HorizontalField>
      <HorizontalField>
        <PaddedTile>
          <DAInput name={"ra"} label={"RA"} />
        </PaddedTile>
        <PaddedTile>
          <DAInput name={"dec"} label={"DEC"} />
        </PaddedTile>
      </HorizontalField>
      <HorizontalField>
        <PaddedTile>
          <DAInput name={"radius"} label={"Search radius"} />
        </PaddedTile>
        <PaddedTile>
          <DASelect
            options={["Arc seconds", "arc minutes", "degrees"]}
            name={"radiusUnits"}
            label={"Radius units"}
          />
        </PaddedTile>
      </HorizontalField>
      <HorizontalField>
        <PaddedTile>
          <DACheckbox name={"radius1"} label={"Search radius1"} />
        </PaddedTile>
        <PaddedTile>
          <DACheckbox name={"radiusUnits1"} label={"Radius units1"} />
        </PaddedTile>
      </HorizontalField>
    </TargetParent>
  );
};
export default TargetSearchForm;
