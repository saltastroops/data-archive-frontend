import * as React from "react";
import {
  validateDec,
  validateName,
  validateRa,
  validateRadius
} from "../../utils/validators";
import { MainGrid, SubGrid } from "../basicComponents/Grids";
import InputField from "../basicComponents/InputField";
import { ITarget } from "../basicComponents/SearchFormInterface";
import SelectField from "../basicComponents/SelectField2";

class TargetForm extends React.Component<
  { target: ITarget; onChange: any },
  any
> {
  render() {
    const { target, onChange } = this.props;
    const targetChange = (
      e: React.FormEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
      const name = e.currentTarget.name;
      const value = e.currentTarget.value;
      onChange({
        ...target,
        [name]: value,
        errors: {
          ...target.errors,
          [name]: ""
        }
      });
    };
    return (
      <>
        <MainGrid>
          <SubGrid>
            <p>Target name</p>
            <InputField
              name={"name"}
              value={target.name || ""}
              error={target.errors.name}
              onChange={targetChange}
            />
          </SubGrid>
          <SubGrid>
            <p>Resolver</p>
            <SelectField
              options={["Simbad", "NED", "VizieR"]}
              name={"resolver"}
              value={target.resolver || "Simbad"}
              onChange={targetChange}
            />
          </SubGrid>
        </MainGrid>

        <MainGrid>
          <SubGrid>
            <p>RA</p>
            <InputField
              name={"ra"}
              value={target.ra || ""}
              onChange={targetChange}
              error={target.errors.ra}
            />
          </SubGrid>
          <SubGrid>
            <p>DEC</p>
            <InputField
              name={"dec"}
              value={target.dec || ""}
              onChange={targetChange}
              error={target.errors.dec}
            />
          </SubGrid>
        </MainGrid>
        <MainGrid>
          <SubGrid>
            <p>Search radius</p>
            <InputField
              name={"radius"}
              value={target.radius || ""}
              onChange={targetChange}
              error={target.errors.radius}
            />
          </SubGrid>
          <SubGrid>
            <p>Radius units</p>
            <SelectField
              options={["Arc seconds", "arc minutes", "degrees"]}
              name={"radiusUnits"}
              onChange={targetChange}
              value={target.radiusUnits || "Arc seconds"}
            />
          </SubGrid>
        </MainGrid>
      </>
    );
  }
}

export const validatedTarget = (target: ITarget) => {
  return {
    ...target,
    errors: {
      dec: validateDec(target.dec || ""),
      name: validateName(target.name || ""),
      ra: validateRa(target.ra || ""),
      radius: validateRadius(target.radius || "")
    }
  };
};
export default TargetForm;
