import * as React from "react";
import { IBVIT } from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";

interface IBvitProps {
  bvit: IBVIT;
  onChange: (value: any) => void;
}

/**
 * A form for selecting BVIT-related search parameters.
 */
const Bvit = (props: IBvitProps) => {
  const { onChange, bvit } = props;
  const change = (e: React.FormEvent<HTMLSelectElement>) => {
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
