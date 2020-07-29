import * as React from "react";
import MultiSelectField, {
  AllOption
} from "../../basicComponents/MultiSelectField";

interface IRssGratingSelectorProps {
  rssGratings?: string[];
  onSelect: (value: any) => void;
}

// Rss grating
export const RSS_GRATINGS = [
  "Open",
  "pg0300",
  "pg0900",
  "pg1300",
  "pg1800",
  "pg2300",
  "pg3000"
];

/**
 * A form for selecting RssGrating-related search parameters.
 */
const RssGratingSelector = (props: IRssGratingSelectorProps) => {
  const { onSelect, rssGratings } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      rssGratings: Array.from(values).map((t: any) => {
        return t.text;
      })
    });
  };

  return (
    <div>
      <p>RSS grating</p>
      <MultiSelectField
        name={"rssGratings"}
        onChange={select}
        value={rssGratings || ["All"]}
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

export default RssGratingSelector;
