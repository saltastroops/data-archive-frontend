import * as React from "react";
import { ITelescope } from "../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../basicComponents/Grids";
import SelectField from "../basicComponents/SelectField";
import LesediForm from "./telescopes/LesediForm";
import OneNineMForm from "./telescopes/OneNineM";
import SaltForm from "./telescopes/SaltForm";

class TelescopeForm extends React.Component<
  { telescope: any; onChange: any }, // TODO: remove telescope any
  any
> {
  render() {
    const { telescope, onChange } = this.props;
    const changeTelescope = (e: React.FormEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value;
      onChange({
        name: value
      });
    };
    const changeInstrument = (value: any) => {
      onChange({
        ...telescope,
        instrument: {
          ...value
        }
      });
    };
    const name = telescope.name || { name: "" };
    return (
      <>
        <MainGrid>
          <SubGrid>
            <p>Telescope</p>
            <SelectField
              name={"telescope"}
              options={["any", "SALT", "1.9 m", "Lesedi"]}
              onChange={changeTelescope}
            />
          </SubGrid>
        </MainGrid>
        {name === "SALT" && (
          <SaltForm
            details={telescope.instrument || { instrument: "" }}
            onChange={changeInstrument}
          />
        )}
        {name === "Lesedi" && (
          <LesediForm
            details={telescope.instrument || { instrument: "" }}
            onChange={changeInstrument}
          />
        )}
        {name === "1.9 m" && (
          <OneNineMForm
            details={telescope.instrument || { instrument: "" }}
            onChange={changeInstrument}
          />
        )}
      </>
    );
  }
}

export const validatedTelescope = (telescope: ITelescope) => {
  return {
    ...telescope,
    errors: {}
  };
};
export default TelescopeForm;
