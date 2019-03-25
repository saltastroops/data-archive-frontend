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
    expect(isFloat("1,1")).toBe(true);
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
  it("Should be false for none floats", () => {
    expect(isFloat("1.1.")).toBe(false);
    expect(isFloat("1,1,")).toBe(false);
    expect(isFloat("")).toBe(false);
    expect(isFloat("1as")).toBe(false);
    expect(isFloat("11,11.11")).toBe(false);
    expect(isFloat("1ton")).toBe(false);
  });
  it("Should be false for none string value", () => {
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
    expect(validateDate("1")).toContain("invalid date");
    expect(validateDate("20190101")).toContain("invalid date");
    expect(validateDate("2019/01/01")).toContain("invalid date");
    expect(validateDate("2019.01.01")).toContain("invalid date");
    expect(validateDate("2019 01 01")).toContain("invalid date");
    expect(validateDate("19-01-2019")).toContain("invalid date");
    expect(validateDate("201-10-10")).toContain("invalid date");
    expect(validateDate("2019-1-10")).toContain("invalid date");
    expect(validateDate("2019-10-1")).toContain("invalid date");
  });
  it("should return error if day doesnt belong to month or not a month", () => {
    expect(validateDate("1")).toContain("invalid date");
    expect(validateDate("2019-01-34")).toContain("invalid date");
    expect(validateDate("2019-13-34")).toContain("invalid date");
    expect(validateDate("2019-13-01")).toContain("invalid date");
    expect(validateDate("2019-02-29")).toContain("invalid date");
  });
  it("should return undefined if there is date is valid", () => {
    expect(validateDate("2019-01-01")).toBe(undefined);
    expect(validateDate("2017-06-25")).toBe(undefined);
    expect(validateDate("1111-12-31")).toBe(undefined);
  });
  it("should return  undefined if date is empty, null, white space(s) or undefined", () => {
    let date: any;
    date = null;
    expect(validateDate(date)).toBe(undefined);
    date = undefined;
    expect(validateDate(date)).toBe(undefined);
    date = "  ";
    expect(validateDate(date)).toBe(undefined);
    date = "\t";
    expect(validateDate(date)).toBe(undefined);
    date = "\n";
    expect(validateDate(date)).toBe(undefined);
    date = " \t \n";
    expect(validateDate(date)).toBe(undefined);
  });
  it("Should return error if date is not in a right format for date range ", () => {
    expect(validateDate("1")).toContain("invalid date");
    expect(validateDate("20190101 .. 2019-09-01")).toContain("invalid date");
    expect(validateDate("2019/01/01 .. 2019-09-01")).toContain("invalid date");
    expect(validateDate("2019.01.01 .. 2019-09-01")).toContain("invalid date");
    expect(validateDate("2019 01 01 .. 2019-09-01")).toContain("invalid date");
    expect(validateDate("19-01-2019 .. 2019-09-01")).toContain("invalid date");
    expect(validateDate("201-10-10 .. 2019-09-01")).toContain("invalid date");
    expect(validateDate("2019-1-10 .. 2019-09-01")).toContain("invalid date");
    expect(validateDate("2019-10-1 .. 2019-09-01")).toContain("invalid date");
  });
  it("should return error if day doesnt belong to month or not a month for date range", () => {
    expect(validateDate("1")).toContain("invalid date");
    expect(validateDate("2019-01-01 .. 2019-01-34")).toContain("invalid date");
    expect(validateDate("2019-01-01 .. 2019-13-34")).toContain("invalid date");
    expect(validateDate("2019-01-01 .. 2019-13-01")).toContain("invalid date");
    expect(validateDate("2019-01-01 .. 2019-02-29")).toContain("invalid date");
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
      "should be in degrees or HH:MM:SS"
    );
    expect(validateRightAscension("123.123.123")).toContain(
      "should be in degrees or HH:MM:SS"
    );
    expect(validateRightAscension("236hello")).toContain(
      "should be in degrees or HH:MM:SS"
    );
    expect(validateRightAscension("any thing")).toContain(
      "should be in degrees or HH:MM:SS"
    );
  });
  it("Should give appropriate message", () => {
    expect(validateRightAscension("25:22:11")).toContain(" hours: 25");
    expect(validateRightAscension("20:70:11")).toContain(" minutes: 70");
    expect(validateRightAscension("20:22:70")).toContain(" seconds: 70");
    expect(validateRightAscension("370")).toContain(
      "between 0 and 360 degrees"
    );
    expect(validateRightAscension("20:34")).toContain(
      "degrees or HH:MM:SS only"
    );
  });
  it("should work", () => {
    expect(validateRightAscension("20:34:12")).toBe(undefined);
    expect(validateRightAscension("20:04:12")).toBe(undefined);
    expect(validateRightAscension("20:39:12")).toBe(undefined);
    expect(validateRightAscension("20.5")).toBe(undefined);
    expect(validateRightAscension("320")).toBe(undefined);
  });
  it("Should give work for ra range as well", () => {
    expect(validateRightAscension("25:22:11 .. 20:20:20")).toContain(
      " hours: 25"
    );
    expect(validateRightAscension("20:20:20 .. ")).toContain(
      " should be in degrees or HH:MM:SS"
    );
    expect(validateRightAscension("20:22:00 .. 20:20:70")).toContain(
      " seconds: 70"
    );
    expect(validateRightAscension("370 .. 20:20:20")).toContain(
      "between 0 and 360 degrees"
    );
    expect(validateRightAscension("20:34 .. 20:20:20")).toContain(
      "degrees or HH:MM:SS only"
    );
    expect(validateRightAscension("20:34:12 .. 20:20:20")).toBe(undefined);
    expect(validateRightAscension("20:04:12 .. 20:20:20")).toBe(undefined);
    expect(validateRightAscension("20:39:12 .. 20:20:20")).toBe(undefined);
    expect(validateRightAscension("20.5 .. 20")).toBe(undefined);
    expect(validateRightAscension("320 .. 20")).toBe(undefined);
  });
  it("Special character return error", () => {
    expect(validateRightAscension("!@#:23:123")).toContain(
      "should be in degrees or HH:MM:SS only"
    );
    expect(validateRightAscension("2/*~`'")).toContain(
      "should be in degrees or HH:MM:SS only"
    );
    expect(validateRightAscension("`~!@#$%^&*()_-+={[}]?/>.<,*-+")).toContain(
      "should be in degrees or HH:MM:SS only"
    );
    expect(validateRightAscension("`")).toContain(
      "should be in degrees or HH:MM:SS only"
    );
    expect(validateRightAscension("20:34")).toContain(
      "degrees or HH:MM:SS only"
    );
  });
});

describe("validateDeclination", () => {
  it("Should return error if ra is not a correct format", () => {
    expect(validateDeclination("hello")).toContain(
      "degrees or Degree:minutes:seconds"
    );
    expect(validateDeclination("123.123.123")).toContain(
      "-90D 0M 0S and 90D 0M 0S degree"
    );
    expect(validateDeclination("236hello")).toContain(
      "degrees or Degree:minutes:seconds"
    );
    expect(validateDeclination("any thing")).toContain(
      "degrees or Degree:minutes:seconds"
    );
  });
  it("Special character return error", () => {
    expect(validateDeclination("!@#:23:123")).toContain(
      "be in degrees or Degree:minutes:seconds"
    );
    expect(validateDeclination("2/*~`'")).toContain(
      "be in degrees or Degree:minutes:seconds"
    );
    expect(validateDeclination("`~!@#$%^&*()_-+={[}]?/>.<,*-+")).toContain(
      "be in degrees or Degree:minutes:seconds"
    );
    expect(validateDeclination("`")).toContain(
      "be in degrees or Degree:minutes:seconds"
    );
  });
  it("Should give appropriate message", () => {
    expect(validateDeclination("25:22:111")).toContain(
      "minutes and seconds should be between 0 and 59"
    );
    expect(validateDeclination("20:70:11")).toContain(
      " minutes and seconds should be between 0 and 59"
    );
    expect(validateDeclination("20:22:70")).toContain(
      " minutes and seconds should be between 0 and 59"
    );
    expect(validateDeclination("370")).toContain(
      " should be between -90 and 90 degrees"
    );
    expect(validateDeclination("20:34")).toContain(
      "degrees or Degree:minutes:seconds"
    );
  });
  it("should work", () => {
    expect(validateDeclination("20D34M12S")).toBe(undefined);
    expect(validateDeclination("20:04:12")).toBe(undefined);
    expect(validateDeclination("20:39:12")).toBe(undefined);
    expect(validateDeclination("20.5")).toBe(undefined);
    expect(validateDeclination("70")).toBe(undefined);
  });
  it("Should give work for ra range as well", () => {
    expect(validateDeclination("25:22:11 .. 20:20:20")).toBe(undefined);
    expect(validateDeclination("20:20:20 .. ")).toContain(
      "degrees or Degree:minutes:seconds"
    );
    expect(validateDeclination("20:22:00 .. 20:20:70")).toContain(
      " minutes and seconds should be between 0 and 59"
    );
    expect(validateDeclination("370 .. 20:20:20")).toContain(
      "should be in degrees or Degree:minutes:seconds"
    );
    expect(validateDeclination("20:34 .. 20:20:20")).toContain(
      "degrees or Degree:minutes:seconds"
    );
    expect(validateDeclination("20:34:12 .. 20:20:20")).toBe(undefined);
    expect(validateDeclination("20:04:12 .. 20:20:20")).toBe(undefined);
    expect(validateDeclination("20:39:12 .. 20:20:20")).toBe(undefined);
    expect(validateDeclination("20.5 .. 20")).toBe(undefined);
    expect(validateDeclination("89 .. 20")).toBe(undefined);
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
