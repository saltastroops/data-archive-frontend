import * as React from "react";
import {
  InnerItem,
  InnerItemLabel,
  MainGrid,
  SubGrid
} from "../../basicComponents/Grids";
import SelectField from "../../basicComponents/SelectField2";

interface IHrs {
  selectedMode: string;
  onChange: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}
interface IHrsMode {
  selectedMode: string;
  onChange: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}

const Hrs = (props: any) => {
  const { onChange, details } = props;
  const change = (e: React.FormEvent<HTMLSelectElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    onChange({
      ...details,
      ...details.instrument,
      [name]: value
    });
  };
  return (
    <MainGrid>
      <SubGrid>
        <p>Mode</p>
        <SelectField
          options={[
            "any",
            "HIGH RESOLUTION",
            "HIGH STABILITY",
            "INT CAL FIBRE",
            "LOW RESOLUTION",
            "MEDIUM RESOLUTION"
          ]}
          name={"mode"}
          onChange={change}
        />
      </SubGrid>
    </MainGrid>
  );
};
export default Hrs;
