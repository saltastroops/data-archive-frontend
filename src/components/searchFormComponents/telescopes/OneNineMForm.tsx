import * as React from "react";
import {
  IHIPPO,
  IInstrument,
  InstrumentName,
  IOneDotNineM,
  ISHOC,
  ISpUpNIC
} from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import HIPPO from "../instruments/HIPPO";
import SHOC from "../instruments/SHOC";
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
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
) => {
  const name = instrument && instrument.name;
  switch (name) {
    case "SpUpNIC": {
      return <SpUpNIC spUpNic={instrument as ISpUpNIC} onChange={onChange} />;
    }
    case "HIPPO": {
      return <HIPPO hippo={instrument as IHIPPO} onChange={onChange} />;
    }
    case "SHOC": {
      return <SHOC shoc={instrument as ISHOC} onChange={onChange} />;
    }
    default:
      return null;
  }
};

interface IOneNineMProps {
  oneNineM: IOneDotNineM;
  onChange: (key: string, value: any) => void;
}

/**
 * A form for selecting search parameters related to the 1.9 m Telescope.
 */
const OneNineMForm = (props: IOneNineMProps) => {
  const { oneNineM, onChange } = props;

  // Function for handling instrument selection
  const changeInstrument = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange("instrument", { name: value });
  };

  // Function for handling changes to instrument-related search parameters
  const changeInstrumentParameters = (value: any) => {
    onChange("instrument", {
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
      {oneNineMInstrumentsSwitcher(
        oneNineM.instrument,
        changeInstrumentParameters
      )}
    </>
  );
};

export default OneNineMForm;
