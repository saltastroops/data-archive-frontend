import * as React from "react";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import Bvit from "../instruments/Bvit";
import Hrs from "../instruments/Hrs";
import Rss from "../instruments/Rss";
import Salticam from "../instruments/Salticam";

export const saltInstrumentsSwitcher = (
  details: any,
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void
) => {
  const instrument = details.name;
  switch (instrument) {
    case "RSS": {
      return <Rss details={details} onChange={onChange} />;
    }
    case "HRS": {
      return <Hrs details={details} onChange={onChange} />;
    }
    case "BVIT": {
      return <Bvit details={details} onChange={onChange} />;
    }
    case "SALTICAM": {
      return <Salticam details={details} onChange={onChange} />;
    }
    default:
      return <></>;
  }
};

const SaltForm = (props: any) => {
  const { details, onChange } = props;
  const changeInstrument = (e: React.FormEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    onChange({ name: value });
  };
  const changeMode = (value: any) => {
    onChange({
      ...details,
      ...value
    });
  };
  const instruments = ["HRS", "RSS", "BVIT", "Salticam"];
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
      {saltInstrumentsSwitcher(details, changeMode)}
    </>
  );
};

export default SaltForm;
