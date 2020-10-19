import * as React from "react";
import MultiSelectField, {
  AllOption,
} from "../../basicComponents/MultiSelectField";

interface IRssPolarimetryModeSelectorProps {
  rssPolarimetryModes?: string[];
  onSelect: (value: any) => void;
}

// Rss grating
const RSS_POLARIMETRY = ["Linear", "Linear Hi", "Circular", "All Stokes"];

/**
 * A form for selecting Rss Polarimetry Imaging-related search parameters.
 */
const RssPolarimetryModeSelector = (
  props: IRssPolarimetryModeSelectorProps
) => {
  const { onSelect, rssPolarimetryModes } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      rssPolarimetryModes: Array.from(values).map((t: any) => {
        return t.text;
      }),
    });
  };

  return (
    <div>
      <p>RSS polarimetry mode</p>
      <MultiSelectField
        name={"rssPolarimetry"}
        onChange={select}
        value={rssPolarimetryModes || ["All"]}
      >
        <AllOption />
        {RSS_POLARIMETRY.sort().map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </MultiSelectField>
    </div>
  );
};

export default RssPolarimetryModeSelector;
