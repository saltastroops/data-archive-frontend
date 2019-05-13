import * as React from "react";
import {
  ILesedi,
  IOneDotNineM,
  ISALT,
  ITelescope,
  TelescopeName
} from "../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../basicComponents/Grids";
import SelectField, { AnyOption } from "../basicComponents/SelectField";
import LesediForm from "./telescopes/LesediForm";
import OneNineMForm from "./telescopes/OneNineMForm";
import SaltForm from "./telescopes/SaltForm";

const TELESCOPES: TelescopeName[] = ["SALT", "1.9 m", "Lesedi"];

interface ITelescopeFormProps {
  telescope?: ITelescope;
  onChange: (value: any) => void;
}

/**
 * A form for selecting telescope-related search parameters.
 */
class TelescopeForm extends React.Component<ITelescopeFormProps, {}> {
  render() {
    const { telescope, onChange } = this.props;

    // Function for updating telescope-related parameters
    const changeTelescope = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onChange({
        name: value
      });
    };

    // Function for updating instrument-related properties
    const changeTelescopeParameter = (key: string, value: any) => {
      onChange({
        ...telescope,
        [key]: value
      });
    };

    const name = (telescope && telescope.name) || "";
    return (
      <>
        <MainGrid>
          <SubGrid>
            <p>Telescope</p>
            <SelectField
              name={"telescope"}
              onChange={changeTelescope}
              value={name || ""}
            >
              <AnyOption />
              {TELESCOPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectField>
          </SubGrid>
        </MainGrid>
        {name === "SALT" && (
          <SaltForm
            salt={telescope as ISALT}
            onChange={changeTelescopeParameter}
          />
        )}
        {name === "Lesedi" && (
          <LesediForm
            lesedi={telescope as ILesedi}
            onChange={changeTelescopeParameter}
          />
        )}
        {name === "1.9 m" && (
          <OneNineMForm
            oneNineM={telescope as IOneDotNineM}
            onChange={changeTelescopeParameter}
          />
        )}
      </>
    );
  }
}

/**
 * Validate the given telescope-related search parameters and, if need be, add
 * error messages to them.
 */
export const validatedTelescope = (telescope?: ITelescope) => {
  if (telescope) {
    return {
      ...telescope,
      errors: {}
    };
  } else {
    return telescope;
  }
};

export default TelescopeForm;
