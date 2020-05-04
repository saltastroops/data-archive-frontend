import {
  IGeneralErrors,
  ITargetErrors
} from "../../utils/ObservationQueryParameters";
import {
  isError,
  isFloat,
  validateDate,
  validateDeclination,
  validateRightAscension
} from "../../utils/validators";

describe("isFloat should be true if value is float else false", () => {
  it("Should be true", () => {
    expect(isFloat("1.1")).toBe(true);
    expect(isFloat("1")).toBe(true);
    expect(isFloat("1111.11")).toBe(true);
    expect(isFloat("1.1")).toBe(true);
  });
  it("Should be true for numbers", () => {
    let value: any; // Fool TypeScript any type
    value = 12.12;
    expect(isFloat(value)).toBe(true);
    value = 1212;
    expect(isFloat(value)).toBe(true);
    value = 1;
    expect(isFloat(value)).toBe(true);
    value = 12;
    expect(isFloat(value)).toBe(true);
  });
  it("Should be true for array containing only one truthful value", () => {
    let value: any; // Fool TypeScript any type
    value = [12.12];
    expect(isFloat(value)).toBe(true);
    value = ["12.12"];
    expect(isFloat(value)).toBe(true);
    value = [1];
    expect(isFloat(value)).toBe(true);
    value = ["12."];
    expect(isFloat(value)).toBe(true);
  });
  it("Should be false for non-floats", () => {
    expect(isFloat("1.1.")).toBe(false);
    expect(isFloat("1,1")).toBe(false);
    expect(isFloat("1,1,")).toBe(false);
    expect(isFloat("")).toBe(false);
    expect(isFloat("1as")).toBe(false);
    expect(isFloat("11,11.11")).toBe(false);
    expect(isFloat("1ton")).toBe(false);
  });
  it("Should be false for non-string values", () => {
    let value: any; // Fool TypeScript any type
    value = null;
    expect(isFloat(value)).toBe(false);
    value = undefined;
    expect(isFloat(value)).toBe(false);
    value = { value: "1.1" };
    expect(isFloat(value)).toBe(false);
    value = ["20.12", "1.1"];
    expect(isFloat(value)).toBe(false);
  });
});

describe("Validate date", () => {
  it("should return error if date is not in a right format", () => {
    expect(validateDate("1")).toContain("not a valid date");
    expect(validateDate("20190101")).toContain("not a valid date");
    expect(validateDate("2019/01/01")).toContain("not a valid date");
    expect(validateDate("2019.01.01")).toContain("not a valid date");
    expect(validateDate("2019 01 01")).toContain("not a valid date");
    expect(validateDate("19-01-2019")).toContain("not a valid date");
    expect(validateDate("201-10-10")).toContain("not a valid date");
    expect(validateDate("2019-1-10")).toContain("not a valid date");
    expect(validateDate("2019-10-1")).toContain("not a valid date");
  });
  it("should return error if day doesnt belong to month or not a month", () => {
    expect(validateDate("1")).toContain("not a valid date");
    expect(validateDate("2019-01-34")).toContain("not a valid date");
    expect(validateDate("2019-13-34")).toContain("not a valid date");
    expect(validateDate("2019-13-01")).toContain("not a valid date");
    expect(validateDate("2019-02-29")).toContain("not a valid date");
  });
  it("should return undefined if the date is valid", () => {
    expect(validateDate("2019-01-01")).toBe(undefined);
    expect(validateDate("2017-06-25")).toBe(undefined);
    expect(validateDate("1111-12-31")).toBe(undefined);
    expect(validateDate("Oct 16, 2019")).toBe(undefined);
    expect(validateDate("Oct 8, 2019")).toBe(undefined);
    expect(validateDate("Oct 08, 2019")).toBe(undefined);
    expect(validateDate("16 Jun 2018")).toBe(undefined);
    expect(validateDate("9 Jun 2018")).toBe(undefined);
    expect(validateDate("09 Jun 2018")).toBe(undefined);
    expect(validateDate("August 28, 2019")).toBe(undefined);
    expect(validateDate("August 8, 2019")).toBe(undefined);
    expect(validateDate("August 08, 2019")).toBe(undefined);
    expect(validateDate("21 September 2019")).toBe(undefined);
    expect(validateDate("1 September 2019")).toBe(undefined);
    expect(validateDate("01 September 2019")).toBe(undefined);
  });
  it("should return undefined if date is empty, null or undefined", () => {
    let date: any;
    date = null;
    expect(validateDate(date)).toBe(undefined);
    date = undefined;
    expect(validateDate(date)).toBe(undefined);
  });
  it("should return error if date is not in a right format for date range ", () => {
    expect(validateDate("1")).toContain("not a valid date");
    expect(validateDate("20190101 .. 2019-09-01")).toContain(
      "not a valid date"
    );
    expect(validateDate("2019/01/01 .. 2019-09-01")).toContain(
      "not a valid date"
    );
    expect(validateDate("2019.01.01 .. 2019-09-01")).toContain(
      "not a valid date"
    );
    expect(validateDate("2019 01 01 .. 2019-09-01")).toContain(
      "not a valid date"
    );
    expect(validateDate("19-01-2019 .. 2019-09-01")).toContain(
      "not a valid date"
    );
    expect(validateDate("201-10-10 .. 2019-09-01")).toContain(
      "not a valid date"
    );
    expect(validateDate("2019-1-10 .. 2019-09-01")).toContain(
      "not a valid date"
    );
    expect(validateDate("2019-10-1 .. 2019-09-01")).toContain(
      "not a valid date"
    );
  });
  it("should return error if day doesnt belong to month or not a month for date range", () => {
    expect(validateDate("1")).toContain("not a valid date");
    expect(validateDate("2019-01-01 .. 2019-01-34")).toContain(
      "not a valid date"
    );
    expect(validateDate("2019-01-01 .. 2019-13-34")).toContain(
      "not a valid date"
    );
    expect(validateDate("2019-01-01 .. 2019-13-01")).toContain(
      "not a valid date"
    );
    expect(validateDate("2019-01-01 .. 2019-02-29")).toContain(
      "not a valid date"
    );
  });
  it("should return undefined if both date are valid for date range", () => {
    expect(validateDate("2019-01-01 .. 2019-01-01")).toBe(undefined);
    expect(validateDate("2017-06-25 .. 2019-01-01")).toBe(undefined);
    expect(validateDate("1111-12-31 .. 2019-01-01")).toBe(undefined);
  });
});

describe("validateRightAscension", () => {
  it("Should return error if ra is not a correct format", () => {
    expect(validateRightAscension("hello")).toContain(
      "not a valid right ascension"
    );
    expect(validateRightAscension("123.123.123")).toContain(
      "not a valid right ascension"
    );
    expect(validateRightAscension("236hello")).toContain(
      "not a valid right ascension"
    );
    expect(validateRightAscension("any thing")).toContain(
      "not a valid right ascension"
    );
  });
  it("Should give appropriate message", () => {
    expect(validateRightAscension("25:22:11")).toContain(
      "not a valid right ascension"
    );
    expect(validateRightAscension("20:70:11")).toContain(
      "not a valid right ascension"
    );
    expect(validateRightAscension("20:22:70")).toContain(
      "not a valid right ascension"
    );
    expect(validateRightAscension("370")).toContain(
      "not a valid right ascension"
    );
  });
  it("should work for a single value", () => {
    expect(validateRightAscension("20")).toBe(undefined);
    expect(validateRightAscension("20:04")).toBe(undefined);
    expect(validateRightAscension("20:04:12")).toBe(undefined);
    expect(validateRightAscension("20:39:12")).toBe(undefined);
    expect(validateRightAscension("20.5")).toBe(undefined);
    expect(validateRightAscension("320")).toBe(undefined);
  });
  it("should work for a range", () => {
    expect(validateRightAscension("25:22:11 .. 20:20:20")).toContain(
      "not a valid right ascension"
    );
    expect(validateRightAscension("20:20:20 .. ")).toContain(
      "not a valid right ascension"
    );
    expect(validateRightAscension("20:22:00 .. 20:20:70")).toContain(
      "not a valid right ascension"
    );
    expect(validateRightAscension("370 .. 20:20:20")).toContain(
      "not a valid right ascension"
    );
    expect(validateRightAscension("20:34:12 .. 20:20:20")).toBe(undefined);
    expect(validateRightAscension("20:04:12 .. 20:20:20")).toBe(undefined);
    expect(validateRightAscension("20:39:12 .. 20:20:20")).toBe(undefined);
    expect(validateRightAscension("20.5 .. 20")).toBe(undefined);
    expect(validateRightAscension("320 .. 20")).toBe(undefined);
  });
});

describe("validateDeclination", () => {
  it("Should return error if ra is not a correct format", () => {
    expect(validateDeclination("hello")).toContain("not a valid declination");
    expect(validateDeclination("123.123.123")).toContain(
      "not a valid declination"
    );
    expect(validateDeclination("236hello")).toContain(
      "not a valid declination"
    );
    expect(validateDeclination("any thing")).toContain(
      "not a valid declination"
    );
  });
  it("Should give appropriate message", () => {
    expect(validateDeclination("25:22:111")).toContain(
      "not a valid declination"
    );
    expect(validateDeclination("20:70:11")).toContain(
      "not a valid declination"
    );
    expect(validateDeclination("20:22:70")).toContain(
      "not a valid declination"
    );
    expect(validateDeclination("370")).toContain("not a valid declination");
  });
  it("should work for a single value", () => {
    expect(validateDeclination("20D34M12S")).toBe(undefined);
    expect(validateDeclination("20:04:12")).toBe(undefined);
    expect(validateDeclination("20:39:12")).toBe(undefined);
    expect(validateDeclination("20.5")).toBe(undefined);
    expect(validateDeclination("70")).toBe(undefined);
  });
  it("Should work for a range", () => {
    expect(validateDeclination("20:20:20 .. ")).toContain(
      "not a valid declination"
    );
    expect(validateDeclination("20:22:00 .. 20:20:70")).toContain(
      "not a valid declination"
    );
    expect(validateDeclination("370 .. 20:20:20")).toContain(
      "not a valid declination"
    );
    expect(validateDeclination("20:34 .. 22:20:60")).toContain(
      "not a valid declination"
    );
  });
});

/**
 * Test of isError to check if the search form state has an error
 */
describe("isError", () => {
  it("should be true of there is an error in the general state", () => {
    let generalError: IGeneralErrors = {
      observationNight: "Error"
    };
    expect(isError(generalError, {})).toBeTruthy();
    generalError = {
      proposalCode: "Error"
    };
    expect(isError(generalError, {})).toBeTruthy();
  });
  it("should be true if general has more than one error", () => {
    const generalError: IGeneralErrors = {
      observationNight: "Error",
      principalInvestigator: "Error"
    };
    expect(isError(generalError, {})).toBeTruthy();
  });
  it("should be false if there is no general errors", () => {
    expect(isError({}, {})).toBeFalsy();
    expect(isError({ arcs: "" } as IGeneralErrors, {})).toBeFalsy();
    expect(
      isError({ observationNight: undefined } as IGeneralErrors, {})
    ).toBeFalsy();
  });

  it("should be true of there is an error in the target state", () => {
    let targetError: ITargetErrors = {
      rightAscension: "Error"
    };
    expect(isError({}, targetError)).toBeTruthy();
    targetError = {
      declination: "Error"
    };
    expect(isError({}, targetError)).toBeTruthy();
  });
  it("should be true if target has more than one error", () => {
    const targetError: ITargetErrors = {
      declination: "Error",
      name: "Error",
      rightAscension: "Error"
    };
    expect(isError({}, targetError)).toBeTruthy();
  });
  it("should be false if there is no error", () => {
    expect(isError({}, {})).toBeFalsy();
    expect(isError({}, { declination: "" } as ITargetErrors)).toBeFalsy();
    expect(
      isError({}, { rightAscension: undefined } as ITargetErrors)
    ).toBeFalsy();
  });
  it("should be true if both have errors", () => {
    expect(
      isError(
        { observationNight: "Error" } as IGeneralErrors,
        { name: "Error" } as ITargetErrors
      )
    ).toBeTruthy();
  });
});
