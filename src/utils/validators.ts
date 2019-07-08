import {
  parseDate,
  parseDeclination,
  parseRightAscension
} from "../util/query/parse";

// TODO: Update once parse methods are available in util

/**
 * Check whether the string is a valid number.
 *
 * Parameters:
 * -----------
 * value : string
 *     The string to check.
 *
 * Returns:
 * --------
 * boolean :
 *    Whether the string is a valid number.
 */
export const isFloat = (value: string) => {
  return /^[-+]?([0-9]+(\.[0-9]*)?|\.[0-9]+)([eE][-+]?[0-9]+)?$/.test(value);
};

/**
 * Validate a date string.
 *
 * The string may contain either a single date or two dates separated by two or
 * more dots (e.g., 2019-07-08 .. 2019-07-11). Each date must be parsable by
 * MomentJS and must constitute a valid date. If a date range is given, the
 * first date must not be later than the second date.
 *
 * Empty strings are considered a valid value.
 *
 * Parameters:
 * -----------
 * date : string
 *     The string to check.
 *
 * Returns:
 * --------
 * string :
 *     The validation error, or undefined if there is none.
 */
export const validateDate = (date: string): string | undefined => {
  // Empty strings are valid
  if (!date) {
    return undefined;
  }

  // Split ranges by '..' (or '...' or '...', ...)
  const dates = date.split(/\s*\.{2,}\s*/);

  // Check that there is a date or a date range
  if (dates.length < 1 || dates.length > 2) {
    return `${date} is neither a date nor a date range.`;
  }

  // Validate all the date values
  for (const d of dates) {
    try {
      parseDate(d);
    } catch (e) {
      return `${d} is not a valid date.`;
    }
  }

  // In a date range the first date must not be later than the second
  if (dates.length > 1) {
    const date1 = parseDate(dates[0]);
    const date2 = parseDate(dates[1]);
    if (date1.isAfter(date2)) {
      return "In a date range the first date must not be later than the second date.";
    }
  }

  // The date string is valid
  return undefined;
};

/**
 * Validate a declination string.
 *
 * The string may contain either a single declination or two declinations
 * separated by two or more dots (e.g., 11.5 .. 12.6). Each declination may be
 * given as a single float or in degrees, arcminutes and arcseconds. In case of
 * the latter it does not matter what symbols are used to separate the degrees,
 * arcminutes and arcseconds.
 *
 * Empty strings are considered a valid value.
 *
 * Parameters:
 * -----------
 * dec : string
 *     The string to check.
 *
 * Returns:
 * --------
 * string :
 *    The validation error, or undefined if the string is valid.
 */
export const validateDeclination = (dec: string): string | undefined => {
  // Empty strings are valid
  if (!dec) {
    return undefined;
  }

  // Split ranges by '..' (or '...' or '...', ...)
  const declinations = dec.split(/\s*\.{2,}\s*/);

  // Check that there is a declination or a declination range
  if (declinations.length < 1 || declinations.length > 2) {
    return `${dec} is neither a declination nor a declination range.`;
  }

  // Validate all the declination values
  for (const declination of declinations) {
    try {
      parseDeclination(declination);
    } catch (e) {
      return e.message;
    }
  }

  // The declination string is valid
  return undefined;
};

/**
 * Validate a right ascension string.
 *
 * The string may contain either a single right ascension or two right
 * ascensions separated by two or more dots (e.g., 11.5 .. 12.6). Each right
 * ascension may be given as a single float or in hours, minutes and seconds. In
 * case of the latter it does not matter what symbols are used to separate the
 * hours, minutes and seconds.
 *
 * Empty strings are considered a valid value.
 *
 * Parameters:
 * -----------
 * ra : string
 *     The string to check.
 *
 * Returns:
 * --------
 * string :
 *    The validation error, or undefined if the string is valid.
 */
export const validateRightAscension = (ra: string): string | undefined => {
  // Empty strings are valid
  if (!ra) {
    return undefined;
  }

  // Split ranges by '..' (or '...' or '...', ...)
  const rightAscensions = ra.split(/\s*\.{2,}\s*/);

  // Check that there is a right ascension or a right ascension range
  if (rightAscensions.length < 1 || rightAscensions.length > 2) {
    return `${ra} is neither a right ascension nor a right ascension range. Ranges are indicated by two dots (e.g., 11 .. 12).`;
  }

  // Validate all the right ascension values
  for (const rightAscension of rightAscensions) {
    try {
      parseRightAscension(rightAscension);
    } catch (e) {
      return e.message;
    }
  }

  // The right ascension string is valid
  return undefined;
};

/**
 * Validate a search cone radius string.
 *
 * The radius must be a positive number.
 *
 * Empty strings are considered a valid value.
 *
 * Parameters:
 * -----------
 * radius : string
 *     The string to check.
 *
 * Returns:
 * --------
 * string :
 *    The validation error, or undefined if the string is valid.
 */
export const validateSearchConeRadius = (
  radius: string
): string | undefined => {
  // Empty strings are valid
  if (!radius) {
    return undefined;
  }

  // Validate the radius value
  if (!isFloat(radius) || Number(radius) <= 0) {
    return "The cone search radius must be a positive number.";
  }

  // The radius value is valid
  return undefined;
};

/**
 * Test if any of the given error groups (i.e. objects of error keys and
 * values) has a truthy value for any of its keys.
 *
 * Parameters
 * ----------
 * errorGroups:
 *     Objects of error keys and values.
 *
 * Returns
 * -------
 * isError:
 *     Whether any of the error groups has a truthy value.
 */
export const isError = (...errorGroups: object[]) => {
  return errorGroups.some((errorGroup: object) =>
    Object.keys(errorGroup).some(key => (errorGroup as any)[key])
  );
};
