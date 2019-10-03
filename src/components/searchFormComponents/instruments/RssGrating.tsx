import * as React from "react";
import MultiSelectField, {
  AllOption
} from "../../basicComponents/MultiSelectField";

interface IRssGratingProps {
  rssGrating?: string[];
  onSelect: (value: any) => void;
}

// Rss grating
export const RSS_GRATINGS = [
  "Open",
  "PG0300",
  "PG0900",
  "PG1300",
  "PG1800",
  "PG2300",
  "PG3000"
];

/**
 * A form for selecting RssGrating-related search parameters.
 */
const RssGrating = (props: IRssGratingProps) => {
  const { onSelect, rssGrating } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      rssGrating: Array.from(values).map((t: any) => {
        return t.text;
      })
    });
  };

  return (
    <div>
      <p>RSS grating</p>
      <MultiSelectField
        name={"rssGrating"}
        onChange={select}
        value={rssGrating || ["All"]}
      >
        <AllOption />
        {RSS_GRATINGS.sort().map(i => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </MultiSelectField>
    </div>
  );
};

export default RssGrating;
