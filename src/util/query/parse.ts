import isNumber from "is-number";
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
 * The date must be either of the form "yyyy-mm-dd", "dd mmmm yyyy" or
 * "mmmm dd, yyyy", where mmmm is the month's full or abbreviated name.
 * Single-digit days may (but need not) have a leading zero.
 *
 * Examples of valid date strings:
 *
 * 2019-07-08
 * Jul 7, 2019
 * Jul 07, 2019
 * 7 Jul 2019
 * 07 Jul 2019
 * July 7, 2019
 * July 07, 2019
 * 7 July 2019
 * 07 July 2019
 *
 * The date is assumed to be given as UTC.
 */
export function parseDate(date: string) {
  const dateFormats = [
    "YYYY-MM-DD", // 2019-10-04
    "MMM D, YYYY", // Oct 4, 2019
    "MMM DD, YYYY", // Oct 04, 2019
    "MMMM D, YYYY", // October 4, 2019
    "MMMM DD, YYYY", // October 04, 2019
    "D MMM YYYY", // 4 Oct 2019
    "DD MMM YYYY", // 04 Oct 2019
    "D MMMM YYYY", // 4 October 2019
    "DD MMMM YYYY" // 04 October 2019
  ];
  const t = moment.utc(date, dateFormats, true);
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
 * 6. If the lower limit is greater than the upper limit in a declination range,
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
    // Split ranges by '..' (or '..' or '...', ...)
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

/**
 * Parse a string as a right ascension.
 *
 * The right ascension may be given as a number of degrees between 0 and 360
 * degrees or in hours, minutes and seconds.
 *
 * When giving the right ascension as hours, minutes and seconds, you may use
 * any non-digit as separator - including minus signs. So, for example, the
 * strings "1h 2m 3s", "1h2m3s", "1 2 3", "1 -2 -3" and "1s 2h 3m" all refer to
 * the same right ascension.
 *
 * Minutes and seconds may be omitted; a default 0 is assumed. If no minutes and
 * seconds are included, the following rules are used to distinguish between
 * degrees and hours:
 *
 * 1. If no units are given, the value is assumed to be in degrees.
 * 2. In all other cases the value is assumed to be in hours.
 *
 * It is not possible to just omit the minutes,
 *
 * Examples for valid numbers of degrees:
 *
 * 0
 * 5.78
 * 167
 * 218.0754
 * 360
 *
 * Examples for valid hour, second, minute strings:
 *
 * 0h00m00s
 * 0h 00m 00s
 * 07 08m 9.87
 * 4.89h
 * 4.89 h
 * 4.89 hours
 * 4.89 H
 * 4 7
 * 7 8 9.87
 * 7 -8 -9.87 (interpreted as 7h 8h 9.87s)
 * 23-14-59.9
 * 24 00 00
 *
 * The right ascension is returned in degrees. An error is thrown if the given
 * value is invalid.
 *
 * Parameters:
 * -----------
 * ra:
 *     Right ascension, in degrees or hours, minutes, seconds.
 *
 * Returns:
 * --------
 * The right ascension in degrees.
 */
export function parseRightAscension(ra: string): number {
  const trimmedRA = ra.trim();

  const ERROR = `${trimmedRA} is not a valid right ascension. Right ascensions must be given as a number of degrees or as hours, minutes and seconds. The value must be between 0 and 360 degrees (24 hours).`;

  let value = 0;
  if (isNumber(trimmedRA)) {
    value += parseFloat(trimmedRA);
  } else {
    // Hours
    const [hours, minutes, seconds, ...rest] = trimmedRA.split(/[^\d.]+/);
    if (!isNumber(hours)) {
      throw new Error(ERROR);
    }
    if (hours.match(/^\d+$/)) {
      value += 15 * parseInt(hours, 10);
    } else {
      if (minutes) {
        // Float values are only allowed if there are no minutes
        throw new Error(ERROR);
      }
      value += 15 * parseFloat(hours);
    }

    // Minutes
    if (minutes) {
      if (!minutes.match(/^\d+$/)) {
        throw new Error(ERROR);
      }
      const minuteValue = parseInt(minutes, 10);
      if (minuteValue > 59) {
        throw new Error(ERROR);
      }
      value += (15 * minuteValue) / 60;
    }

    // Arcseconds
    if (seconds) {
      if (!isNumber(seconds)) {
        throw new Error(ERROR);
      }
      const secondValue = parseFloat(seconds);
      if (secondValue >= 60) {
        throw new Error(ERROR);
      }
      value += (15 * secondValue) / 3600;
    }

    // Make sure no content is left in the string
    if (rest[0]) {
      throw new Error(ERROR);
    }
  }

  // Check that the value lies in the valid range
  if (value < 0 || value > 360) {
    throw new Error(ERROR);
  }

  return value;
}

/**
 * Parse a string to a declination.
 *
 * The declination may be given as a number of degrees or as degrees, arcminutes
 * and arcseconds. It must be between -90 and 90 degrees.
 *
 * When giving the declination in degrees, arcminutes and arcseconds, you may
 * use any non-digit other than the dot as separator - including minus signs. So
 * So, for example, the strings "1° 2′ 3″", "1d2m3s", "1 2 3", "1 -2 -3" and
 * "1″ 2° 3′" all refer to the same declination.
 *
 * Arcnminutes and arcseconds may be omitted; a default of 0 is assumed. It is
 * not a possible to just omit arcminutes.
 *
 * Examples for valid numbers of degrees:
 *
 * -90
 * -53.246
 * 0
 * 7.957d
 * 8.0°
 * +15
 * 90
 *
 * Examples for valid degrees, arcminutes, arcseconds:
 *
 * -78° 06′ 05″
 * -78 6 5
 * -14 8
 * -11 -8 -34 (interpreted as -11° 08′ 34″)
 * -0 17 8
 * 0 0 01
 * +0008 06
 * 88d 17m 1s
 *
 * Examples for invalid values:
 *
 * -90.001
 * 90.001
 * 15 7.
 * 15 7.988
 * 15 h 7.988 s
 *
 * The declination is returned in degrees. An error is thrown if the given value
 * is invalid.
 *
 * Parameters:
 * -----------
 * dec:
 *     Declination, in degrees or as degrees, arcminutes, arcseconds.
 *
 * Returns:
 * --------
 * The declination, in degrees.
 */
export function parseDeclination(dec: string): number {
  const trimmedDec = dec.trim();

  const ERROR = `${trimmedDec} is not a valid declination. Declinations must be given as a number of degrees or as degrees, arcminutes and arcseconds. The value must be between -90 and 90 degrees.`;

  // Get the sign and the absolute value
  const regex = /^[+-]?(\d.*)$/;
  const matches = trimmedDec.match(regex);
  if (!matches) {
    throw new Error(ERROR);
  }
  const signFactor = trimmedDec.startsWith("-") ? -1 : 1;
  const absolute = matches[1];

  let value = 0;
  if (isNumber(absolute)) {
    value += parseFloat(absolute);
  } else {
    // Degrees
    const [degrees, arcminutes, arcseconds, ...rest] = absolute.split(
      /[^\d.]+/
    );
    if (!isNumber(degrees)) {
      throw new Error(ERROR);
    }
    if (degrees.match(/^\d+$/)) {
      value += parseInt(degrees, 10);
    } else {
      if (arcminutes) {
        // Float values are only allowed if there are no arcminutes
        throw new Error(ERROR);
      }
      value += parseFloat(degrees);
    }

    // Arcminutes
    if (arcminutes) {
      if (!arcminutes.match(/^\d+$/)) {
        throw new Error(ERROR);
      }
      const arcminuteValue = parseInt(arcminutes, 10);
      if (arcminuteValue > 59) {
        throw new Error(ERROR);
      }
      value += arcminuteValue / 60;
    }

    // Arcseconds
    if (arcseconds) {
      if (!isNumber(arcseconds)) {
        throw new Error(ERROR);
      }
      const arcsecondValue = parseFloat(arcseconds);
      if (arcsecondValue >= 60) {
        throw new Error(ERROR);
      }
      value += arcsecondValue / 3600;
    }

    // Make sure no content is left in the string
    if (rest[0]) {
      throw new Error(ERROR);
    }
  }

  //  Apply the sign
  value *= signFactor;

  // Check that the value lies in the valid range
  if (value < -90 || value > 90) {
    throw new Error(ERROR);
  }

  return value;
}
