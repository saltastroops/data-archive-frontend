/**
 * An interface marking a where condition.
 */
/* tslint:disable:no-empty-interface */
export interface IWhereCondition {}
/* tslint:enable:no-empty-interface */

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

// Interfaces describing the state of the search form

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
  proposalTitle?: string;
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
    resolver?: string;
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
  name: "Lesedi" | "SALT" | "1.9 m";
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
  instrument?: IInstrument;
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
  instrument?: IInstrument;
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
export interface IOneDotNineMetre extends ITelescope {
  instrument?: IInstrument;
  name: "1.9 m";
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
  filter?: string;
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
 * name:
 *     The string "RSS".
 */
export interface IRSS extends IInstrument {
  detectorMode?: "Normal" | "Slot Mode";
  errors: {
    detectorMode?: string;
    exposureTime?: string;
    filter?: string;
  };
  exposureTime?: string;
  filter?: string;
  name: "RSS";
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
 * name:
 *     The string "HRS".
 */
export interface IHRS extends IInstrument {
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
  name: "HRS";
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
