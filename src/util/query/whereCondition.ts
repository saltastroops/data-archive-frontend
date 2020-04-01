import DataKeys from "../../components/searchFormComponents/results/DataKeys";
import {
  IGeneral,
  IObservationQueryParameters,
  ITarget,
  ITelescope,
  IWhereCondition
} from "../../utils/ObservationQueryParameters";
import { TARGET_TYPE_CODES } from "../../utils/TargetType";
import {
  and,
  contains,
  equals,
  greaterEqual,
  isIn,
  lessEqual,
  or,
  startsWith,
  withinRadius
} from "./operators";
import { parseObservationNight, parseTargetPosition, trim } from "./parse";

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
      for (const p of Object.keys(o)) {
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
    const nights = parseObservationNight(observationNight); // noon SAST
    const nightStrings = nights.map(night => night.format("YYYY-MM-DD"));
    if (nightStrings.length === 1) {
      conditions.push(equals(DataKeys.OBSERVATION_NIGHT, nightStrings[0]));
    } else {
      conditions.push(
        and([
          greaterEqual(DataKeys.OBSERVATION_NIGHT, nightStrings[0]),
          lessEqual(DataKeys.OBSERVATION_NIGHT, nightStrings[1])
        ])
      );
    }
  }

  // Principal Investigator
  const principalInvestigator = trim(general.principalInvestigator);
  if (principalInvestigator) {
    conditions.push(contains(DataKeys.PROPOSAL_PI, principalInvestigator));
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

  // Data category
  if (general.productTypes.size > 0) {
    conditions.push(
      isIn(DataKeys.DATA_CATEGORY, Array.from(general.productTypes))
    );
  }

  // Observation status
  if (general.rejected) {
    conditions.push(isIn(DataKeys.OBSERVATION_STATUS, [general.rejected]));
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
  console.log("XXX: ", rightAscensions, declinations);
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
    if (rightAscensions.length == 2) {
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
    if (declinations.length == 2) {
      const dec1 = declinations[0];
      const dec2 = declinations[1];
      if (dec1 < dec2) {
        conditions.push(
          greaterEqual(DataKeys.TARGET_DECLINATION, declinations[0])
        );
        conditions.push(
          lessEqual(DataKeys.TARGET_DECLINATION, declinations[1])
        );
      } else {
        conditions.push(
          greaterEqual(DataKeys.TARGET_DECLINATION, declinations[1])
        );
        conditions.push(
          lessEqual(DataKeys.TARGET_DECLINATION, declinations[0])
        );
      }
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

  // Remove "All" from every array.
  const detectorModes = withoutAll(telescope.detectorModes);
  const filters = withoutAll(telescope.filters);
  const hrsModes = withoutAll(telescope.hrsModes);
  const instruments = withoutAll(telescope.instruments);
  const instrumentModes = withoutAll(telescope.instrumentModes);
  const rssFabryPerotModes = withoutAll(telescope.rssFabryPerotModes);
  const rssGratings = withoutAll(telescope.rssGratings);
  const rssPolarimetryModes = withoutAll(telescope.rssPolarimetryModes);
  const telescopes = withoutAll(telescope.telescopes);

  // detector modes
  const conditions: IWhereCondition[] = [];
  if (detectorModes.length) {
    conditions.push(isIn(DataKeys.DETECTOR_MODE, detectorModes));
  }

  // filters
  if (filters.length) {
    conditions.push(isIn(DataKeys.FILTER, filters));
  }

  // HRS modes
  if (hrsModes.length) {
    conditions.push(isIn(DataKeys.HRS_MODE, hrsModes));
  }

  // instruments
  if (instruments.length) {
    conditions.push(isIn(DataKeys.INSTRUMENT_NAME, instruments));
  }

  // instrument modes
  if (instrumentModes.length) {
    conditions.push(isIn(DataKeys.INSTRUMENT_MODE, instrumentModes));
  }

  // RSS Fabry-Perot modes
  if (rssFabryPerotModes.length) {
    conditions.push(isIn(DataKeys.RSS_FABRY_PEROT_MODE, rssFabryPerotModes));
  }

  // RSS gratings
  if (rssGratings.length) {
    conditions.push(isIn(DataKeys.RSS_GRATING, rssGratings));
  }

  // Polarimetry patterns
  if (rssPolarimetryModes.length) {
    conditions.push(isIn(DataKeys.POLARIZATION_MODE, rssPolarimetryModes));
  }

  // Telescopes
  if (telescopes.length) {
    conditions.push(isIn(DataKeys.TELESCOPE_NAME, telescopes));
  }

  return and(conditions);
}

/**
 * Returns a copy of an array without any "All" element.
 *
 * An empty array is returned if undefined is passed as array.
 *
 * Parameters
 * ----------
 * items:
 *     Array.
 *
 * Returns
 * -------
 * A copy of the array without any "All" item.
 */
function withoutAll(items: string[] | undefined): string[] {
  if (!items) {
    return [];
  }
  if (items && items.some(item => item.toString() === "All")) {
    return [];
  }
  return [...items];
}
