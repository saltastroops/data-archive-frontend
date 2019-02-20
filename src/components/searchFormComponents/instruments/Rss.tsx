import * as React from "react";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField from "../../basicComponents/SelectField";

const Rss = (props: any) => {
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
          options={[
            "any",
            "Fabry Perot",
            "FP polarimetry",
            "Imaging",
            "Polarimetric imaging",
            "MOS",
            "MOS polarimetry",
            "Spectropolarimetry",
            "Spectroscopy"
          ]}
          name={"mode"}
          onChange={change}
        />
      </SubGrid>
      <SubGrid>
        <p>Detector Mode</p>
        <SelectField
          options={[
            "any",
            "Normal",
            "Frame Transfer",
            "Slot Mode",
            "Shuffle",
            "Drift Scan"
          ]}
          name={"detectorMode"}
          onChange={change}
        />
      </SubGrid>
    </MainGrid>
  );
};
export default Rss;
