import * as React from "react";
import {
  InstrumentName,
  ISALT
} from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";

interface ISaltFormProps {
  salt: ISALT;
  onChange: (key: string, value: any) => void;
}

/**
 * A form for selecting SALT-related search parameters.
 */
const SaltForm = (props: ISaltFormProps) => {
  const { salt, onChange } = props;
  const instrument = salt.instrument || { name: "" };

  // Function for handling instrument selection
  const changeInstrument = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange("instrument", { name: value });
  };

  // Function for handling changes to instrument-related search parameters
  const changeInstrumentParameters = (value: any) => {
    onChange("instrument", {
      ...salt.instrument,
      ...value
    });
  };

  const instruments: InstrumentName[] = ["HRS", "RSS", "BVIT", "Salticam"];

  return (
    <>
      <MainGrid>
        <SubGrid>
          <p>Instrument</p>
          <SelectField
            name={"instrument"}
            onChange={changeInstrument}
            value={instrument.name || ""}
          >
            <AnyOption />
            {instruments.map(instr => (
              <option key={instr} value={instr}>
                {instr}
              </option>
            ))}
          </SelectField>
        </SubGrid>
      </MainGrid>
    </>
  );
};

export default SaltForm;
