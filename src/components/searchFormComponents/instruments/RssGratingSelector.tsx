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
const RssGratingSelector = (props: IRssGratingSelectorProps) => {
  const { onSelect, rssGratings } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      rssGratings: Array.from(values).map((t: any) => {
        return t.text.toLowerCase();
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
          <option key={i.toLowerCase()} value={i.toLowerCase()}>
            {i}
          </option>
        ))}
      </MultiSelectField>
    </div>
  );
};

export default RssGratingSelector;
