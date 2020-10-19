import * as React from "react";
import MultiSelectField, {
  AllOption,
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
  "Stroemgren u",
  "Stroemgren b",
  "Stroemgren v",
  "Stroemgren y",
  "H-beta wide",
  "H-beta narrow",
  "SRE 1",
  "SRE 2",
  "SRE 3",
  "SRE 4",
];

const RSS_FILTERS = [
  "Halpha-S1",
  "Hbn-S1",
  "Hbw-S1",
  "pc00000",
  "pc03200",
  "pc03400",
  "pc03850",
  "pc04600",
  "pi04340",
  "pi04400",
  "pi04465",
  "pi04530",
  "pi04600",
  "pi04670",
  "pi04740",
  "pi04820",
  "pi04895",
  "pi04975",
  "pi05060",
  "pi05145",
  "pi05235",
  "pi05325",
  "pi05420",
  "pi05520",
  "pi05620",
  "pi05725",
  "pi05830",
  "pi05945",
  "pi06055",
  "pi06170",
  "pi06290",
  "pi06410",
  "pi06530",
  "pi06645",
  "pi06765",
  "pi06885",
  "pi07005",
  "pi07130",
  "pi07260",
  "pi07390",
  "pi07535",
  "pi07685",
  "pi07840",
  "pi08005",
  "pi08175",
  "pi08350",
  "pi08535",
  "pi08730",
  "S-SDSS-g",
  "S-SDSS-i",
  "S-SDSS-r",
  "S-SDSS-u",
  "S-SDSS-z",
  "Sb-S1",
  "SCAM-B",
  "SCAM-I",
  "SCAM-R",
  "SCAM-U",
  "SCAM-V",
  "SCAM340-35",
  "SCAM380-40",
  "SR613-21",
  "SR708-25",
  "SR815-29",
  "SR862-32",
  "Su-S1",
  "Sv-S1",
  "Sy-S1",
];

const RSS_SCAM_FILTERS = ["SDSS r'", "SDSS i'", "SDSS z'"];

interface IFiltersProps {
  filters: string[];
  instruments?: string[];
  onSelect: (value: any) => void;
}

const filtersToDisplay = (instrumentsList: string[]) => {
  let filters: string[] = [];
  if (
    instrumentsList.length === 0 ||
    instrumentsList.some((inst) => inst === "All")
  ) {
    return SALTICAM_FILTERS.concat(HIPPO_SHOC_SPUPNIC_BVIT_FILTERS)
      .concat(RSS_FILTERS)
      .concat(RSS_SCAM_FILTERS)
      .concat(COMMON_ALL_FILTERS);
  }
  if (
    instrumentsList.some(
      (inst) =>
        inst === "BVIT" ||
        inst === "SpUpNIC" ||
        inst === "SHOC" ||
        inst === "HIPPO"
    )
  ) {
    filters = filters.concat(HIPPO_SHOC_SPUPNIC_BVIT_FILTERS);
  }
  if (instrumentsList.some((inst) => inst === "Salticam")) {
    filters = filters.concat(SALTICAM_FILTERS);
  }
  if (instrumentsList.some((inst) => inst === "RSS")) {
    filters = filters.concat(RSS_FILTERS);
  }
  if (instrumentsList.some((inst) => inst === "Salticam" || inst === "RSS")) {
    filters = filters.concat(RSS_SCAM_FILTERS);
  }
  if (
    instrumentsList.some(
      (inst) =>
        inst === "Salticam" ||
        inst === "RSS" ||
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
      }),
    });
  };
  const FILTERS_TO_DISPLAY = filtersToDisplay(instruments || []);

  return (
    <div>
      <p>Filters</p>
      <MultiSelectField
        name={"filters"}
        onChange={select}
        value={filters || ["All"]}
      >
        <AllOption />
        {FILTERS_TO_DISPLAY.sort().map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </MultiSelectField>
    </div>
  );
};

export default Filters;
