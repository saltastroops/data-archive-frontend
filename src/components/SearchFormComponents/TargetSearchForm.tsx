import * as React from "react";
import {
  InnerItem,
  InnerItemLabel,
  MainGrid,
  SubGrid
} from "../basicComponents/Grids";
import InputField from "../basicComponents/InputField";
import { IName, IValue } from "../basicComponents/SearchFormInterface";
import SelectField from "../basicComponents/SelectField";

interface ITargetSearchForm {
  targetName: IName;
  ra: IValue;
  dec: IValue;
  radius: IValue;
  radiusUnits: IValue;
  resolver: IValue;
}

const TargetSearchForm = (props: ITargetSearchForm) => {
  const { targetName, ra, dec, radius, radiusUnits, resolver } = props;
  return (
    <>
      <MainGrid>
        <SubGrid>
          <InnerItemLabel>
            <p>Target name</p>
          </InnerItemLabel>
          <InnerItem>
            <InputField
              name={"targetName"}
              value={targetName.name}
              error={targetName.error}
              onChange={targetName.onChange}
            />
          </InnerItem>
        </SubGrid>
        <SubGrid>
          <InnerItemLabel>
            <p>Resolver</p>
          </InnerItemLabel>
          <InnerItem>
            <SelectField
              options={["Simbad", "Other"]}
              name={"resolver"}
              value={resolver.value}
              onChange={resolver.onChange}
            />
          </InnerItem>
        </SubGrid>
      </MainGrid>

      <MainGrid>
        <SubGrid>
          <InnerItemLabel>
            <p>RA</p>
          </InnerItemLabel>
          <InnerItem>
            <InputField
              name={"ra"}
              value={ra.value}
              onChange={ra.onChange}
              error={ra.error}
            />
          </InnerItem>
        </SubGrid>
        <SubGrid>
          <InnerItemLabel>
            <p>DEC</p>
          </InnerItemLabel>
          <InnerItem>
            <InputField
              name={"dec"}
              value={dec.value}
              onChange={dec.onChange}
              error={dec.error}
            />
          </InnerItem>
        </SubGrid>
      </MainGrid>

      <MainGrid>
        <SubGrid>
          <InnerItemLabel>
            <p>Search radius</p>
          </InnerItemLabel>
          <InnerItem>
            <InputField
              name={"radius"}
              value={radius.value}
              onChange={radius.onChange}
              error={radius.error}
            />
          </InnerItem>
        </SubGrid>
        <SubGrid>
          <InnerItemLabel>
            <p>Radius units</p>
          </InnerItemLabel>
          <InnerItem>
            <SelectField
              options={["Arc seconds", "arc minutes", "degrees"]}
              name={"radiusUnits"}
              onChange={radiusUnits.onChange}
              value={radiusUnits.value}
            />
          </InnerItem>
        </SubGrid>
      </MainGrid>
    </>
  );
};
export default TargetSearchForm;
