import * as React from "react";
import { IHIPPO } from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import InputField from "../../basicComponents/InputField";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";

interface IHippoProps {
  hippo: IHIPPO;
  onChange: (value: any) => void;
}

/**
 * A form for selecting Hippo-related search parameters.
 */
const Hippo = (props: IHippoProps) => {
  const { onChange, hippo } = props;
  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    onChange({
      ...hippo,
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
export default Hippo;
