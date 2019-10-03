import * as React from "react";
import MultiSelectField, {
  AllOption
} from "../../basicComponents/MultiSelectField";

interface IRssPolarimetryImagingProps {
  rssPolarimetryImaging?: string[];
  onSelect: (value: any) => void;
}

// Rss grating
const RSS_POLARIMETRY = ["Linear", "Linear Hi", "Circular", "All Stokes"];

/**
 * A form for selecting Rss Polarimetry Imaging-related search parameters.
 */
const RssPolarimetryImaging = (props: IRssPolarimetryImagingProps) => {
  const { onSelect, rssPolarimetryImaging } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      rssPolarimetryImaging: Array.from(values).map((t: any) => {
        return t.text;
      })
    });
  };

  return (
    <div>
      <p>RSS Polarimetry Imaging</p>
      <MultiSelectField
        name={"rssPolarimetryImaging"}
        onChange={select}
        value={rssPolarimetryImaging || ["All"]}
      >
        <AllOption />
        {RSS_POLARIMETRY.sort().map(i => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </MultiSelectField>
    </div>
  );
};

export default RssPolarimetryImaging;
