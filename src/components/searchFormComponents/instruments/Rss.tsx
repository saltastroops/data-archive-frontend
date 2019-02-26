import { detect } from "async";
import * as React from "react";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import { IInstrument, IRSS } from "../../../utils/ObservationQueryParameters";

interface IRssProps {
  rss: IRSS;
  onChange: (value: any) => void;
}

/**
 * A form selecting RSS-related search parameters.
 */
const Rss = (props: IRssProps) => {
  const { onChange, rss } = props;

  // Function for handling change events
  const change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    onChange({
      ...rss,
      [name]: value
    });
  };

  const modes = [
    "Fabry Perot",
    "FP polarimetry",
    "Imaging",
    "Polarimetric imaging",
    "MOS",
    "MOS polarimetry",
    "Spectropolarimetry",
    "Spectroscopy"
  ];

  const detectorModes = [
    "Normal",
    "Frame Transfer",
    "Slot Mode",
    "Shuffle",
    "Drift Scan"
  ];

  return (
    <MainGrid>
      <SubGrid>
        <p>Mode</p>
        <SelectField name={"mode"} onChange={change}>
          <AnyOption />
          {modes.map(mode => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </SelectField>
      </SubGrid>
      <SubGrid>
        <p>Detector Mode</p>
        <SelectField name={"detectorMode"} onChange={change}>
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
export default Rss;
