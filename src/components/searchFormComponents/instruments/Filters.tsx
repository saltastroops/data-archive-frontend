import * as React from "react";
import MultiSelectField, {
  AllOption
} from "../../basicComponents/MultiSelectField";

const COMMON_ALL_FILTERS = ["H-alpha"];
const HIPPO_SHOC_SPUPNIC_BVIT_FILTERS = ["B", "R", "U", "V"];

/**
 * The list of Salticam filters which can be searched for.
 */
const SALTICAM_FILTERS = [
  "Johnson U",
  "Johnson B",
  "Johnson V",
  "Cousins R",
  "Cousins I",
  "380nm 40nm FWHM",
  "340nm 35nm FWHM",
  "Fused silica clear",
  "SDSS u'",
  "SDSS g'",
  "SDSS r'",
  "SDSS i'",
  "SDSS z'",
  "Stroemgren u",
  "Stroemgren b",
  "Stroemgren v",
  "Stroemgren y",
  "H-beta wide",
  "H-beta narrow",
  "SRE 1",
  "SRE 2",
  "SRE 3",
  "SRE 4"
];

interface IFiltersProps {
  filters: string[];
  instruments?: string[];
  onSelect: (value: any) => void;
}

const filtersToDisplay = (instrumentsList: string[]) => {
  let filters: string[] = [];
  if (
    instrumentsList.length === 0 ||
    instrumentsList.some(inst => inst === "All")
  ) {
    return SALTICAM_FILTERS.concat(HIPPO_SHOC_SPUPNIC_BVIT_FILTERS).concat(
      COMMON_ALL_FILTERS
    );
  }
  if (
    instrumentsList.some(
      inst =>
        inst === "BVIT" ||
        inst === "SpUpNIC" ||
        inst === "SHOC" ||
        inst === "HIPPO"
    )
  ) {
    filters = filters.concat(HIPPO_SHOC_SPUPNIC_BVIT_FILTERS);
  }
  if (instrumentsList.some(inst => inst === "Salticam")) {
    filters = filters.concat(SALTICAM_FILTERS);
  }
  if (
    instrumentsList.some(
      inst =>
        inst === "Salticam" ||
        inst === "BVIT" ||
        inst === "SpUpNIC" ||
        inst === "SHOC" ||
        inst === "HIPPO"
    )
  ) {
    filters = filters.concat(COMMON_ALL_FILTERS);
  }

  return filters;
};
/**
 * A form for selecting Filters-related search parameters.
 */
const Filters = (props: IFiltersProps) => {
  const { onSelect, instruments, filters } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      filters: Array.from(values).map((t: any) => {
        return t.text;
      })
    });
  };
  const FILTERS_TO_DISPLAY = filtersToDisplay(instruments || []);

  return (
    <div>
      <p>Filters</p>
      <MultiSelectField
        name={"filters"}
        onChangeCapture={select}
        value={filters || ["All"]}
        onChange={() => {
          /*Do nothing*/
        }}
      >
        <AllOption />
        {FILTERS_TO_DISPLAY.sort().map(i => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </MultiSelectField>
    </div>
  );
};

export default Filters;
