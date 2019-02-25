import * as React from "react";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import { ISalticam } from "../../../utils/ObservationQueryParameters";

interface ISalticamProps {
  details: ISalticam;
  onChange: (value: any) => void;
}

/**
 * A form for selecting Salticam-related search parameters.
 */
const Salticam = (props: ISalticamProps) => {
  const { onChange, details } = props;

  const change = (e: React.FormEvent<HTMLSelectElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    onChange({
      ...details,
      [name]: value
    });
  };

  const detectorModes = ["Normal", "Slot Mode", "Drift Scan", "Frame Transfer"];

  return (
    <MainGrid>
      <SubGrid>
        <p>Detector Mode</p>
        <SelectField name={"detectorMode"} onChange={change}>
          <AnyOption />
          {detectorModes.map(detectorMode => (
            <option key={detectorMode} value={detectorMode}>
              {detectorMode}
            </option>
          ))}
        </SelectField>
      </SubGrid>
    </MainGrid>
  );
};

export default Salticam;
