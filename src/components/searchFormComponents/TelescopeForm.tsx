import * as React from "react";
import { ITelescope } from "../../utils/ObservationQueryParameters";
import { SubGrid6 } from "../basicComponents/Grids";
import DetectorModeSelector from "./instruments/DetectorModeSelector";
import FabryPerot from "./instruments/FabryPerot";
import Filters from "./instruments/Filters";
import HrsMode from "./instruments/HrsMode";
import InstrumentsSelector from "./instruments/InstrumentsSelector";
import ModeSelector from "./instruments/ModeSelector";
import RssGrating from "./instruments/RssGrating";
import RssPolarimetryImaging from "./instruments/RssPolarimetryImaging";
import TelescopeSelector from "./instruments/TelescopeSelector";

interface ITelescopeFormProps {
  telescope: ITelescope;
  onChange: (value: any) => void;
}

/**
 * A form for selecting telescope-related search parameters.
 */
class TelescopeForm extends React.Component<ITelescopeFormProps, {}> {
  render() {
    const { telescope, onChange } = this.props;
    const selectedTelescopes =
      telescope.telescopes.length > 0 ? telescope.telescopes : ["All"];
    const selectedInstruments = telescope.instruments || ["All"];
    const selectedModes: string[] = telescope.modes || ["All"];
    const selectedDetectorMode = telescope.detectorMode || ["All"];
    const selectedFilters: string[] = telescope.filters || ["All"];

    // Function for updating telescope-related parameters
    const mainSelected = (telescopes: string[]) => {
      onChange(telescopes);
    };

    const onSelect = (newSelection: any) => {
      onChange({
        ...telescope,
        ...newSelection
      });
    };

    return (
      <>
        <SubGrid6>
          <TelescopeSelector
            onSelect={mainSelected}
            telescopes={selectedTelescopes}
          />

          <InstrumentsSelector
            onSelect={mainSelected}
            selectedTelescopes={selectedTelescopes}
            instruments={selectedInstruments}
          />

          <ModeSelector
            modes={selectedModes}
            selectedTelescopes={selectedTelescopes}
            selectedInstruments={selectedInstruments}
            onSelect={onSelect}
          />

          <DetectorModeSelector
            detectorMode={selectedDetectorMode}
            selectedTelescopes={selectedTelescopes}
            selectedInstruments={selectedInstruments}
            onSelect={onSelect}
          />

          <Filters
            onSelect={onSelect}
            instruments={selectedInstruments}
            filters={selectedFilters}
          />
          {selectedInstruments.some((t: string) => t === "HRS") && (
            <HrsMode hrsMode={telescope.hrsMode} onSelect={onSelect} />
          )}
        </SubGrid6>
        <SubGrid6>
          {selectedModes.some(mode => mode === "Fabry Perot") && (
            <FabryPerot onSelect={onSelect} fabryPerot={telescope.fabryPerot} />
          )}
          {selectedModes.some(
            mode =>
              mode === "MOS" ||
              mode === "Spectropolarimetry" ||
              mode === "Spectroscopy"
          ) && (
            <RssGrating onSelect={onSelect} rssGrating={telescope.rssGrating} />
          )}
          {selectedModes.some(
            mode =>
              mode === "Polarimetric imaging" ||
              mode === "Spectropolarimetry" ||
              mode === "Spectroscopy"
          ) && (
            <RssPolarimetryImaging
              onSelect={onSelect}
              rssPolarimetryImaging={telescope.rssPolarimetryImaging}
            />
          )}
        </SubGrid6>
      </>
    );
  }
}

/**
 * Validate the given telescope-related search parameters and, if need be, add
 * error messages to them.
 */
export const validatedTelescope = (telescope?: ITelescope) => {
  if (telescope) {
    return {
      ...telescope,
      errors: {}
    };
  } else {
    return telescope;
  }
};

export default TelescopeForm;
