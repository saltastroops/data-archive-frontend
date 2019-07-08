import {
  and,
  contains,
  equals,
  greaterEqual,
  greaterThan,
  isNull,
  lessEqual,
  lessThan,
  not,
  or,
  startsWith,
  withinRadius
} from "./operators";
import { parseDate, parseTargetPosition, trim } from "./parse";
import {
  IGeneral,
  IHRS,
  IObservationQueryParameters,
  IRSS,
  ISALT,
  ISalticam,
  ITarget,
  ITelescope,
  IWhereCondition
} from "./types";
import DataKeys from "../../components/searchFormComponents/results/DataKeys";
import {
  GALAXY,
  ISM,
  SOLAR_SYSTEM_BODY,
  STAR,
  TARGET_TYPE_CODES,
  TargetType
} from "../../utils/TargetType";

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
 * Recursively remove all AND and OR conditions which have an empty array of child
 * conditions.
 *
 * For example, the condition
 *
 * {
 *   AND: [
 *     { EQUALS: { column: 'A.a', value: 14 } },
 *     { OR: [] },
 *     { EQUALS: { column: 'A.a', value: 14 } },
 *   ]
 * }
 *
 * is pruned to
 *
 * {
 *   AND: [
 *     { EQUALS: { column: 'A.a', value: 14 } },
 *     { EQUALS: { column: 'A.a', value: 14 } },
 *   ]
 * }
 *
 * A copy of the original condition is pruned and returned.
 *
 * Parameters:
 * -----------
 * condition: object
 *     The condition to prune.
 *
 * Returns:
 * --------
 * pruned:
 *     The pruned condition.
 */
export function prune(condition: object) {
  if (typeof condition !== "object") {
    throw new Error("The condition must be an object.");
  }

  function _prune(o: any) {
    if (Array.isArray(o)) {
      // Prune all array itens and then remove all empty objects.
      const pruned: any[] = o
        .map(item => _prune(item))
        .filter((k: any) => Object.keys(k).length);
      return pruned;
    } else if (typeof o === "object") {
      // Prune all properties, and create an object with these (pruned)
      // properties. Pruned AND or OR conditions are only included if they have
      // a conditions array with at least one item.
      const pruned: any = {};
      for (let p of Object.keys(o)) {
        const v = _prune(o[p]);
        if (!["AND", "OR"].includes(p) || v.length) {
          pruned[p] = v;
        }
      }
      return pruned;
    } else {
      // Return the object as is.
      return o;
    }
  }

  return _prune(condition);
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
    const night = parseDate(observationNight); // noon SAST
    const nightString = night.format("YYYY-MM-DD");
    conditions.push(equals(DataKeys.OBSERVATION_NIGHT, nightString));
  }

  // Principal Investigator
  const principalInvestigator = trim(general.principalInvestigator);
  if (principalInvestigator) {
    conditions.push(
      contains(DataKeys.PROPOSAL_PI_FAMILY_NAME, principalInvestigator)
    );
  }

  // Proposal code
  const proposalCode = trim(general.proposalCode);
  if (proposalCode) {
    conditions.push(contains(DataKeys.PROPOSAL_CODE, proposalCode));
  }

  // Proposal title
  const proposalTitle = trim(general.proposalTitle);
  if (proposalTitle) {
    conditions.push(contains(DataKeys.PROPOSAL_TITLE, proposalTitle));
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
        declination: declinations[0],
        declinationColumn: DataKeys.TARGET_DECLINATION,
        radius,
        rightAscension: rightAscensions[0],
        rightAscensionColumn: DataKeys.TARGET_RIGHT_ASCENSION
      })
    );
  } else {
    // Right ascension range
    if (rightAscensions.length) {
      const ra1 = rightAscensions[0];
      const ra2 = rightAscensions[1];
      if (ra1 < ra2) {
        conditions.push(greaterEqual(DataKeys.TARGET_RIGHT_ASCENSION, ra1));
        conditions.push(lessEqual(DataKeys.TARGET_RIGHT_ASCENSION, ra2));
      } else {
        conditions.push(
          // The interval includes the "jump" from 360 to 0 degrees
          or([
            and([
              greaterEqual(DataKeys.TARGET_RIGHT_ASCENSION, ra1),
              lessEqual(DataKeys.TARGET_RIGHT_ASCENSION, 360)
            ]),
            and([
              greaterEqual(DataKeys.TARGET_RIGHT_ASCENSION, 0),
              lessEqual(DataKeys.TARGET_RIGHT_ASCENSION, ra2)
            ])
          ])
        );
      }
    }

    // Declination range
    if (declinations.length) {
      conditions.push(
        greaterEqual(DataKeys.TARGET_DECLINATION, declinations[0])
      );
      conditions.push(lessEqual(DataKeys.TARGET_DECLINATION, declinations[1]));
    }
  }

  // Target type
  // The different target types have numeric codes starting with different
  // numbers (such as "15" for galaxies or "50" for solar system bodies, which
  // is how we query for them.
  const targetTypes = target.targetTypes;
  if (targetTypes && targetTypes.size > 0) {
    const targetTypeConditions = Array.from(targetTypes).map(targetType =>
      startsWith(
        DataKeys.TARGET_TYPE_NUMERIC_CODE,
        TARGET_TYPE_CODES.get(targetType) + "."
      )
    );
    conditions.push(or(targetTypeConditions));
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
  telescope: ITelescope | undefined
): IWhereCondition {
  if (!telescope) {
    return and([]);
  }

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
  conditions.push(equals(DataKeys.TELESCOPE_NAME, "SALT"));

  // Instrument
  const instrument = salt.instrument;
  if (instrument) {
    switch (instrument.name) {
      case "SALTICAM":
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
 * Map SALTICAM query parameters to a where condition.
 *
 * Parameters:
 * -----------
 * salticam:
 *    SALTICAM query parameters.
 *
 * Returns:
 * --------
 * condition:
 *     The where condition for the query parameters.
 */
export function salticamWhereCondition(salticam: ISalticam): IWhereCondition {
  const conditions: IWhereCondition[] = [];

  // SALTICAM is used
  conditions.push(not(isNull(DataKeys.SALTICAM_ID)));

  // Detector mode
  const detectorMode = trim(salticam.detectorMode);
  switch (detectorMode) {
    case "Normal":
      conditions.push(equals(DataKeys.SALTICAM_DETECTOR_MODE, "NORMAL"));
      break;
    case "Slot Mode":
      conditions.push(equals(DataKeys.SALTICAM_DETECTOR_MODE, "SLOT MODE"));
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
  conditions.push(not(isNull(DataKeys.RSS_ID)));

  // Detector mode
  const detectorMode = trim(rss.detectorMode);
  switch (detectorMode) {
    case "Normal":
      conditions.push(equals(DataKeys.RSS_DETECTOR_MODE, "NORMAL"));
      break;
    case "Slot Mode":
      conditions.push(equals(DataKeys.RSS_DETECTOR_MODE, "SLOT MODE"));
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
  conditions.push(not(isNull(DataKeys.HRS_ID)));

  // Detector mode
  const mode = trim(hrs.mode);
  switch (mode) {
    case "Low Resolution":
      conditions.push(equals(DataKeys.HRS_OBSERVATION_MODE, "LOW RESOLUTION"));
      break;
    case "Medium Resolution":
      conditions.push(
        equals(DataKeys.HRS_OBSERVATION_MODE, "MEDIUM RESOLUTION")
      );
      break;
    case "High Resolution":
      conditions.push(equals(DataKeys.HRS_OBSERVATION_MODE, "HIGH RESOLUTION"));
      break;
    case "High Stability":
      conditions.push(equals(DataKeys.HRS_OBSERVATION_MODE, "HIGH STABILITY"));
      break;
  }
  return and(conditions);
}
