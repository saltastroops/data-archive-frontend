import * as React from "react";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField from "../../basicComponents/SelectField2";

const Bvit = (props: any) => {
  const { onChange, details } = props;
  const change = (e: React.FormEvent<HTMLSelectElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    onChange({
      ...details,
      ...details.instrument,
      [name]: value
    });
  };
  return (
    <MainGrid>
      <SubGrid>
        <p>Mode</p>
        <SelectField
          options={["any", "imaging", "streaming"]}
          name={"mode"}
          onChange={change}
        />
      </SubGrid>
      <SubGrid>
        <p>Filter</p>
        <SelectField
          options={["any", "B", "H-alpha", "open", "R", "U", "V"]}
          name={"filter"}
          onChange={change}
        />
      </SubGrid>
    </MainGrid>
  );
};
export default Bvit;
