import * as React from "react";
import {
  IHIPPO,
  IInstrument,
  InstrumentName,
  IOneNineM,
  ISHOC,
  ISpUpNIC
} from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import Hippo from "../instruments/Hippo";
import Shoc from "../instruments/Shoc";
import SpUpNIC from "../instruments/SpUpNIC";

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
export const oneNineMInstrumentsSwitcher = (
  instrument: IInstrument,
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void
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

interface IOneNineMProps {
  oneNineM: IOneNineM;
  onChange: (value: any) => void;
}

/**
 * A form for selecting search parameters related to the 1.9 m Telescope.
 */
const OneNineMForm = (props: IOneNineMProps) => {
  const { oneNineM, onChange } = props;

  const changeInstrument = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange({ name: value });
  };

  const changeMode = (value: any) => {
    console.log("XXX: ", oneNineM);
    onChange({
      ...oneNineM.instrument,
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
      {oneNineMInstrumentsSwitcher(oneNineM.instrument, changeMode)}
    </>
  );
};

export default OneNineMForm;
