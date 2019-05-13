import * as React from "react";
import { BVITFilter, IBVIT } from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";

interface IBvitProps {
  bvit: IBVIT;
  onChange: (value: any) => void;
}

/**
 * A form for selecting BVIT-related search parameters.
 */
const BVIT = (props: IBvitProps) => {
  const { onChange, bvit } = props;

  // Function for handling change events
  const change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    onChange({
      ...bvit,
      [name]: value
    });
  };

  const modes = ["Imaging", "Streaming"];
  const filters: BVITFilter[] = ["B", "H-alpha", "Open", "R", "U", "V"];

  return (
    <MainGrid>
      {/* Mode */}
      <SubGrid>
        <p>Mode</p>
        <SelectField name={"mode"} value={bvit.mode} onChange={change}>
          <AnyOption />
          {modes.map(mode => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </SelectField>
      </SubGrid>

      {/* Filter */}
      <SubGrid>
        <p>Filter</p>
        <SelectField name={"filter"} value={bvit.filter} onChange={change}>
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

export default BVIT;
