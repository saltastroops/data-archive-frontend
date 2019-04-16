import * as React from "react";
import { ChangeEvent } from "react";
import {
  IRSS,
  RSSFabryPerotMode,
  RSSGrating,
  RSSInstrumentMode,
  RSSPolarimetryMode
} from "../../../utils/ObservationQueryParameters";
import { MainGrid, SubGrid } from "../../basicComponents/Grids";
import SelectField, { AnyOption } from "../../basicComponents/SelectField";
import PolarimetryModesSelector from "../PolarimetryModesSelector";

interface IRssProps {
  rss: IRSS;
  onChange: (value: any) => void;
}

type OnChangeFunction = (value: string) => void;

/**
 * A form selecting RSS-related search parameters.
 */
const RSS = (props: IRssProps) => {
  const { onChange, rss } = props;

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
  const onModeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      errors: {
        ...rss.errors,
        mode: {}
      },
      mode: {
        name: e.target.value
      }
    });
  };

  const modePropertyChange = (property: string, value: any) => {
    onChange({
      ...rss,
      mode: {
        ...rss.mode,
        [property]: value
      }
    });
  };

  const modes: RSSInstrumentMode[] = [
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

  const mode = rss.mode || { name: "" };

  return (
    <>
      <MainGrid>
        <SubGrid>
          <p>Mode</p>
          <SelectField name={"mode"} onChange={onModeChange}>
            <AnyOption />
            {modes.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </SelectField>
        </SubGrid>
        <SubGrid>
          <p>Detector Mode</p>
          <SelectField
            name={"detectorMode"}
            onChange={e => change("detectorName", e.target.value)}
          >
            <AnyOption />
            {detectorModes.map(detectorMode => (
              <option key={detectorMode} value={detectorMode}>
                {detectorMode}
              </option>
            ))}
          </SelectField>
        </SubGrid>
      </MainGrid>

      {/* Fabry-Perot */}
      {mode.name === "Fabry Perot" && (
        <MainGrid>
          <SubGrid>
            <p>Resolution</p>
            <FabryPerotModeSelect
              fabryPerotMode={mode.fabryPerotMode}
              onChange={(value: string) =>
                modePropertyChange("fabryPerotMode", value)
              }
            />
          </SubGrid>
        </MainGrid>
      )}

      {/* Fabry-Perot polarimetry */}
      {mode.name === "FP polarimetry" && (
        <MainGrid>
          <SubGrid>
            <p>Resolution</p>
            <FabryPerotModeSelect
              fabryPerotMode={mode.fabryPerotMode}
              onChange={(value: string) =>
                modePropertyChange("fabryPerotMode", value)
              }
            />
          </SubGrid>
          <SubGrid>
            <p>Polarimetry mode</p>
            <PolarimetryModesSelector
              polarimetryModes={mode.polarimetryModes}
              onChange={(value: Set<RSSPolarimetryMode>) =>
                modePropertyChange("polarimetryModes", value)
              }
            />
          </SubGrid>
        </MainGrid>
      )}

      {/* Imaging */}
      {/* no additional content */}

      {/* Polarimetric imaging */}
      {mode.name === "Polarimetric imaging" && (
        <MainGrid>
          <SubGrid>
            <p>Polarimetry mode</p>
            <PolarimetryModesSelector
              polarimetryModes={mode.polarimetryModes}
              onChange={(value: Set<RSSPolarimetryMode>) =>
                modePropertyChange("polarimetryModes", value)
              }
            />
          </SubGrid>
        </MainGrid>
      )}

      {/* MOS */}
      {mode.name === "MOS" && (
        <MainGrid>
          <SubGrid>
            <p>Grating</p>
            <GratingSelect
              grating={mode.grating}
              onChange={(value: string) => modePropertyChange("grating", value)}
            />
          </SubGrid>
        </MainGrid>
      )}

      {/* MOS polarimetry */}
      {mode.name === "MOS polarimetry" && (
        <MainGrid>
          <SubGrid>
            <p>Grating</p>
            <GratingSelect
              grating={mode.grating}
              onChange={(value: string) => modePropertyChange("grating", value)}
            />
          </SubGrid>
          <SubGrid>
            <p>Polarimetry mode</p>
            <PolarimetryModesSelector
              polarimetryModes={mode.polarimetryModes}
              onChange={(value: Set<RSSPolarimetryMode>) =>
                modePropertyChange("polarimetryModes", value)
              }
            />
          </SubGrid>
        </MainGrid>
      )}

      {/* Spectroscopy */}
      {mode.name === "Spectroscopy" && (
        <MainGrid>
          <SubGrid>
            <p>Grating</p>
            <GratingSelect
              grating={mode.grating}
              onChange={(value: string) => modePropertyChange("grating", value)}
            />
          </SubGrid>
        </MainGrid>
      )}

      {/* MOS polarimetry */}
      {mode.name === "Spectropolarimetry" && (
        <MainGrid>
          <SubGrid>
            <p>Grating</p>
            <GratingSelect
              grating={mode.grating}
              onChange={(value: string) => modePropertyChange("grating", value)}
            />
          </SubGrid>
          <SubGrid>
            <p>Polarimetry mode</p>
            <PolarimetryModesSelector
              polarimetryModes={mode.polarimetryModes}
              onChange={(value: Set<RSSPolarimetryMode>) =>
                modePropertyChange("polarimetryModes", value)
              }
            />
          </SubGrid>
        </MainGrid>
      )}
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
    <SelectField onChange={handleChangeEvent} value={fabryPerotMode}>
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
    <SelectField onChange={handleChangeEvent} value={grating}>
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
