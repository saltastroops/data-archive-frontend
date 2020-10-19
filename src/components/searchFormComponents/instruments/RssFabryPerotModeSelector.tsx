import * as React from "react";
import MultiSelectField, {
  AllOption,
} from "../../basicComponents/MultiSelectField";

interface IFabryPerotModeProps {
  rssFabryPerotModes?: string[];
  onSelect: (value: any) => void;
}

export const FABRY_PEROT_MODES = [
  "Low Resolution",
  "Medium Resolution",
  "High Resolution",
  "Tunable Filter",
];
/**
 * A form for selecting the Fabry Perot mode.
 */
const RssFabryPerotModeSelector = (props: IFabryPerotModeProps) => {
  const { onSelect, rssFabryPerotModes } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      rssFabryPerotModes: Array.from(values).map((t: any) => {
        return t.text;
      }),
    });
  };

  return (
    <div>
      <p>Fabry perot</p>
      <MultiSelectField
        name={"fabryPerotModes"}
        onChange={select}
        value={rssFabryPerotModes || ["All"]}
      >
        <AllOption />
        {FABRY_PEROT_MODES.sort().map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </MultiSelectField>
    </div>
  );
};

export default RssFabryPerotModeSelector;
