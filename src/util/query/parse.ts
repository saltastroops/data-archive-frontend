import moment from "moment";
import { ITarget, ITargetPosition } from "./types";

/**
 * The default radius to use for cone searches and coordinate ranges, in
 * degrees.
 */
export const DEFAULT_COORDINATE_SEARCH_RADIUS = 0.05;

/**
 * The maximum allowed radius for a cone search, in degrees.
 */
export const MAXIMUM_COORDINATE_SEARCH_RADIUS = 10;

/**
 * Parse the given string as a date, and return the date as a string as a
 * Moment instance.
 *
 * Thec string must have the format 'YYYY-MM-DD', and it must be a valid date.
 *
 * The date is assumed to be given as UTC.
 */
export function parseDate(date: string) {
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
  const rightAscension = trim(target.rightAscension);
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
      rightAscensionValues.length === 2 &&
      rightAscensionValues[0] === rightAscensionValues[1]
    ) {
      throw new Error("The right ascension range must not have length 0.");
    }
  }

  // Parse the declination(s)
  let declinationValues: number[] = [];
  const declination = trim(target.declination);
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
      declinationValues.length === 2 &&
      declinationValues[0] === declinationValues[1]
    ) {
      throw new Error("The declination range must not have length 0.");
    }
  }

  // There is no need to proceed if there are no coordinates
  if (!rightAscension && !declination) {
    return {
      declinations: [],
      rightAscensions: [],
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
    declinations: declinationValues,
    rightAscensions: rightAscensionValues,
    searchConeRadius: searchConeRadiusValue
  };
}

/**
 * Remove leading and trailing white space from a string.
 *
 * Parameters:
 * -----------
 * value:
 *     The string to trim.
 *
 * Returns:
 * --------
 * trimmed:
 *     The trimmed string.
 */
export function trim(value: string | null | undefined) {
  if (value) {
    return value.trim();
  }
  return value;
}

// TODO: Replace with preoper parsing

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
