import {
  IGeneral,
  IHRS,
  IObservationQueryParameters,
  ISALT,
  ISalticam,
  ITarget
} from "../util/query/types";
import {
  generalWhereCondition,
  hrsWhereCondition,
  rssWhereCondition,
  salticamWhereCondition,
  saltWhereCondition,
  targetWhereCondition,
  telescopeWhereCondition,
  whereCondition
} from "../util/query/whereCondition";
import { TargetType } from "../utils/TargetType";
import { IRSS } from "../utils/ObservationQueryParameters";

describe("whereCondition", () => {
  it("should map query parameters correctly", () => {
    const general: IGeneral = {
      errors: {},
      observationNight: "2019-02-19",
      principalInvestigator: "John",
      proposalCode: "SCI"
    };
    const target: ITarget = {
      declination: "-42",
      errors: {},
      rightAscension: "12.34",
      searchConeRadius: "0.01",
      searchConeRadiusUnits: "degrees"
    };
    const rss: IRSS = {
      detectorMode: "Normal",
      errors: {},
      name: "RSS"
    };
    const salt: ISALT = {
      instrument: rss,
      name: "SALT"
    };
    const queryParameters: IObservationQueryParameters = {
      general,
      target,
      telescope: salt
    };
    const expected = {
      AND: [
        generalWhereCondition(general),
        targetWhereCondition(target),
        telescopeWhereCondition(salt)
      ]
    };
    expect(whereCondition(queryParameters)).toEqual(expected);
  });
});

describe("generalWhereCondition", () => {
  it("should raise an error for an invalid observation night format", () => {
    const f = () =>
      generalWhereCondition({ errors: {}, observationNight: "invaliddate" });
    expect(f).toThrow(/invaliddate.*valid/);
  });

  it("should raise an error for an invalid observation night", () => {
    const f = () =>
      generalWhereCondition({ errors: {}, observationNight: "2019-02-29" });
    expect(f).toThrow(/2019-02-29.*valid/);
  });

  it("should map an observation night to a greater equal and less equal condition spanning one night", () => {
    expect(
      generalWhereCondition({ errors: {}, observationNight: "2019-02-17" })
    ).toMatchSnapshot();
  });

  it("should map a Principal Investigator to a contains condition", () => {
    expect(
      generalWhereCondition({ errors: {}, principalInvestigator: "Doe" })
    ).toMatchSnapshot();
  });

  it("should map a proposal code to a contains condition", () => {
    expect(
      generalWhereCondition({ errors: {}, proposalCode: "2-SCI" })
    ).toMatchSnapshot();
  });

  it("should map input data correctly", () => {
    expect(
      generalWhereCondition({
        errors: {},
        observationNight: "2019-05-13",
        principalInvestigator: "Sipho",
        proposalCode: "2019-1-SCI-042"
      })
    ).toMatchSnapshot();
  });
});

describe("targetWhereCondition", () => {
  it("should raise an error for invalid target position input", () => {
    const f = () =>
      targetWhereCondition({ errors: {}, rightAscension: "cghtyuu" });
    expect(f).toThrow();
  });

  it("should map a single position to a within condition", () => {
    expect(
      targetWhereCondition({
        declination: "-5",
        errors: {},
        rightAscension: "17",
        searchConeRadius: "0.04",
        searchConeRadiusUnits: "degrees"
      })
    ).toMatchSnapshot();
  });

  it("should map right ascension ranges to less than and greater than conditions", () => {
    expect(
      targetWhereCondition({ errors: {}, rightAscension: "13" })
    ).toMatchSnapshot();
    expect(
      targetWhereCondition({
        declination: "12 .. 13",
        errors: {},
        rightAscension: "13"
      })
    ).toMatchSnapshot();
    expect(
      targetWhereCondition({ errors: {}, rightAscension: "4 ... 355" })
    ).toMatchSnapshot();
    expect(
      targetWhereCondition({ errors: {}, rightAscension: "355 ... 4" })
    ).toMatchSnapshot();
    expect(
      targetWhereCondition({
        declination: "-12 .. -11",
        errors: {},
        rightAscension: "4 ... 355"
      })
    ).toMatchSnapshot();
  });

  it("should map declination ranges to less than and greater than conditions", () => {
    expect(
      targetWhereCondition({ errors: {}, declination: "-0.5" })
    ).toMatchSnapshot();
    expect(
      targetWhereCondition({
        declination: "-0.5",
        errors: {},
        rightAscension: "5 .. 9"
      })
    ).toMatchSnapshot();
    expect(
      targetWhereCondition({ declination: "-10 .. 12", errors: {} })
    ).toMatchSnapshot();
    expect(
      targetWhereCondition({ declination: "12 .. -10", errors: {} })
    ).toMatchSnapshot();
    expect(
      targetWhereCondition({
        declination: "10 .. 12",
        errors: {},
        rightAscension: "115 .. 200"
      })
    ).toMatchSnapshot();
  });

  it("should map target types to starts with conditions", () => {
    expect(
      targetWhereCondition({ errors: {}, targetTypes: new Set<TargetType>([]) })
    );
    expect(
      targetWhereCondition({
        errors: {},
        targetTypes: new Set<TargetType>(["Galaxy"])
      })
    );
    expect(
      targetWhereCondition({
        errors: {},
        targetTypes: new Set<TargetType>(["Galaxy", "Star"])
      })
    );
    expect(
      targetWhereCondition({
        errors: {},
        targetTypes: new Set<TargetType>(["ISM", "Solar System Body", "Galaxy"])
      })
    );
  });
});

describe("telescopeWhereCondition", () => {
  it("should map SALT query parameters correctly", () => {
    const rss: IRSS = {
      detectorMode: "Normal",
      errors: {},
      name: "RSS"
    };
    const salt: ISALT = {
      instrument: rss,
      name: "SALT"
    };
    const expected = {
      AND: [saltWhereCondition(salt)]
    };
    expect(telescopeWhereCondition(salt)).toEqual(expected);
  });
});

describe("saltWhereCondition", () => {
  it("should map Salticam query parameters correctly", () => {
    const salticam: ISalticam = {
      detectorMode: "Slot Mode",
      errors: {},
      name: "Salticam"
    };
    const salt: ISALT = {
      instrument: salticam,
      name: "SALT"
    };
    const expected = {
      AND: [
        { EQUALS: { column: "Telescope.telescopeName", value: "SALT" } },
        salticamWhereCondition(salticam)
      ]
    };
    expect(saltWhereCondition(salt)).toEqual(expected);
  });

  it("should map RSS query parameters correctly", () => {
    const rss: IRSS = {
      detectorMode: "Slot Mode",
      errors: {},
      name: "RSS"
    };
    const salt: ISALT = {
      instrument: rss,
      name: "SALT"
    };
    const expected = {
      AND: [
        { EQUALS: { column: "Telescope.telescopeName", value: "SALT" } },
        rssWhereCondition(rss)
      ]
    };
    expect(saltWhereCondition(salt)).toEqual(expected);
  });

  it("should map HRS query parameters correctly", () => {
    const hrs: IHRS = {
      errors: {},
      mode: "Medium Resolution",
      name: "HRS"
    };
    const salt: ISALT = {
      instrument: hrs,
      name: "SALT"
    };
    const expected = {
      AND: [
        { EQUALS: { column: "Telescope.telescopeName", value: "SALT" } },
        hrsWhereCondition(hrs)
      ]
    };
    expect(saltWhereCondition(salt)).toEqual(expected);
  });
});

describe("salticamWhereCondition", () => {
  // TODO: Add unit tests
  it("should work", () => {
    // to be filled with life
  });
});

describe("rssWhereCondition", () => {
  // TODO: Add unit tests
  it("should work", () => {
    // to be filled with life
  });
});

describe("hrsWhereCondition", () => {
  // TODO: Add unit tests
  it("should work", () => {
    // to be filled with life
  });
});
