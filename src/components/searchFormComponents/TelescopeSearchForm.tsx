import * as React from "react";
import {
  InnerItem,
  InnerItemLabel,
  MainGrid,
  SubGrid
} from "../basicComponents/Grids";
import SelectField from "../basicComponents/SelectField";

interface ITelescopeSearchForm {
  telescopes: string[];
  instruments: string[];
  selectedTelescope: string;
  selectedInstrument: string;
  onChange: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}

const TelescopeSearchForm = (props: ITelescopeSearchForm) => {
  const {
    telescopes,
    instruments,
    selectedInstrument,
    selectedTelescope,
    onChange
  } = props;

  if (selectedTelescope !== "any") {
    return (
      <>
        <MainGrid>
          <SubGrid>
            <InnerItemLabel>
              <p>Telescope</p>
            </InnerItemLabel>
            <InnerItem>
              <SelectField
                options={telescopes}
                name={"telescope"}
                onChange={onChange}
                value={selectedTelescope}
              />
            </InnerItem>
          </SubGrid>
          <SubGrid>
            <InnerItemLabel>
              <p>Instrument</p>
            </InnerItemLabel>
            <InnerItem>
              <SelectField
                options={instruments}
                name={"instrument"}
                onChange={onChange}
                value={selectedInstrument}
              />
            </InnerItem>
          </SubGrid>
        </MainGrid>
      </>
    );
  }

  return (
    <>
      <MainGrid>
        <SubGrid>
          <InnerItemLabel>
            <p>Telescope</p>
          </InnerItemLabel>
          <InnerItem>
            <SelectField
              options={telescopes}
              name={"telescope"}
              onChange={onChange}
              value={selectedTelescope}
            />
          </InnerItem>
        </SubGrid>
      </MainGrid>
    </>
  );
};
export default TelescopeSearchForm;
