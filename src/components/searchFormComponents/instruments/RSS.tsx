import * as React from "react";
import { ChangeEvent } from "react";
import {
  IRSS,
  IRSSModes,
  RSSFabryPerotMode,
  RSSGrating,
  RSSInstrumentMode,
  RSSPolarimetryMode
} from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import PolarimetryModesSelector from "../PolarimetryModesSelector";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";
import styled from "styled-components";

interface IRssProps {
  rss: IRSS;
  onChange: (value: any) => void;
}

type OnChangeFunction = (value: string) => void;

const ModePropertiesDiv = styled.div`
  p:not(:first-of-type) {
    margin-top: 10px;
  }
`;

/**
 * A form selecting RSS-related search parameters.
 */
const RSS = (props: IRssProps) => {
  const { onChange, rss } = props;
  const modes: IRSSModes = rss.modes || {
    errors: {},
    names: new Set<RSSInstrumentMode>()
  };
  const modeNames = modes.names || new Set<RSSInstrumentMode>();

  const change = (name: string, value: any) => {
    onChange({
      ...rss,
      [name]: value
    });
  };

  /**
   * Handle an instrument change. All properties related to the (previous)
   * instrument are deleted.
   */
  const onModeChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Update the selected mode names
    const updatedModeNames = new Set<RSSInstrumentMode>(modes.names);
    if (e.target.checked) {
      updatedModeNames.add(e.target.name as RSSInstrumentMode);
    } else {
      updatedModeNames.delete(e.target.name as RSSInstrumentMode);
    }

    // Update the modes
    const updatedModes = {
      ...modes,
      names: updatedModeNames
    };
    if (!hasFabryPerotMode) delete updatedModes.fabryPerotMode;
    if (!hasGrating) delete updatedModes.grating;
    if (!hasPolarimetryModes) delete updatedModes.polarimetryModes;

    onChange({
      errors: {
        ...rss.errors
      },
      modes: updatedModes
    });
  };

  const hasFabryPerotMode =
    modeNames.has("Fabry Perot") || modeNames.has("FP polarimetry");

  const hasGrating =
    modeNames.has("Spectroscopy") ||
    modeNames.has("Spectropolarimetry") ||
    modeNames.has("MOS") ||
    modeNames.has("MOS polarimetry");

  const hasPolarimetryModes =
    modeNames.has("Polarimetric imaging") ||
    modeNames.has("Spectropolarimetry") ||
    modeNames.has("MOS polarimetry") ||
    modeNames.has("FP polarimetry");

  const modesPropertyChange = (property: string, value: any) => {
    onChange({
      ...rss,
      modes: {
        ...rss.modes,
        [property]: value
      }
    });
  };

  const instrumentModes: RSSInstrumentMode[] = [
    "Fabry Perot",
    "FP polarimetry",
    "Imaging",
    "MOS",
    "MOS polarimetry",
    "Polarimetric imaging",
    "Spectropolarimetry",
    "Spectroscopy"
  ];

  const detectorModes = [
    "Normal",
    "Frame Transfer",
    "Slot Mode",
    "Shuffle",
    "Drift Scan"
  ];

  return (
    <>
      <MainGrid>
        <SubGrid>
          <p>Mode</p>
          {instrumentModes.map(m => (
            <div key={m}>
              <label>
                <LargeCheckbox
                  name={m}
                  type="checkbox"
                  checked={modeNames.has(m)}
                  onChange={onModeChange}
                />
                {m}
              </label>
            </div>
          ))}
        </SubGrid>
        <SubGrid>
          <ModePropertiesDiv>
            {/* Detector mode */}
            <p>Detector Mode</p>
            <SelectField
              name={"detectorMode"}
              value={rss.detectorMode}
              onChange={e => change("detectorMode", e.target.value)}
            >
              <AnyOption />
              {detectorModes.map(detectorMode => (
                <option key={detectorMode} value={detectorMode}>
                  {detectorMode}
                </option>
              ))}
            </SelectField>

            {/* Grating */}
            {hasGrating && (
              <>
                <p>Grating</p>
                <GratingSelect
                  grating={modes.grating}
                  onChange={(value: string) =>
                    modesPropertyChange("grating", value)
                  }
                />
              </>
            )}

            {/* Fabry-Perot mode */}
            {hasFabryPerotMode && (
              <>
                <p>Fabry-Perot mode</p>
                <FabryPerotModeSelect
                  fabryPerotMode={modes.fabryPerotMode}
                  onChange={(value: string) =>
                    modesPropertyChange("fabryPerotMode", value)
                  }
                />
              </>
            )}

            {/* Polarimetry mode */}
            {hasPolarimetryModes && (
              <>
                <p>Polarimetry mode</p>
                <PolarimetryModesSelector
                  polarimetryModes={modes.polarimetryModes}
                  onChange={(value: Set<RSSPolarimetryMode>) =>
                    modesPropertyChange("polarimetryModes", value)
                  }
                />
              </>
            )}
          </ModePropertiesDiv>
        </SubGrid>
      </MainGrid>
    </>
  );
};

const FabryPerotModeSelect = ({
  fabryPerotMode,
  onChange
}: {
  fabryPerotMode?: RSSFabryPerotMode;
  onChange: OnChangeFunction;
}) => {
  const handleChangeEvent = (e: ChangeEvent<HTMLSelectElement>) =>
    onChange(e.target.value);

  return (
    <SelectField onChange={handleChangeEvent} value={fabryPerotMode || ""}>
      <AnyOption />
      <option value="LR">Low resolution</option>
      <option value="MR">Medium resolution</option>
      <option value="HR">High resolution</option>
      <option value="TF">Tunable filter</option>
    </SelectField>
  );
};

const GratingSelect = ({
  grating,
  onChange
}: {
  grating?: RSSGrating;
  onChange: OnChangeFunction;
}) => {
  const handleChangeEvent = (e: ChangeEvent<HTMLSelectElement>) =>
    onChange(e.target.value);

  return (
    <SelectField onChange={handleChangeEvent} value={grating || ""}>
      <AnyOption />
      <option value="Open">Open</option>
      <option value="pg0300">PG0300</option>
      <option value="pg0900">PG0900</option>
      <option value="pg1300">PG1300</option>
      <option value="pg1800">PG1800</option>
      <option value="pg2300">PG2300</option>
      <option value="ph3000">PG3000</option>
    </SelectField>
  );
};

export default RSS;
