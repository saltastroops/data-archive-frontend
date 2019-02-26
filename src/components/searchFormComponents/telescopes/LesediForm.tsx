import * as React from "react";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import Bvit from "../instruments/Bvit";
import Hrs from "../instruments/Hrs";
import Rss from "../instruments/Rss";
import {
  IBVIT,
  IHRS,
  IInstrument,
  ILesedi,
  InstrumentName,
  IRSS,
  ISalticam
} from "../../../utils/ObservationQueryParameters";

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
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void
) => {
  const name = instrument && instrument.name;
  switch (name) {
    case "SpUpNIC": {
      return <Rss rss={instrument as IRSS} onChange={onChange} />;
    }
    case "HIPPO": {
      return <Hrs hrs={instrument as IHRS} onChange={onChange} />;
    }
    case "SHOC": {
      return <Bvit bvit={instrument as IBVIT} onChange={onChange} />;
    }
    default:
      return null;
  }
};

interface ILesediFormProps {
  lesedi: ILesedi;
  onChange: (value: any) => any;
}

/**
 * A form for selecting Lesedi-related search parameters.
 */
const LesediForm = (props: ILesediFormProps) => {
  const { lesedi, onChange } = props;

  // Function for changing the instrument
  const changeInstrument = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    onChange({ name: value });
  };

  // Function for changing the instrument mode
  const changeMode = (value: any) => {
    onChange({
      ...lesedi,
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
