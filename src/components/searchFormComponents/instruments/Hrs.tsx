import * as React from "react";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import { IHRS } from "../../../utils/ObservationQueryParameters";

interface IHrsProps {
  details: IHRS;
  onChange: (value: any) => void;
}

/**
 * A form for selecting HRS-related search parameters.
 * @param props
 * @constructor
 */
const Hrs = (props: IHrsProps) => {
  const { onChange, details } = props;

  const change = (e: React.FormEvent<HTMLSelectElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    onChange({
      ...details,
      [name]: value
    });
  };

  const modes = [
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
        <SelectField name={"mode"} onChange={change}>
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
export default Hrs;
