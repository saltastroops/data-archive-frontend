import * as React from "react";
import { ISpUpNIC } from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import InputField from "../../basicComponents/InputField";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";

interface ISpUpNICProps {
  spUpNic: ISpUpNIC;
  onChange: (value: any) => void;
}

/**
 * A form for selecting SpUpNIC-related search parameters.
 */
const SpUpNIC = (props: ISpUpNICProps) => {
  const { onChange, spUpNic } = props;
  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    onChange({
      ...spUpNic,
      [name]: value
    });
  };
  const filters = ["B", "H-alpha", "Open", "R", "U", "V"];
  return (
    <MainGrid>
      <SubGrid>
        <p>Exposure time</p>
        <InputField name={"exposureTime"} onChange={change} />
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
export default SpUpNIC;
