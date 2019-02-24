import * as React from "react";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import Bvit from "../instruments/Bvit";
import Hrs from "../instruments/Hrs";
import Rss from "../instruments/Rss";

export const oneNineMInstrumentsSwitcher = (
  details: any,
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void
) => {
  const instrument = details.name;
  switch (instrument) {
    case "SpUpNIC": {
      return <Rss details={details} onChange={onChange} />;
    }
    case "HIPPO": {
      return <Hrs details={details} onChange={onChange} />;
    }
    case "SHOC": {
      return <Bvit details={details} onChange={onChange} />;
    }
    default:
      return <></>;
  }
};

const OneNineMForm = (props: any) => {
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
  const instruments = ["HIPPO", "SHOC", "SpUpNIC"];
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
      {oneNineMInstrumentsSwitcher(details, changeMode)}
    </>
  );
};

export default OneNineMForm;
