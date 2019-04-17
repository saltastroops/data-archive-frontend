// TypeScript interfaces describing the state of the search form

import { SalticamFilter } from "./SalticamFilter";
import { TargetType } from "./TargetType";

/**
 * An interface describing the React state of the observation query form.
 *
 * This state is used for populating all search form fields (and error messages)
 * and is parsed into the GraphQL query for searching observations.
 *
 * Properties:
 * -----------
 * general:
 *     General information about the observation.
 * target:
 *     Target details.
 * telescope:
 *     Telescope (and instrument) details.
 */
// TODO: Remove loading, replace with IObservationQueryParameters
export interface ISearchFormState {
  general: IGeneral;
  results: any[];
  target: ITarget;
  telescope?: ITelescope;
  loading: boolean;
}

/**
 * The available calibration types.
 */
export type CalibrationType = "arc" | "bias" | "flat" | "standard";

/**
 * An interface for query parameters related to general information.
 *
 * Properties:
 * -----------
 * errors:
 *     Error messages.
 * observationNight:
 *     Date of the night when the observation was taken. This
 *     refers to the date whe the night started.
 * proposalCode:
 *     Identifier of the proposal to which the observation belongs.
 * proposalTitle:
 *     Title of the proposal to which the observation belongs.
 * calibrations:
 *     Calibration types to include in the search results
 *
 */
export interface IGeneralErrors {
  observationNight?: string;
  principalInvestigator?: string;
  proposalCode?: string;
  proposalTitle?: string;
  calibrations?: string;
}
export interface IGeneral {
  errors: IGeneralErrors;
  observationNight?: string;
  principalInvestigator?: string;
  proposalCode?: string;
  proposalTitle?: string;
  calibrations: Set<CalibrationType>;
}

/**
 * The available target name resolvers.
 */
export type TargetResolver = "Simbad" | "NED" | "VizieR";

/**
 * The available units for the search cone radius.
 */
export type SearchConeRadiusUnits = "arcseconds" | "arcminutes" | "degrees";

/**
 * An interface for query parameters related to target details.
 *
 * Properties:
 * -----------
 * declination:
 *     Declination.
 * errors:
 *     Errors.
 * name:
 *     Target name.
 * resolver:
 *     Resolver to use for resolving the target name to a position.
 * rightAscension:
 *     Right ascension.
 * searchConeRadius:
 *     Radius of the search cone radius, in the units given by
 *     searchConeRadiusUnits.
 * searchConeRadiusUnits:
 *     Units of the search cone radius given by searchConeRadius.
 *
 */
export interface ITarget {
  declination?: string;
  errors: ITargetErrors;
  loading?: string;
  name?: string;
  resolver: TargetResolver;
  rightAscension?: string;
  searchConeRadius?: string;
  searchConeRadiusUnits: SearchConeRadiusUnits;
  targetTypes: Set<TargetType>;
}

export interface ITargetErrors {
  name?: string;
  declination?: string;
  resolver?: string;
  rightAscension?: string;
  searchConeRadius?: string;
  searchConeRadiusUnits?: string;
  targetTypes?: string;
}

// TELESCOPES

/**
 * The supported telescope names.
 */
export type TelescopeName = "Lesedi" | "SALT" | "1.9 m";

/**
 * An interface for query parameters related to a telescope.
 *
 * This serves as a placeholder for more concrete interfaces such as ISALT.
 *
 * Properties:
 * -----------
 * name:
 *     Telescope name.
 */
export interface ITelescope {
  name?: TelescopeName;
}

/**
 * An interface for query parameters related to SALT.
 *
 * Properties:
 * -----------
 * instrument:
 *     A SALT instrument.
 * name:
 *     The string "SALT".
 */
export interface ISALT extends ITelescope {
  instrument: IInstrument;
  name: "SALT";
}

/**
 * An interface for query parameters related to Lesedi.
 *
 * Properties:
 * -----------
 * instrument:
 *     An instrument used on Lesedi.
 * name:
 *     The string "Lesedi".
 */
export interface ILesedi extends ITelescope {
  instrument: IInstrument;
  name: "Lesedi";
}

/**
 * An interface for query parameters related to the 1.9 m Telescope.
 *
 * Properties:
 * -----------
 * instrument:
 *     An instrument used on the 1./9 m Telescope.
 * name:
 *     The string "1.9 m".
 */
export interface IOneDotNineM extends ITelescope {
  instrument: IInstrument;
  name: "1.9 m";
}

// INSTRUMENTS

/**
 * The available instrument names.
 */
export type InstrumentName =
  | "Salticam"
  | "RSS"
  | "HRS"
  | "BVIT"
  | "SpUpNIC"
  | "SHOC"
  | "HIPPO";

/**
 * An interface for query parameters related to an instrument.
 *
 * This serves as a placeholder for more concrete interfaces such as ISalticam.
 *
 * Properties:
 * -----------
 * name:
 *     Telescope name.
 */
export interface IInstrument {
  name: InstrumentName;
}

/**
 * An interface for query parameters related to Salticam.
 *
 * Properties:
 * -----------
 * detectorMode:
 *     Detector mode.
 * errors:
 *     Errors.
 * exposureTime:
 *     Exposure time.
 * filter:
 *     Filter.
 * name:
 *     The string "Salticam".
 */
export interface ISalticam extends IInstrument {
  detectorMode?: "Normal" | "Slot Mode";
  errors: {
    detectorMode?: string;
    exposureTime?: string;
    filter?: string;
  };
  exposureTime?: string;
  filter?: SalticamFilter;
  name: "Salticam";
}

/**
 * An interface for query parameters related to RSS.
 *
 * Properties:
 * -----------
 * detectorMode:
 *     Detector mode.
 * errors:
 *     Errors.
 * exposureTime:
 *     Exposure time.
 * mode:
 *     Instrument mode specific details.
 * name:
 *     The string "RSS".
 */
export interface IRSS extends IInstrument {
  detectorMode?: RSSDetectorMode;
  errors: {
    detectorMode?: string;
  };
  modes?: IRSSModes;
  name: "RSS";
}

export interface IRSSModes {
  errors: {
    fabryPerotMode?: string;
    grating?: string;
    polarimetryModes?: string;
  };
  fabryPerotMode?: RSSFabryPerotMode;
  grating?: RSSGrating;
  names: Set<RSSInstrumentMode>;
  polarimetryModes?: Set<RSSPolarimetryMode>;
}

export type RSSDetectorMode = "Normal" | "Slot Mode" | "";

export type RSSGrating =
  | "Open"
  | "pg0300"
  | "pg0900"
  | "pg1300"
  | "pg1800"
  | "pg2300"
  | "pg3000"
  | "";

export type RSSInstrumentMode =
  | "Fabry Perot"
  | "FP polarimetry"
  | "Imaging"
  | "Polarimetric imaging"
  | "MOS"
  | "MOS polarimetry"
  | "Spectropolarimetry"
  | "Spectroscopy";

export type RSSFabryPerotMode = "HR" | "LR" | "MR" | "TF" | "";

export type RSSPolarimetryMode =
  | "All Stokes"
  | "Circular"
  | "Linear"
  | "Linear Hi"
  | "";

/**
 * An interface for query parameters related to HRS.
 *
 * Properties:
 * -----------
 * errors:
 *     Errors.
 * exposureTime:
 *     Exposure time.
 * mode:
 *     Resolution mode.
 * name:
 *     The string "HRS".
 */
export interface IHRS extends IInstrument {
  errors: {
    exposureTime?: string;
    mode?: string;
  };
  exposureTime?: string;
  mode?: HRSMode;
  name: "HRS";
}

export type HRSMode =
  | "High Resolution"
  | "High Stability"
  | "Int Cal Fibre"
  | "Low Resolution"
  | "Medium Resolution";

export interface IBVIT extends IInstrument {
  errors: {};
  filter?: BVITFilter;
  mode?: "Imaging" | "Streaming";
  name: "BVIT";
}

export type BVITFilter = "B" | "H-alpha" | "Open" | "R" | "U" | "V";

/**
 * An interface for query parameters related to HIPPO.
 *
 * Properties:
 * -----------
 * errors:
 *     Errors.
 * exposureTime:
 *     Exposure time.
 * filter:
 *     Filter.
 * name:
 *     The string "HIPPO".
 */
export interface IHIPPO extends IInstrument {
  errors: {
    exposureTime?: string;
    filter?: string;
  };
  exposureTime?: string;
  filter?: string;
  name: "HIPPO";
}

/**
 * An interface for query parameters related to SHOC.
 *
 * Properties:
 * -----------
 * errors:
 *     Errors.
 * exposureTime:
 *     Exposure time.
 * filter:
 *     Filter.
 * name:
 *     The string "SHOC".
 */
export interface ISHOC extends IInstrument {
  errors: {
    exposureTime?: string;
    filter?: string;
  };
  exposureTime?: string;
  filter?: string;
  name: "SHOC";
}

/**
 * An interface for query parameters related to SpUpNIC.
 *
 * Properties:
 * -----------
 * errors:
 *     Errors.
 * exposureTime:
 *     Exposure time.
 * filter:
 *     Filter.
 * name:
 *     The string "SpUpNIC".
 */
export interface ISpUpNIC extends IInstrument {
  errors: {
    exposureTime?: string;
    filter?: string;
  };
  exposureTime?: string;
  filter?: string;
  name: "SpUpNIC";
}

export interface IFile {
  id: string;
  filename: string;
  name: string;
  dataType: string;
  isReduced: boolean;
  targetName: string;
  rightAscension: number;
  declination: number;
  observationNight: string;
  category: string;
  telescope: string;
  instrument: string;
  observationId?: string;
  url?: string;
}
export interface IObservation {
  id: string;
  name: string | "Unknown Observation";
  proposal?: string;
  telescope: string;
  startTime: string;
  files: IFile[];
}
