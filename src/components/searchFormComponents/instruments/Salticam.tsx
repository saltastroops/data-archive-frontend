import * as React from "react";
import { ISalticam } from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import { ISalticamFilter, SalticamFilter } from "../../../utils/SalticamFilter";

interface ISalticamProps {
  onChange: (value: any) => void;
  salticam: ISalticam;
}

/**
 * The list of Salticam filters which can be searched for.
 */
export const salticamFilters: ISalticamFilter[] = [
  { name: "U-S1", descriptiveName: "Johnson U" },
  { name: "B-S1", descriptiveName: "Johnson B" },
  { name: "V-S1", descriptiveName: "Johnson V" },
  { name: "R-S1", descriptiveName: "Cousins R" },
  { name: "I-S1", descriptiveName: "Cousins I" },
  { name: "380-40", descriptiveName: "380nm 40nm FWHM" },
  { name: "340-35", descriptiveName: "340nm 35nm FWHM" },
  { name: "CLR-S1", descriptiveName: "Fused silica clear" },
  { name: "SDSSu-S1", descriptiveName: "SDSS u'" },
  { name: "SDSSg-S1", descriptiveName: "SDSS g'" },
  { name: "SDSSr-S1", descriptiveName: "SDSS r'" },
  { name: "SDSSi-S1", descriptiveName: "SDSS i'" },
  { name: "SDSSz-S1", descriptiveName: "SDSS z'" },
  { name: "Su-S1", descriptiveName: "Stroemgren u" },
  { name: "Sb-S1", descriptiveName: "Stroemgren b" },
  { name: "Sv-S1", descriptiveName: "Stroemgren v" },
  { name: "Sy-S1", descriptiveName: "Stroemgren y" },
  { name: "Halpha-S1", descriptiveName: "H-alpha" },
  { name: "Hbw-S1", descriptiveName: "H-beta wide" },
  { name: "Hbn-S1", descriptiveName: "H-beta narrow" },
  { name: "SR613-21", descriptiveName: "SRE 1" },
  { name: "SR708-25", descriptiveName: "SRE 2" },
  { name: "SR815-29", descriptiveName: "SRE 3" },
  { name: "SR862-32", descriptiveName: "SRE 4" }
];

/**
 * A form for selecting Salticam-related search parameters.
 */
const Salticam = (props: ISalticamProps) => {
  const { onChange, salticam } = props;

  // Function for handling change events
  const change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    onChange({
      ...salticam,
      [name]: value
    });
  };

  const detectorModes = ["Normal", "Slot Mode", "Drift Scan", "Frame Transfer"];

  return (
    <MainGrid>
      {/* Detector mode */}
      <SubGrid>
        <p>Detector Mode</p>
        <SelectField
          name="detectorMode"
          value={salticam.detectorMode}
          onChange={change}
        >
          <AnyOption />
          {detectorModes.map(detectorMode => (
            <option key={detectorMode} value={detectorMode}>
              {detectorMode}
            </option>
          ))}
        </SelectField>
      </SubGrid>

      {/* Filter */}
      <SubGrid>
        <p>Filter</p>
        <SelectField name={"filter"} value={salticam.filter} onChange={change}>
          <AnyOption />
          {salticamFilters.map(filter => (
            <option key={filter.name} value={filter.name}>
              {filter.descriptiveName}
            </option>
          ))}
        </SelectField>
      </SubGrid>
    </MainGrid>
  );
};

export default Salticam;
