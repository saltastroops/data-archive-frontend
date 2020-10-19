import * as React from "react";
import MultiSelectField, {
  AllOption,
} from "../../basicComponents/MultiSelectField";

interface IHrsModeProps {
  hrsModes?: string[];
  onSelect: (value: any) => void;
}

const HRS_MODES = [
  "Low Resolution",
  "Medium Resolution",
  "High Resolution",
  "High Stability",
  "Int Cal Fibre",
];
/**
 * A form for selecting HrsMode-related search parameters.
 */
const HrsMode = (props: IHrsModeProps) => {
  const { onSelect, hrsModes } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      hrsModes: Array.from(values).map((t: any) => {
        return t.text;
      }),
    });
  };

  return (
    <div>
      <p>HRS mode</p>
      <MultiSelectField
        name={"hrsMode"}
        onChange={select}
        value={hrsModes || ["All"]}
      >
        <AllOption />
        {HRS_MODES.sort().map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </MultiSelectField>
    </div>
  );
};

export default HrsMode;
