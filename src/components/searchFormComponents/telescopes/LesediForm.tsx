import * as React from "react";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField from "../../basicComponents/SelectField";
import Bvit from "../instruments/Bvit";
import Hrs from "../instruments/Hrs";
import Rss from "../instruments/Rss";

export const lesediInstrumentsSwitcher = (
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

const LesediForm = (props: any) => {
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
      {lesediInstrumentsSwitcher(details, changeMode)}
    </>
  );
};

export default LesediForm;
