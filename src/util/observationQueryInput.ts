import moment, { Moment } from "moment";
import {
  IGeneral,
  IHRS,
  IObservationQueryParameters,
  IRSS,
  ISALT,
  ISalticam,
  ITarget,
  ITelescope
} from "./ObservationQueryParameters";

const GENERAL_OBSERVATION_NIGHT = "A.ObsNight";

const GENERAL_PRINCIPAL_INVESTIGATOR = "A.PrincipalInvestigator";

const GENERAL_PROPOSAL_CODE = "A.ProposalCode";

const TARGET_RIGHT_ASCENSION = "Target.RightAscension";

const TARGET_DECLINATION = "Target.Declination";

export const SALT_ID = "SALT.ID";

export const SALTICAM_ID = "Salticam.ID";

const SALTICAM_DETECTOR_MODE = "Salticam.DetectorMode";

export const RSS_ID = "RSS.ID";

const RSS_DETECTOR_MODE = "RSS.DetectorMode";

export const HRS_ID = "HRS.ID";

const HRS_MODE = "HRS.Mode";

export const DEFAULT_COORDINATE_SEARCH_RADIUS = 0.05;

export const MAXIMUM_COORDINATE_SEARCH_RADIUS = 10;

interface ITargetPosition {
  rightAscensions: number[];
  declinations: number[];
  searchConeRadius: number;
}

interface IWithinRadiusArguments {
  rightAscensionColumn: string;
  declinationColumn: string;
  rightAscension: number;
  declination: number;
  radius: number;
}

interface IWhereCondition {}

/**
 * Map observation query parameters to a where condition.
 *
 * The where condition is represented by a hierarchical object structure
 * including operators, columns and values. Generally, the keys in this object
 * are the operators.
 *
 * At top level, the structure looks as follows.
 *
 * {
 *   AND: [
 *     AND: [
 *       // ... conditions for the general query parameters ...
 *     ],
 *     AND: [
 *       // ... conditions for the target query parameters ...
 *     ],
 *     AND: [
 *       // ... conditions for the telescope query parameters ...
 *     ]
 *   ]
 * }
 *
 * See the generalWhereCondition, targetWhereCondition and
 * telescopeWhereCondition functions for more details regarding the lower level
 * structure.
 *
 * Parameters:
 * -----------
 * queryParameters:
 *     The query parameters.
 *
 * Returns:
 * --------
 * whereCondition:
 *     The where condition.
 */
export function whereCondition(queryParameters: IObservationQueryParameters) {
  return {
    AND: [
      generalWhereCondition(queryParameters.general),
      targetWhereCondition(queryParameters.target),
      telescopeWhereCondition(queryParameters.telescope)
    ]
  };
}

/**
 * Map general query parameters to a where condition.
 *
 * Parameters:
 * -----------
 * general:
 *    General query parameters.
 *
 * Returns:
 * --------
 * condition:
 *     The where condition for the query parameters.
 */
export function generalWhereCondition(general: IGeneral): IWhereCondition {
  const conditions: IWhereCondition[] = [];

  // Night when the observation was taken
  const observationNight = trim(general.observationNight);
  if (observationNight) {
    const startTime = parseDate(observationNight).add(14, "hours"); // noon SAST
    const startTimeString = startTime.format("YYYY-MM-DD");
    const endTime = startTime.add(1, "day");
    const endTimeString = endTime.format("YYYY-MM-DD");
    conditions.push(greaterThan(GENERAL_OBSERVATION_NIGHT, startTimeString));
    conditions.push(lessThan(GENERAL_OBSERVATION_NIGHT, endTimeString));
  }

  // Principal Investigator
  const principalInvestigator = trim(general.principalInvestigator);
  if (principalInvestigator) {
    conditions.push(
      contains(GENERAL_PRINCIPAL_INVESTIGATOR, principalInvestigator)
    );
  }

  // Proposal code
  const proposalCode = trim(general.proposalCode);
  if (proposalCode) {
    conditions.push(contains(GENERAL_PROPOSAL_CODE, proposalCode));
  }

  return and(conditions);
}

/**
 * Map target query parameters to a where condition.
 *
 * Parameters:
 * -----------
 * target:
 *    Target query parameters.
 *
 * Returns:
 * --------
 * condition:
 *     The where condition for the query parameters.
 */
export function targetWhereCondition(target: ITarget): IWhereCondition {
  const conditions = [];

  // Target position
  const targetPosition = parseTargetPosition(target);

  const rightAscensions = targetPosition.rightAscensions;
  const declinations = targetPosition.declinations;
  const radius = targetPosition.searchConeRadius;
  if (rightAscensions.length === 1 && declinations.length === 1) {
    // Cone search
    conditions.push(
      withinRadius({
        rightAscensionColumn: TARGET_RIGHT_ASCENSION,
        declinationColumn: TARGET_DECLINATION,
        rightAscension: rightAscensions[0],
        declination: declinations[0],
        radius
      })
    );
  } else {
    // Right ascension range
    if (rightAscensions.length) {
      const ra1 = rightAscensions[0];
      const ra2 = rightAscensions[1];
      if (ra1 < ra2) {
        conditions.push(greaterEqual(TARGET_RIGHT_ASCENSION, ra1));
        conditions.push(lessEqual(TARGET_RIGHT_ASCENSION, ra2));
      } else {
        conditions.push(
          // The interval includes the "jump" from 360 to 0 degrees
          or([
            and([
              greaterEqual(TARGET_RIGHT_ASCENSION, ra1),
              lessEqual(TARGET_RIGHT_ASCENSION, 360)
            ]),
            and([
              greaterEqual(TARGET_RIGHT_ASCENSION, 0),
              lessEqual(TARGET_RIGHT_ASCENSION, ra2)
            ])
          ])
        );
      }
    }

    // Declination range
    if (declinations.length) {
      conditions.push(greaterEqual(TARGET_DECLINATION, declinations[0]));
      conditions.push(lessEqual(TARGET_DECLINATION, declinations[1]));
    }
  }

  return and(conditions);
}

/**
 * Map telescope query parameters to a where condition.
 *
 * Parameters:
 * -----------
 * telescope:
 *    Telescope query parameters.
 *
 * Returns:
 * --------
 * condition:
 *     The where condition for the query parameters.
 */
export function telescopeWhereCondition(
  telescope: ITelescope
): IWhereCondition {
  const conditions: IWhereCondition[] = [];

  // Telescope-specific conditions
  switch (telescope.name) {
    case "SALT":
      conditions.push(saltWhereCondition(telescope as ISALT));
      break;
    case "Lesedi":
      break;
    case "1.9 m":
      break;
  }

  return and(conditions);
}

/**
 * Map SALT query parameters to a where condition.
 *
 * Parameters:
 * -----------
 * salt:
 *    SALT query parameters.
 *
 * Returns:
 * --------
 * condition:
 *     The where condition for the query parameters.
 */
export function saltWhereCondition(salt: ISALT) {
  const conditions: IWhereCondition[] = [];

  // SALT is used
  conditions.push(not(isNull(SALT_ID)));

  // Instrument
  const instrument = salt.instrument;
  if (instrument) {
    switch (instrument.name) {
      case "Salticam":
        conditions.push(salticamWhereCondition(instrument as ISalticam));
        break;
      case "RSS":
        conditions.push(rssWhereCondition(instrument as IRSS));
        break;
      case "HRS":
        conditions.push(hrsWhereCondition(instrument as IHRS));
        break;
    }
  }

  return and(conditions);
}

/**
 * Map Salticam query parameters to a where condition.
 *
 * Parameters:
 * -----------
 * salticam:
 *    Salticam query parameters.
 *
 * Returns:
 * --------
 * condition:
 *     The where condition for the query parameters.
 */
export function salticamWhereCondition(salticam: ISalticam): IWhereCondition {
  const conditions: IWhereCondition[] = [];

  // Salticam is used
  conditions.push(not(isNull(SALTICAM_ID)));

  // Detector mode
  const detectorMode = trim(salticam.detectorMode);
  switch (detectorMode) {
    case "Normal":
      conditions.push(equals(SALTICAM_DETECTOR_MODE, "NORMAL"));
      break;
    case "Slot Mode":
      conditions.push(equals(SALTICAM_DETECTOR_MODE, "SLOT MODE"));
  }

  return and(conditions);
}

/**
 * Map RSS query parameters to a where condition.
 *
 * Parameters:
 * -----------
 * rss:
 *    RSS query parameters.
 *
 * Returns:
 * --------
 * condition:
 *     The where condition for the query parameters.
 */
export function rssWhereCondition(rss: IRSS): IWhereCondition {
  const conditions: IWhereCondition[] = [];

  // RSS is used
  conditions.push(not(isNull(RSS_ID)));

  // Detector mode
  const detectorMode = trim(rss.detectorMode);
  switch (detectorMode) {
    case "Normal":
      conditions.push(equals(RSS_DETECTOR_MODE, "NORMAL"));
      break;
    case "Slot Mode":
      conditions.push(equals(RSS_DETECTOR_MODE, "SLOT MODE"));
  }

  return and(conditions);
}

/**
 * Map HRS query parameters to a where condition.
 *
 * Parameters:
 * -----------
 * hrs:
 *    HRS query parameters.
 *
 * Returns:
 * --------
 * condition:
 *     The where condition for the query parameters.
 */
export function hrsWhereCondition(hrs: IHRS): IWhereCondition {
  const conditions: IWhereCondition[] = [];

  // HRS is used
  conditions.push(not(isNull(RSS_ID)));

  // Detector mode
  const mode = trim(hrs.mode);
  switch (mode) {
    case "Low Resolution":
      conditions.push(equals(HRS_MODE, "LR"));
      break;
    case "Medium Resolution":
      conditions.push(equals(HRS_MODE, "MR"));
      break;
    case "High Resolution":
      conditions.push(equals(HRS_MODE, "HR"));
      break;
    case "High Stability":
      conditions.push(equals(HRS_MODE, "HS"));
      break;
  }

  return and(conditions);
}

type DATABASE_VALUE = string | number | boolean;

function and(conditions: IWhereCondition[]): IWhereCondition {
  return {
    AND: conditions
  };
}

function or(conditions: IWhereCondition[]): IWhereCondition {
  return {
    OR: conditions
  };
}

function not(condition: IWhereCondition): IWhereCondition {
  return {
    NOT: condition
  };
}

function equals(column: string, value: DATABASE_VALUE): IWhereCondition {
  return {
    EQUALS: { column, value }
  };
}

function isNull(column: string) {
  return {
    IS_NULL: column
  };
}

function lessThan(column: string, value: DATABASE_VALUE): IWhereCondition {
  return {
    LESS_THAN: { column, value }
  };
}

function greaterThan(column: string, value: DATABASE_VALUE): IWhereCondition {
  return {
    GREATER_THAN: { column, value }
  };
}

function lessEqual(column: string, value: DATABASE_VALUE): IWhereCondition {
  return {
    LESS_EQUAL: { column, value }
  };
}

function greaterEqual(column: string, value: DATABASE_VALUE): IWhereCondition {
  return {
    GREATER_EQUAL: { column, value }
  };
}

function between(
  column: string,
  value1: number,
  value2: number
): IWhereCondition {
  return {
    BETWEEN: { column, value1, value2 }
  };
}

function contains(column: string, value: DATABASE_VALUE): IWhereCondition {
  return {
    CONTAINS: { column, value }
  };
}

function withinRadius(args: IWithinRadiusArguments): IWhereCondition {
  return {
    WITHIN_RADIUS: args
  };
}

function trim(value: string | null | undefined) {
  if (value) {
    return value.trim();
  }
  return value;
}

/**
 * Parse the given string as a date, and return the date as a string as a
 * Moment instance.
 *
 * Thec string must have the format 'YYYY-MM-DD', and it must be a valid date.
 *
 * The date is assumed to be given as UTC.
 */
function parseDate(date: string) {
  const t = moment.utc(date, "YYYY-MM-DD");
  if (!t.isValid()) {
    throw new Error(`${date} is not a valid date.`);
  }
  t.startOf("day");
  return t;
}

/**
 * Parse the target position.
 *
 * The following rules are applied for parsing.
 *
 * 1. Both the right ascension and the declination may be a single value or a
 *    range. Ranges are specified as value1 .. value2.
 * 2. If a range is given for at least one of the coordinates, there must be
 *    no search cone radius.
 * 3. If a range is given for one coordinate but not the other, the other
 *    coordinate is replaced with a range which is centered on the coordinate
 *    and whose with is the default diameter of a search cone.
 * 4. Similarly, if a single value is given for one coordinate and the other
 *    coordinate is not given, the given coordinate is replaced with a range
 *    which is centered on the coordinateand whose with is the default diameter
 *    of a search cone.
 * 5. Default values are an empty array for the right ascensions and
 *    declinations and 0 for the search cone radius.
 * 56. If the lower limit is greater than the upper limit in a declination range,
 *    the limits are swapped. However, the order of the limits is not changed
 *    for right ascension ranges.
 *
 * An error is raised if the target cannot be parsed according to these rules.
 *
 * Parameters:
 * -----------
 * target:
 *     Target query parameters.
 *
 * Returns:
 * --------
 * position:
 *     The target position details.
 */
export function parseTargetPosition(target: ITarget): ITargetPosition {
  // Parse the right ascension(s)
  let rightAscensionValues: number[] = [];
  let rightAscension = trim(target.rightAscension);
  if (rightAscension) {
    const rightAscensions = rightAscension.split(/\s*\.{2,}\s*/);

    // Check that there is a right ascension or a right ascension range
    if (rightAscensions.length < 1 || rightAscensions.length > 2) {
      throw new Error(
        `${rightAscension} is neither a right ascension nor a right ascension range.`
      );
    }

    // Convert the strings to degrees
    rightAscensionValues = rightAscensions.map(ra => parseRightAscension(ra));

    // Prevent zero-length ranges
    if (
      rightAscensionValues.length == 2 &&
      rightAscensionValues[0] === rightAscensionValues[1]
    ) {
      throw new Error("The right ascension range must not have length 0.");
    }
  }

  // Parse the declination(s)
  let declinationValues: number[] = [];
  let declination = trim(target.declination);
  if (declination) {
    const declinations = declination.split(/\s*\.{2,}\s*/);

    // Check that there is a declination or a declination range
    if (declinations.length < 1 || declinations.length > 2) {
      throw new Error(
        `${declination} is neither a declination nor a declination range.`
      );
    }

    // Convert the strings to degrees, and sort
    declinationValues = declinations.map(dec => parseDeclination(dec)).sort();

    // Prevent zero-length ranges
    if (
      declinationValues.length == 2 &&
      declinationValues[0] === declinationValues[1]
    ) {
      throw new Error("The declination range must not have length 0.");
    }
  }

  // There is no need to proceed if there are no coordinates
  if (!rightAscension && !declination) {
    return {
      rightAscensions: [],
      declinations: [],
      searchConeRadius: 0
    };
  }

  // Cpoordinate ranges and a search cone radius are mutually exclusive
  const searchConeRadius = trim(target.searchConeRadius);
  if (
    searchConeRadius &&
    (rightAscensionValues.length > 1 || declinationValues.length > 1)
  ) {
    throw new Error(
      "You must not supply a search cone radius if you supply a right ascension range or a declination range."
    );
  }

  // If there is no declination or a range is given for it, the right ascension
  // (if there is one) must be a range, and its values must be between 0 and
  // 360 degrees
  if (rightAscensionValues.length === 1 && declinationValues.length !== 1) {
    rightAscensionValues = [
      rightAscensionValues[0] - DEFAULT_COORDINATE_SEARCH_RADIUS,
      rightAscensionValues[0] + DEFAULT_COORDINATE_SEARCH_RADIUS
    ].map(ra => {
      if (ra < 0) {
        return ra + 360;
      } else if (ra > 360) {
        return ra - 360;
      }
      return ra;
    });
  }

  // if there is no right ascension or a range is given for it, the declination
  // (if there is one) must be a range, and its values must be between -90 and
  // 90 degrees
  if (declinationValues.length === 1 && rightAscensionValues.length !== 1) {
    declinationValues = [
      declinationValues[0] - DEFAULT_COORDINATE_SEARCH_RADIUS,
      declinationValues[0] + DEFAULT_COORDINATE_SEARCH_RADIUS
    ].map(dec => {
      if (dec < -90) {
        return -90;
      } else if (dec > 90) {
        return 90;
      }
      return dec;
    });
  }

  let searchConeRadiusValue = 0;
  if (searchConeRadius) {
    // Check the search cone radius
    searchConeRadiusValue = parseFloat(searchConeRadius);
    if (isNaN(searchConeRadiusValue) || searchConeRadiusValue <= 0) {
      throw new Error(
        "The radius for a cone search must be a positive number."
      );
    }

    // Check that there are search cone radius units
    const searchConeRadiusUnits = trim(target.searchConeRadiusUnits) || "";
    if (!searchConeRadiusUnits) {
      throw new Error(
        "You must supply the units of the radius for the cone search."
      );
    }

    // Apply the units
    switch (searchConeRadiusUnits.toLowerCase()) {
      case "degrees":
        searchConeRadiusValue /= 1;
        break;
      case "arcminutes":
        searchConeRadiusValue /= 60;
        break;
      case "arcseconds":
        searchConeRadiusValue /= 3600;
        break;
      default:
        throw new Error(
          `The units ${searchConeRadiusUnits} for the search cone radius are not supported.`
        );
    }

    // Check that the radius is not too large
    if (searchConeRadiusValue > MAXIMUM_COORDINATE_SEARCH_RADIUS) {
      throw new Error(
        `The radius for a cone search must not be greater than ${MAXIMUM_COORDINATE_SEARCH_RADIUS} degrees.`
      );
    }
  }

  // If a single position (rather than ranges) is considered, there must be a
  // cone radius
  if (rightAscensionValues.length === 1 && declinationValues.length === 1) {
    if (!searchConeRadius) {
      searchConeRadiusValue = DEFAULT_COORDINATE_SEARCH_RADIUS;
    }
  }

  return {
    rightAscensions: rightAscensionValues,
    declinations: declinationValues,
    searchConeRadius: searchConeRadiusValue
  };
}

function parseRightAscension(ra: string): number {
  const raValue = parseFloat(ra);
  if (isNaN(raValue) || raValue < 0 || raValue > 360) {
    throw new Error(`${ra} is not a valid right ascension.`);
  }
  return raValue;
}

function parseDeclination(dec: string): number {
  const decValue = parseFloat(dec);
  if (isNaN(decValue) || decValue < -90 || decValue > 90) {
    throw new Error(`${dec} is not a valid declination.`);
  }
  return decValue;
}
