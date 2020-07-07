import * as React from "react";
import { ITelescope } from "../../utils/ObservationQueryParameters";
import { TelescopeDetailsGrid } from "../basicComponents/Grids";
import DetectorModeSelector from "./instruments/DetectorModeSelector";
import Filters from "./instruments/Filters";
import HrsMode from "./instruments/HrsMode";
import InstrumentModeSelector from "./instruments/InstrumentModeSelector";
import InstrumentSelector from "./instruments/InstrumentSelector";
import RssFabryPerotModeSelector from "./instruments/RssFabryPerotModeSelector";
import RssGratingSelector from "./instruments/RssGratingSelector";
import RssPolarimetryModeSelector from "./instruments/RssPolarimetryModeSelector";
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
      telescope.telescopes && telescope.telescopes.length > 0
        ? telescope.telescopes
        : ["All"];
    const selectedInstruments = telescope.instruments || ["All"];
    const selectedInstrumentModes: string[] = telescope.instrumentModes || [
      "All"
    ];
    const selectedDetectorMode = telescope.detectorModes || ["All"];
    const selectedFilters: string[] = telescope.filters || ["All"];

    const onSelect = (newSelection: any) => {
      onChange({
        ...telescope,
        ...newSelection
      });
    };

    return (
      <>
        <TelescopeDetailsGrid>
          <TelescopeSelector
            onSelect={onSelect}
            telescopes={selectedTelescopes}
          />

          <InstrumentSelector
            onSelect={onSelect}
            selectedTelescopes={selectedTelescopes}
            instruments={selectedInstruments}
          />

          <InstrumentModeSelector
            instrumentModes={selectedInstrumentModes}
            selectedTelescopes={selectedTelescopes}
            selectedInstruments={selectedInstruments}
            onSelect={onSelect}
          />

          <DetectorModeSelector
            detectorModes={selectedDetectorMode}
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
            <HrsMode hrsModes={telescope.hrsModes} onSelect={onSelect} />
          )}
          {selectedInstrumentModes.some(mode => mode === "Fabry Perot") &&
            !selectedInstruments.find(
              (t: string) => t === "HRS" || t === "BVIT" || t === "Salticam"
            ) && (
              <RssFabryPerotModeSelector
                onSelect={onSelect}
                rssFabryPerotModes={telescope.rssFabryPerotModes}
              />
            )}
          {selectedInstrumentModes.some(
            mode =>
              mode === "MOS" ||
              mode === "Spectropolarimetry" ||
              mode === "Spectroscopy"
          ) &&
            !selectedInstruments.find(
              (t: string) => t === "HRS" || t === "BVIT" || t === "Salticam"
            ) && (
              <RssGratingSelector
                onSelect={onSelect}
                rssGratings={telescope.rssGratings}
              />
            )}
          {selectedInstrumentModes.some(
            mode =>
              mode === "Polarimetric Imaging" || mode === "Spectropolarimetry"
          ) &&
            !selectedInstruments.find(
              (t: string) => t === "HRS" || t === "BVIT" || t === "Salticam"
            ) && (
              <RssPolarimetryModeSelector
                onSelect={onSelect}
                rssPolarimetryModes={telescope.rssPolarimetryModes}
              />
            )}
        </TelescopeDetailsGrid>
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
