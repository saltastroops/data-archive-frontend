import * as React from "react";
import { HRSMode, IHRS } from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";

interface IHrsProps {
  hrs: IHRS;
  onChange: (value: any) => void;
}

/**
 * A form for selecting HRS-related search parameters.
 * @param props
 * @constructor
 */
const HRS = (props: IHrsProps) => {
  const { onChange, hrs } = props;

  // Function for handling change events
  const change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    onChange({
      ...hrs,
      [name]: value
    });
  };

  const modes: HRSMode[] = [
    "High Resolution",
    "High Stability",
    "Int Cal Fibre",
    "Low Resolution",
    "Medium Resolution"
  ];

  return (
    <MainGrid>
      <SubGrid>
        <p>Mode</p>
        <SelectField name={"mode"} value={hrs.mode} onChange={change}>
          <AnyOption />
          {modes.map(mode => (
            <option key={mode} value={mode.toUpperCase()}>
              {mode}
            </option>
          ))}
        </SelectField>
      </SubGrid>
    </MainGrid>
  );
};
export default HRS;
