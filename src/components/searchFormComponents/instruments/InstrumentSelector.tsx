import * as React from "react";
import { InstrumentName } from "../../../utils/ObservationQueryParameters";
import MultiSelectField, {
  AllOption
} from "../../basicComponents/MultiSelectField";

// Instruments
// const SAAO_INSTRUMENTS: InstrumentName[] = ["SpUpNIC", "SHOC", "HIPPO"];
const SALT_INSTRUMENTS: InstrumentName[] = ["Salticam", "RSS", "HRS", "BVIT"];

interface IInstrumentSelectorProps {
  instruments: string[];
  selectedTelescopes?: string[];
  onSelect: (value: any) => void;
}

const instrumentsToDisplay = (telescopes: string[]) => {
  // let instruments: InstrumentName[] = [];

  // if (telescopes.length === 0 || telescopes.some(t => "All" === t)) {
  //   return SALT_INSTRUMENTS.concat(SAAO_INSTRUMENTS);
  // }
  // if (
  //   telescopes.length === 0 ||
  //   telescopes.some(t => "All" === t) ||
  //   telescopes.some(t => "SALT" === t)
  // ) {
  //   instruments = instruments.concat(SALT_INSTRUMENTS);
  // }
  // if (telescopes.some(t => "1.9 m" === t || t === "Lesedi")) {
  //   instruments = instruments.concat(SAAO_INSTRUMENTS);
  // }
  return SALT_INSTRUMENTS; // .concat(SAAO_INSTRUMENTS);
};
/**
 * A form for selecting InstrumentsSelector-related search parameters.
 */
const InstrumentSelector = (props: IInstrumentSelectorProps) => {
  const { onSelect, instruments, selectedTelescopes } = props;

  // Function for handling change events
  const select = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const values = e.currentTarget.selectedOptions;
    onSelect({
      instruments: Array.from(values).map((t: any) => {
        return t.text;
      })
    });
  };
  const FILTERS_TO_DISPLAY = instrumentsToDisplay(selectedTelescopes || []);

  return (
    <div>
      <p>Instruments </p>
      <MultiSelectField
        name={"instruments"}
        onChange={select}
        value={instruments || ["All"]}
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

export default InstrumentSelector;
