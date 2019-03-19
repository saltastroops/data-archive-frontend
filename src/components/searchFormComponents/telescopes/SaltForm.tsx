import * as React from "react";
import {
  IBVIT,
  IHRS,
  IInstrument,
  InstrumentName,
  IRSS,
  ISALT,
  ISALTICAM
} from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import BVIT from "../instruments/BVIT";
import HRS from "../instruments/HRS";
import RSS from "../instruments/RSS";
import SALTICAM from "../instruments/SALTICAM";

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
export const saltInstrumentsSwitcher = (
  instrument: IInstrument,
  onChange: (value: any) => void
) => {
  const name = instrument && instrument.name;
  switch (name) {
    case "RSS": {
      return <RSS rss={instrument as IRSS} onChange={onChange} />;
    }
    case "HRS": {
      return <HRS hrs={instrument as IHRS} onChange={onChange} />;
    }
    case "BVIT": {
      return <BVIT bvit={instrument as IBVIT} onChange={onChange} />;
    }
    case "Salticam": {
      return (
        <SALTICAM salticam={instrument as ISALTICAM} onChange={onChange} />
      );
    }
    default:
      return null;
  }
};

interface ISaltFormProps {
  salt: ISALT;
  onChange: (key: string, value: any) => void;
}

/**
 * A form for selecting SALT-related search parameters.
 */
const SaltForm = (props: ISaltFormProps) => {
  const { salt, onChange } = props;

  // Function for handling instrument selection
  const changeInstrument = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
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
      {saltInstrumentsSwitcher(salt.instrument, changeInstrumentParameters)}
    </>
  );
};

export default SaltForm;
