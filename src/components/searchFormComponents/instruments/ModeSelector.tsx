import * as React from "react";
import MultiSelectField, {
  AllOption
} from "../../basicComponents/MultiSelectField";

// MODES
export const COMMON_RSS_BVIT_MODES = ["Imaging"];
export const RSS_MODES = [
  "Fabry Perot",
  // "FP polarimetry",
  "MOS",
  // "MOS polarimetry",
  "Polarimetric imaging",
  "Spectropolarimetry",
  "Spectroscopy"
];
export const BVIT_MODES = ["Streaming"];

interface IModeSelectorProps {
  modes: string[];
  selectedInstruments?: string[];
  selectedTelescopes?: string[];
  onSelect: (value: any) => void;
}

const modesToDisplay = (instruments: string[], telescopes: string[]) => {
  let modes: string[] = [];
  if (
    instruments.length === 0 ||
    (instruments.some(inst => inst === "All") &&
      telescopes.some(t => t === "All" || t === "SALT"))
  ) {
    return RSS_MODES.concat(BVIT_MODES).concat(COMMON_RSS_BVIT_MODES);
  }
  if (telescopes.some(t => t === "1.9 m" || t === "Lesedi")) {
    return [];
  }
  if (instruments.some(inst => inst === "RSS")) {
    modes = modes.concat(RSS_MODES);
  }
  if (instruments.some(inst => inst === "BVIT")) {
    modes = modes.concat(BVIT_MODES);
  }
  if (instruments.some(inst => inst === "BVIT" || inst === "RSS")) {
    modes = modes.concat(COMMON_RSS_BVIT_MODES);
  }

  return modes;
};
/**
 * A form for selecting ModeSelector-related search parameters.
 */
const ModeSelector = (props: IModeSelectorProps) => {
  const { onSelect, selectedInstruments, selectedTelescopes, modes } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      modes: Array.from(values).map((t: any) => {
        return t.text;
      })
    });
  };
  const MODE_TO_DISPLAY = modesToDisplay(
    selectedInstruments || [],
    selectedTelescopes || []
  );

  return (
    <div>
      <p>Mode</p>
      <MultiSelectField
        name={"modes"}
        onChange={select}
        value={modes || ["All"]}
      >
        <AllOption />
        {MODE_TO_DISPLAY.sort().map(i => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </MultiSelectField>
    </div>
  );
};

export default ModeSelector;
