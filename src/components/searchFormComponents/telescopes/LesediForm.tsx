import * as React from "react";
import {
  IHIPPO,
  IInstrument,
  ILesedi,
  InstrumentName,
  ISHOC,
  ISpUpNIC
} from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import SpUpNIC from "../instruments/SpUpNIC";
import Hippo from "../instruments/Hippo";
import Shoc from "../instruments/Shoc";

/**
 * Return the form for a given instrument.
 *
 * Parameters:
 * -----------
 * instrument:
 *     The instrument.
 *
 * Returns:
 * --------
 * The form component.
 */
export const lesediInstrumentsSwitcher = (
  instrument: IInstrument,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
) => {
  const name = instrument && instrument.name;
  switch (name) {
    case "SpUpNIC": {
      return <SpUpNIC spUpNic={instrument as ISpUpNIC} onChange={onChange} />;
    }
    case "HIPPO": {
      return <Hippo hippo={instrument as IHIPPO} onChange={onChange} />;
    }
    case "SHOC": {
      return <Shoc shoc={instrument as ISHOC} onChange={onChange} />;
    }
    default:
      return null;
  }
};

interface ILesediFormProps {
  lesedi: ILesedi;
  onChange: (key: string, value: any) => void;
}

/**
 * A form for selecting Lesedi-related search parameters.
 */
const LesediForm = (props: ILesediFormProps) => {
  const { lesedi, onChange } = props;

  // Function for changing the instrument
  const changeInstrument = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    onChange("instrument", { name: value });
  };

  // Function for changing the instrument mode
  const changeMode = (value: any) => {
    onChange("instrument", {
      ...lesedi.instrument,
      ...value
    });
  };

  const instruments: InstrumentName[] = ["HIPPO", "SHOC", "SpUpNIC"];

  return (
    <>
      <MainGrid>
        <SubGrid>
          <p>Instrument</p>
          <SelectField name={"instrument"} onChange={changeInstrument}>
            <AnyOption />
            {instruments.map(instrument => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </SelectField>
        </SubGrid>
      </MainGrid>
      {lesediInstrumentsSwitcher(lesedi.instrument, changeMode)}
    </>
  );
};

export default LesediForm;
