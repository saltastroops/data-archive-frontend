import * as React from "react";
import MultiSelectField, {
  AllOption
} from "../../basicComponents/MultiSelectField";

interface IFabryPerotProps {
  fabryPerot?: string[];
  onSelect: (value: any) => void;
}

export const FABRY_PEROT = [
  "Low resolution",
  "Medium resolution",
  "High resolution",
  "Tunable filter"
];
/**
 * A form for selecting FabryPerot-related search parameters.
 */
const FabryPerot = (props: IFabryPerotProps) => {
  const { onSelect, fabryPerot } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      fabryPerot: Array.from(values).map((t: any) => {
        return t.text;
      })
    });
  };

  return (
    <div>
      <p>Fabry perot</p>
      <MultiSelectField
        name={"fabryPerot"}
        onChange={select}
        value={fabryPerot || ["All"]}
      >
        <AllOption />
        {FABRY_PEROT.sort().map(i => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </MultiSelectField>
    </div>
  );
};

export default FabryPerot;
