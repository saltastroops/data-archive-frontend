import moment from "moment";
import { IGeneralErrors, ITargetErrors } from "./ObservationQueryParameters";

// TODO: Update once parse methods are available in util

/**
 * A method used to check if the given value(string) is a floating point number
 *
 * @param value:
 *     A string value to tested.
 * @return Boolean:
 *        True if the value is a float else false.
 */
export const isFloat = (value: string) => {
  const floatRegex = /^-?\d+(?:[.,]\d*?)?$/; // check optional sign, check decimal and check optional "." or "," followed by optional decimal
  if (!floatRegex.test(value)) {
    return false;
  }
  return !isNaN(parseFloat(value));
};

/**
 * This method check is given right ascension is within range and a correct time format (HH:MM:SS)
 *
 * @param time
 *    String representing Degrees arc minutes arc seconds
 * @return String/undefined
 *    String Error ifvtime can't be verified to be a aa valid time else nothing
 */
const raTimeError = (time: string) => {
  // regular expression to match required time format
  const re = /^(\d+):(\d+):(\d+)$/;

  const regs: any = time.match(re);
  if (regs) {
    // 24-hour value between 0 and 23
    if (regs[1] > 23) {
      return "Invalid value for hours: " + regs[1];
    }
    // minute value between 0 and 59
    if (regs[2] > 59) {
      return "Invalid value for minutes: " + regs[2];
    }
    // seconds value between 0 and 59
    if (regs[3] > 59) {
      return "Invalid value for seconds: " + regs[3];
    }
    return;
  } else {
    return "Right ascension should be in degrees or HH:MM:SS only";
  }
};

/**
 * This method check is given declination is within range
 *
 * @param degree
 *    String a float number
 * @return
 *    Error or nothing/undefined
 */
const validateDecDegrees = (degree: string) => {
  if (parseFloat(degree) < -90 || parseFloat(degree) > 90) {
    return "Declination should be between -90 and 90 degrees";
  }
  return;
};

/**
 * This method check is given declination is within range and a correct DMS
 *
 * @param dms
 *    String representing Degrees arc minutes arc seconds
 * @return String/undefined
 *    String Error if dms can't be verified to be a aa valid DMS else nothing
 */
const validateDecDms = (dms: string) => {
  const decs = dms.split(/[^0-9]+/).filter(d => d !== ""); // Split string at none numbers and remove white space and empty string
  if (!decs || decs.length !== 3) {
    // expecting 3 numbers separated by any thing else it should fail
    return "Declination should be in degrees or Degree:minutes:seconds";
  }
  if (-90 > parseFloat(decs[0]) || parseFloat(decs[0]) > 90) {
    // degress are between -90 and 90
    return "Declination should be between -90D 0M 0S and 90D 0M 0S degrees.\n";
  }
  if (
    (parseFloat(decs[0]) === 90 || parseFloat(decs[0]) === -90) &&
    (parseFloat(decs[1]) !== 0 || parseFloat(decs[2]) !== 0)
  ) {
    //
    return "Declination should be between -90D 0M 0S and 90D 0M 0S degrees.\n";
  }
  if (
    parseFloat(decs[1]) < 0 ||
    parseFloat(decs[1]) > 59 ||
    parseFloat(decs[2]) < 0 ||
    parseFloat(decs[2]) > 59
  ) {
    return "Declination minutes and seconds should be between 0 and 59";
  }
  return;
};

/**
 * This method test if string is a declination
 * It only accept two notation D"M'S and degrees else error
 *
 * @param dec:
 *     A string value to tested.
 * @return
 *    Error if string can not be a declination. else nothing
 */
export const validateDeclination = (dec: string) => {
  if (dec.trim() === "" || dec === null || dec === undefined) {
    return;
  }
  if (isFloat(dec)) {
    return validateDecDegrees(dec.trim());
  }

  let error;
  const decs = dec.split("..");
  if (decs.length === 1) {
    error = validateDecDms(dec.trim());
    if (error || error !== "") {
      return error;
    }
  }

  if (decs.length > 2) {
    return "Only two values of declination are allowed";
  }
  if (decs.length === 2) {
    // dec range
    const dec0 = decs[0].trim();
    const dec1 = decs[1].trim();
    if (isFloat(dec0) && isFloat(dec1)) {
      return validateDecDegrees(dec0) || validateDecDegrees(dec1);
    }
    return validateDecDms(dec0) || validateDecDms(dec1);
  }

  return;
};

export const validateName = () => {
  return "";
};

/**
 * This method test if string is a right ascension for range values need to separated by '..'
 * It only accept two notation HH:MM:SS and degrees else error
 *
 * @param ra:
 *     A string value to tested.
 * @return
 *    Error if string can not be a right ascension. else nothing
 */
export const validateRightAscension = (ra: string) => {
  let error = "";
  if (ra.trim() === "" || ra === null || ra === undefined) {
    return;
  }
  if (isFloat(ra)) {
    return 0 <= parseFloat(ra) && parseFloat(ra) <= 360
      ? undefined
      : "Declination should be between 0 and 360 degrees";
  }
  const ras = ra.split("..");
  if (ras.length > 2) {
    return 'Only two right ascension are permitted separated by ".."';
  }
  try {
    if (ras.length === 2) {
      const ra0 = ras[0].trim();
      const ra1 = ras[1].trim();
      if (isFloat(ra0)) {
        return 0 <= parseFloat(ra0) && parseFloat(ra0) <= 360
          ? undefined
          : "Declination should be between 0 and 360 degrees";
      }
      if (isFloat(ra1)) {
        return 0 <= parseFloat(ra1) && parseFloat(ra1) <= 360
          ? undefined
          : "Declination should be between 0 and 360 degrees";
      }
      error = raTimeError(ra1) || raTimeError(ra0) || "";
      if (error !== "") {
        return error;
      }
    }
    if (ras.length === 1) {
      error = raTimeError(ra) || "";
      if (error !== "") {
        return error;
      }
    }
  } catch (e) {
    return 'Invalid right ascension please use degrees or "HH:MM:SS"';
  }
  return;
};

/**
 * This method test if string can is a date(s)
 * Date range is separated by '..'
 *
 * @param date:
 *     A string value to tested.
 * @return :
 *    Error if string can not be a date. else nothing
 */
export const validateDate = (date: string) => {
  if (date === null || date === undefined || date.trim() === "") {
    return;
  }
  const re = /^(\d{4})-(\d{2})-(\d{2})$/;
  const regs: any = date.match(re);

  const dates = date.split("..");
  if (dates.length > 2) {
    return "Only two dates are permitted.";
  }
  if (dates.length === 2) {
    const day0 = dates[0].trim();
    const day1 = dates[1].trim();
    if (
      !day0.match(re) ||
      !day1.match(re) ||
      !moment(day0, "YYYY-MM-DD", true).isValid() ||
      !moment(day1, "YYYY-MM-DD", true).isValid()
    ) {
      return "You have an invalid date.";
    }
  }
  if (dates.length === 1) {
    if (
      !date.match(re) ||
      (!moment(date, "YYYY-MM-DD", true).isValid() || !regs)
    ) {
      return "You have an invalid date.";
    }
  }
  return;
};

export const validateSearchConeRadius = (radius: string) => {
  if (radius.trim() === "" || radius === null || radius === undefined) {
    return;
  }
  if (isFloat(radius) && parseFloat(radius) >= 0) {
    return;
  }
  return "Search radius should be a floating point number greater and zero.";
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
