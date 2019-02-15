import * as React from "react";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField from "../../basicComponents/SelectField2";
import Bvit from "../instruments/Bvit";
import Hrs from "../instruments/Hrs";
import Rss from "../instruments/Rss";
import Salticam from "../instruments/Salticam";
import { saltInstrumentsSwitcher } from "./SaltForm";

export const oneNineMInstrumentsSwitcher = (
  details: any,
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void
) => {
  const instrument = details.name;
  switch (instrument) {
    case "SpupMic": {
      return <Rss details={details} onChange={onChange} />;
    }
    case "Hippo": {
      return <Hrs details={details} onChange={onChange} />;
    }
    case "Shoc": {
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
  return (
    <>
      <MainGrid>
        <SubGrid>
          <p>Instrument</p>
          <SelectField
            options={["any", "Hippo", "Shoc", "SpupMic"]}
            name={"instrument"}
            onChange={changeInstrument}
          />
        </SubGrid>
      </MainGrid>
      {oneNineMInstrumentsSwitcher(details, changeMode)}
    </>
  );
};

export default OneNineMForm;