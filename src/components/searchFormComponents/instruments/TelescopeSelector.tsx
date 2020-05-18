import * as React from "react";
import MultiSelectField, {
  AllOption
} from "../../basicComponents/MultiSelectField";

interface ITelescopeSelectorProps {
  telescopes?: string[];
  onSelect: (value: any) => void;
}

// const TELESCOPES = ["SALT", "1.9 m", "Lesedi"];
const TELESCOPES = ["SALT"];
/**
 * A form for selecting telescope names.
 */
const TelescopeSelector = (props: ITelescopeSelectorProps) => {
  const { onSelect, telescopes } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      telescopes: Array.from(values).map((t: any) => {
        return t.text;
      })
    });
  };

  return (
    <div>
      <p>Telescope</p>
      <MultiSelectField
        name={"telescopes"}
        onChange={select}
        value={telescopes || ["All"]}
      >
        <AllOption />
        {TELESCOPES.sort().map(i => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </MultiSelectField>
    </div>
  );
};

export default TelescopeSelector;
