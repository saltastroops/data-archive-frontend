import moment from "moment";

const isFloat = (value: string) => {
  const floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
  if (!floatRegex.test(value)) {
    return false;
  }
  return !isNaN(parseFloat(value));
};

const raTimeError = (time: string) => {
  // regular expression to match required time format
  const re = /^(\d{1,2}):(\d{2}):(\d{2})([ap]m)?$/;

  const regs: any = time.match(re);
  if (regs) {
    if (regs[4] === "am" || regs[4] === "pm") {
      // 12-hour value between 1 and 12
      if (regs[1] < 1 || regs[1] > 12) {
        return "Invalid value for hours: " + regs[1];
      }
    } else {
      // 24-hour value between 0 and 23
      if (regs[1] > 23) {
        return "Invalid value for hours: " + regs[1];
      }
    }
    // minute value between 0 and 59
    if (regs[2] > 59) {
      return "Invalid value for minutes: " + regs[2];
    }
    // seconds value between 0 and 59
    if (regs[3] > 59) {
      return "Invalid value for minutes: " + regs[3];
    }
  } else {
    return "";
  }
};

const raDmsError = (dms: string) => {
  let error = "";
  const decArray = dms.split(/[^0-9\-.,]+/).filter(d => d !== "");
  decArray.forEach(r => {
    if (!isFloat(r)) {
      error = 'Values should not be separated by "," or "."';
    }
  });
  if (-180 > parseFloat(decArray[0]) || parseFloat(decArray[0]) > 180) {
    error =
      "Declination should be between -180D 0M 0S and 180D 0M 0S degrees.\n";
  }

  if (
    (parseFloat(decArray[0]) === 180 || parseFloat(decArray[0]) === -180) &&
    (parseFloat(decArray[1]) > 0 || parseFloat(decArray[2]) > 0)
  ) {
    error =
      "Declination should be between -180D 0M 0S and 180D 0M 0S degrees.\n";
  }
  return error;
};

export const validateDec = (dec: string) => {
  if (dec.replace(/\s/g, "") === "" || dec === null || dec === undefined) {
    return "";
  }
  if (isFloat(dec)) {
    return -90 <= parseFloat(dec) && parseFloat(dec) <= 80
      ? ""
      : "Declination should be between -90 and 90 degrees";
  }
  const decArray = dec.split(/[^0-9\-.,]+/).filter(d => d !== "");
  let error = "";
  decArray.forEach(d => {
    if (!isFloat(d)) {
      error = 'Values should not be separated by "," or "."';
    }
  });
  if (-90 > parseFloat(decArray[0]) || parseFloat(decArray[0]) > 80) {
    error = "Declination should be between -90D 0M 0S and 80D 0M 0S degrees.\n";
  }

  if (
    (parseFloat(decArray[0]) === 80 || parseFloat(decArray[0]) === -90) &&
    (parseFloat(decArray[1]) > 0 || parseFloat(decArray[2]) > 0)
  ) {
    error = "Declination should be between -90D 0M 0S and 80D 0M 0S degrees.\n";
  }
  return error;
};

export const validateName = (name: string) => {
  return "";
};

export const validateRa = (ra: string) => {
  let error = "";
  if (ra.replace(/\s/g, "") === "" || ra === null || ra === undefined) {
    return "";
  }
  if (isFloat(ra)) {
    return -180 <= parseFloat(ra) && parseFloat(ra) <= 180
      ? ""
      : "Declination should be between -180 and 180 degrees";
  }

  try {
    error = raTimeError(ra) || "";
    if (error !== "") {
      return error;
    }
    error = raDmsError(ra);
  } catch (e) {
    error = raDmsError(ra);
  }
  return error;
};

export const validateRadius = (radius: string) => {
  if (
    radius.replace(/\s/g, "") === "" ||
    radius === null ||
    radius === undefined
  ) {
    return "";
  }
  return isFloat(radius) ? "" : "This should only be a floating point number.";
};

export const validateDate = (date: string) => {
  if (date.replace(/\s/g, "") === "" || date === null || date === undefined) {
    return "";
  }
  const re = /^(\d{2,4})\W(\d{2})\W(\d{2,4})$/;
  const regs: any = date.match(re);
  if (!regs || !moment(date).isValid()) {
    return "You have an invalid date";
  }
  return "";
};
