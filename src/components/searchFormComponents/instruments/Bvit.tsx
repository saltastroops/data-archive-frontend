import * as React from "react";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import { IBVIT } from "../../../utils/ObservationQueryParameters";

interface BvitProps {
  bvit: IBVIT;
  onChange: (value: any) => void;
}

/**
 * A form for selecting HRS-related search parameters.
 */
const Bvit = (props: BvitProps) => {
  const { onChange, bvit } = props;

  // Function for handling change events
  const change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    onChange({
      ...bvit,
      [name]: value
    });
  };

  const modes = ["Imaging", "Streaming"];
  const filters = ["B", "H-alpha", "Open", "R", "U", "V"];

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
        <p>Filter</p>
        <SelectField name={"filter"} onChange={change}>
          <AnyOption />
          {filters.map(filter => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </SelectField>
      </SubGrid>
    </MainGrid>
  );
};

export default Bvit;
