// TypeScript interfaces describing the state of the search form

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
  general?: IGeneral;
  target?: ITarget;
  telescope: ITelescope;
}

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
 *
 */
export interface IGeneral {
  errors: {
    observationNight?: string;
  };
  observationNight?: string;
  principalInvestigator?: string;
  proposalCode?: string;
}

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
  errors: {
    declination?: string;
    rightAscension?: string;
    searchConeRadius?: string;
    searchConeRadiusUnits?: string;
  };
  name?: string;
  resolver?: string;
  rightAscension?: string;
  searchConeRadius?: string;
  searchConeRadiusUnits?: string;
}

// TELESCOPES

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
  name: TelescopeName;
}

/**
 * An interface for query parameters related to SALT.
 *
 * Properties:
 * -----------
 * instrument:
 *     A SALT instrument.
 */
export interface ISALT extends ITelescope {
  name: "SALT";
  instrument?: IInstrument;
}

/**
 * An interface for query parameters related to Lesedi.
 *
 * Properties:
 * -----------
 * instrument:
 *     A SALT instrument.
 */
export interface ILesedi extends ITelescope {
  name: "Lesedi";
  instrument?: IInstrument;
}

/**
 * An interface for query parameters related to SALT.
 *
 * Properties:
 * -----------
 * instrument:
 *     A SALT instrument.
 */
export interface ILesedi extends ITelescope {
  name: "Lesedi";
  instrument?: IInstrument;
}

// INSTRUMENTS

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
  name: string;
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
 */
export interface ISalticam extends IInstrument {
  name: "Salticam";
  detectorMode?: "Normal" | "Slot Mode";
  errors: {
    detectorMode?: string;
    exposureTime?: string;
    filter?: string;
  };
  exposureTime?: string;
  filter?: string;
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
 */
export interface IRSS extends IInstrument {
  name: "RSS";
  detectorMode?: "Normal" | "Slot Mode";
  errors: {
    detectorMode?: string;
    exposureTime?: string;
    filter?: string;
  };
  exposureTime?: string;
  filter?: string;
}

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
 */
export interface IHRS extends IInstrument {
  name: "HRS";
  errors: {
    exposureTime?: string;
    mode?: string;
  };
  exposureTime?: string;
  mode?:
    | "Low Resolution"
    | "Medium Resolution"
    | "High Resolution"
    | "High Stability";
}

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
 */
export interface IHIPPO extends IInstrument {
  name: "HIPPO";
  errors: {
    exposureTime?: string;
    filter?: string;
  };
  exposureTime?: string;
  filter?: string;
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
 */
export interface ISHOC extends IInstrument {
  name: "SHOC";
  errors: {
    exposureTime?: string;
    filter?: string;
  };
  exposureTime?: string;
  filter?: string;
}
