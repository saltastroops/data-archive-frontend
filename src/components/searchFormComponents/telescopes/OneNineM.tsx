import * as React from "react";
import {
  InstrumentName,
  IOneNineM
} from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import Bvit from "../instruments/Bvit";
import Hrs from "../instruments/Hrs";
import Rss from "../instruments/Rss";

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
  oneNineM: any,
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void
) => {
  const instrument = oneNineM.name;
  switch (instrument) {
    case "SpUpNIC": {
      return <Rss rss={oneNineM} onChange={onChange} />;
    }
    case "HIPPO": {
      return <Hrs hrs={oneNineM} onChange={onChange} />;
    }
    case "SHOC": {
      return <Bvit bvit={oneNineM} onChange={onChange} />;
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

  const changeInstrument = (e: React.FormEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    onChange({ name: value });
  };

  const changeMode = (value: any) => {
    onChange({
      ...oneNineM,
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
      {oneNineMInstrumentsSwitcher(oneNineM, changeMode)}
    </>
  );
};

export default OneNineMForm;
