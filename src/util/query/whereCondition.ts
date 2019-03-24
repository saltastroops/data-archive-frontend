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

const GENERAL_OBSERVATION_NIGHT = "A.ObsNight";

const GENERAL_PRINCIPAL_INVESTIGATOR = "A.PrincipalInvestigator";

const GENERAL_PROPOSAL_CODE = "A.ProposalCode";

const TARGET_RIGHT_ASCENSION = "Target.RightAscension";

const TARGET_DECLINATION = "Target.Declination";

export const SALT_ID = "SALT.ID";

export const SALTICAM_ID = "SALTICAM.ID";

const SALTICAM_DETECTOR_MODE = "SALTICAM.DetectorMode";

export const RSS_ID = "RSS.ID";

const RSS_DETECTOR_MODE = "RSS.DetectorMode";

export const HRS_ID = "HRS.ID";

const HRS_MODE = "HRS.Mode";

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
        declination: declinations[0],
        declinationColumn: TARGET_DECLINATION,
        radius,
        rightAscension: rightAscensions[0],
        rightAscensionColumn: TARGET_RIGHT_ASCENSION
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
  conditions.push(not(isNull(HRS_ID)));

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
