import * as React from "react";
import MultiSelectField, {
  AllOption,
} from "../../basicComponents/MultiSelectField";

// DETECTOR MODE
export const COMMON_DETECTOR_MODES = [
  "Normal",
  "Frame Transfer",
  "Slot Mode",
  "Drift Scan",
];

export const RSS_DETECTOR_MODES = ["Shuffle"];
export const SALTICAM_DETECTOR_MODES = [];

interface IDetectorModeSelectorProps {
  detectorModes: string[];
  selectedInstruments?: string[];
  selectedTelescopes?: string[];
  onSelect: (value: any) => void;
}

const detectorModeToDisplay = (instruments: string[], telescopes: string[]) => {
  let detectorModes: string[] = [];
  if (
    instruments.length === 0 ||
    (instruments.some((inst) => inst === "All") &&
      telescopes.some((t) => t === "All" || t === "SALT"))
  ) {
    return RSS_DETECTOR_MODES.concat(SALTICAM_DETECTOR_MODES).concat(
      COMMON_DETECTOR_MODES
    );
  }
  if (telescopes.some((t) => t === "1.9 m" || t === "Lesedi")) {
    return [];
  }
  if (instruments.some((inst) => inst === "RSS")) {
    detectorModes = detectorModes.concat(RSS_DETECTOR_MODES);
  }
  if (instruments.some((inst) => inst === "Salticam")) {
    detectorModes = detectorModes.concat(SALTICAM_DETECTOR_MODES);
  }
  if (instruments.some((inst) => inst === "Salticam" || inst === "RSS")) {
    detectorModes = detectorModes.concat(COMMON_DETECTOR_MODES);
  }

  return detectorModes;
};
/**
 * A form for selecting DetectorModeSelector-related search parameters.
 */
const DetectorModeSelector = (props: IDetectorModeSelectorProps) => {
  const {
    onSelect,
    selectedInstruments,
    selectedTelescopes,
    detectorModes,
  } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      detectorModes: Array.from(values).map((t: any) => {
        return t.text;
      }),
    });
  };
  const DETECTOR_MODE_TO_DISPLAY = detectorModeToDisplay(
    selectedInstruments || [],
    selectedTelescopes || []
  );

  return (
    <div>
      <p>Detector mode</p>
      <MultiSelectField
        name="detectorModes"
        onChange={select}
        value={detectorModes || ["All"]}
      >
        <AllOption />
        {DETECTOR_MODE_TO_DISPLAY.sort().map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </MultiSelectField>
    </div>
  );
};

export default DetectorModeSelector;
