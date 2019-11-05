import * as React from "react";
import MultiSelectField, {
  AllOption
} from "../../basicComponents/MultiSelectField";

// MODES
export const COMMON_RSS_BVIT_MODES = ["Imaging"];
export const RSS_MODES = [
  "Fabry Perot",
  // "FP Polarimetry",
  "MOS",
  // "MOS Polarimetry",
  "Polarimetric Imaging",
  "Spectropolarimetry",
  "Spectroscopy"
];
export const BVIT_MODES = ["Streaming"];

interface IInstrumentModeSelectorProps {
  instrumentModes: string[];
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
const InstrumentModeSelector = (props: IInstrumentModeSelectorProps) => {
  const {
    onSelect,
    selectedInstruments,
    selectedTelescopes,
    instrumentModes
  } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      instrumentModes: Array.from(values).map((t: any) => {
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
        name={"instrumentModes"}
        onChange={select}
        value={instrumentModes || ["All"]}
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

export default InstrumentModeSelector;
