// TypeScript interfaces describing the state of the search form

import { ICartFile } from "../util/Cart";
import { SalticamFilter } from "./SalticamFilter";
import { TargetType } from "./TargetType";

/* tslint:disable:no-empty-interface */
export interface IWhereCondition {}
/* tslint:enable:no-empty-interface */

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
export interface ISearchFormState {
  general: IGeneral;
  target: ITarget;
  telescope: ITelescope;
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
 * targetTypes:
 *     Target types.
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

/**
 * An interface describing a target position.
 *
 * Properties:
 * -----------
 * declinations:
 *     An array of 0, 1 or 2 declinations, in degrees. If there are two
 *     declinations, they are taken to be the ends of an interval.
 * rightAscensions:
 *     An array of 0, 1 or 2 right ascensions, in degrees. If there are two
 *     right ascensions, they are taken to be the ends of an interval.
 * searchConeRadius:
 *     The radius for a cone search, in degrees.
 */
export interface ITargetPosition {
  rightAscensions: number[];
  declinations: number[];
  searchConeRadius: number;
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
  telescopes: TelescopeName[];
  instruments?: InstrumentName[];
  detectorMode?: any;
  modes?: any;
  grating?: any;
  filters?: any;
  polarimetry?: any;
  resolution?: any;
  hrsMode?: string[];
  fabryPerot?: string[];
  rssGrating?: string[];
  rssPolarimetryImaging?: string[];
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
  detectorMode?: "Drift Scan" | "Frame Transfer" | "Normal" | "Slot Mode";
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
 * filter:
 *     Filter.
 * mode:
 *     Instrument mode specific details.
 * name:
 *     The string "RSS".
 */
export interface IRSS extends IInstrument {
  detectorMode?: RSSDetectorMode;
  errors: {
    detectorMode?: string;
    exposureTime?: string;
    filter?: string;
  };
  exposureTime?: string;
  filter?: string;
  modes?: IRSSModes;
  name: "RSS";
}

export interface IRSSModes {
  errors: {
    fabryPerotMode?: string;
    grating?: string;
    polarimetryModes?: Set<string>;
  };
  fabryPerotMode?: RSSFabryPerotMode;
  grating?: RSSGrating;
  names: Set<RSSInstrumentMode>;
  polarimetryModes?: Set<RSSPolarimetryMode>;
}

export type RSSDetectorMode =
  | "Drift Scan"
  | "Frame Transfer"
  | "Normal"
  | "Shuffle"
  | "Slot Mode";

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

export type RSSFabryPerotMode = "HR" | "LR" | "MR" | "TF";

export type RSSPolarimetryMode =
  | "ALL STOKES"
  | "CIRCULAR"
  | "LINEAR"
  | "LINEAR HI";

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
  cartContent: ICartFile;
  [key: string]: any;
}

export interface IObservation {
  id: string;
  name: string | "Unknown Observation";
  proposal?: string;
  telescope: string;
  startTime: string;
  files: IFile[];
}

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
export interface IObservationQueryParameters {
  general: IGeneral;
  target: ITarget;
  telescope: ITelescope;
}

/**
 * An interface describing the arguments for the WITHIN_RADIUS operator.
 *
 * Properties:
 * -----------
 * declination:
 *     The declination of the centre position, in degrees.
 * declinationColumn:
 *     The name of the declination column.
 * radius:
 *     The radius of the search cone.
 * rightAscension:
 *     The right ascension of the centre position, in degrees.
 * rightAscensionColumn:
 *     The name of the right ascension column.
 */
export interface IWithinRadiusArguments {
  declination: number;
  declinationColumn: string;
  radius: number;
  rightAscension: number;
  rightAscensionColumn: string;
}
