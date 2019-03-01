import * as React from "react";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField from "../../basicComponents/SelectField";

const Salticam = (props: any) => {
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
        <p>Detector Mode</p>
        <SelectField
          options={[
            "any",
            "Normal",
            "Slot Mode",
            "Drift Scan",
            "Frame Transfer"
          ]}
          name={"detectorMode"}
          onChange={change}
        />
      </SubGrid>
    </MainGrid>
  );
};
export default Salticam;
