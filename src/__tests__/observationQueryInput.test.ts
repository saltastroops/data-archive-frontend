import {
  generalWhereCondition,
  parseTargetPosition,
  targetWhereCondition,
  telescopeWhereCondition,
  DEFAULT_COORDINATE_SEARCH_RADIUS,
  MAXIMUM_COORDINATE_SEARCH_RADIUS,
  SALT_ID,
  saltWhereCondition,
  salticamWhereCondition,
  rssWhereCondition,
  hrsWhereCondition,
  whereCondition
} from "../util/observationQueryInput";
import {
  IGeneral,
  IHRS,
  IObservationQueryParameters,
  IRSS,
  ISALT,
  ISalticam,
  ITarget,
  ITelescope
} from "../util/ObservationQueryParameters";

describe("whereCondition", () => {
  it("should map query parameters correctly", () => {
    const general: IGeneral = {
      errors: {},
      observationNight: "2019-02-19",
      proposalCode: "SCI",
      principalInvestigator: "John"
    };
    const target: ITarget = {
      errors: {},
      rightAscension: "12.34",
      declination: "-42",
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
        errors: {},
        rightAscension: "17",
        declination: "-5",
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
        errors: {},
        rightAscension: "13",
        declination: "12 .. 13"
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
        errors: {},
        rightAscension: "4 ... 355",
        declination: "-12 .. -11"
      })
    ).toMatchSnapshot();
  });

  it("should map declination ranges to less than and greater than conditions", () => {
    expect(
      targetWhereCondition({ errors: {}, declination: "-0.5" })
    ).toMatchSnapshot();
    expect(
      targetWhereCondition({
        errors: {},
        rightAscension: "5 .. 9",
        declination: "-0.5"
      })
    ).toMatchSnapshot();
    expect(
      targetWhereCondition({ errors: {}, declination: "-10 .. 12" })
    ).toMatchSnapshot();
    expect(
      targetWhereCondition({ errors: {}, declination: "12 .. -10" })
    ).toMatchSnapshot();
    expect(
      targetWhereCondition({
        errors: {},
        rightAscension: "115 .. 200",
        declination: "10 .. 12"
      })
    ).toMatchSnapshot();
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
      AND: [{ NOT: { IS_NULL: SALT_ID } }, salticamWhereCondition(salticam)]
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
      AND: [{ NOT: { IS_NULL: SALT_ID } }, rssWhereCondition(rss)]
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
      AND: [{ NOT: { IS_NULL: SALT_ID } }, hrsWhereCondition(hrs)]
    };
    expect(saltWhereCondition(salt)).toEqual(expected);
  });
});

describe("salticamWhereCondition", () => {
  // TODO: Add unit tests
  it("should work", () => {});
});

describe("rssWhereCondition", () => {
  // TODO: Add unit tests
  it("should work", () => {});
});

describe("hrsWhereCondition", () => {
  // TODO: Add unit tests
  it("should work", () => {});
});

describe("parseTargetPosition", () => {
  // right ascension

  it("should throw an error if the right ascension has an invalid format", () => {
    let f = () => parseTargetPosition({ errors: {}, rightAscension: "xvgty" });
    expect(f).toThrow("valid");

    f = () =>
      parseTargetPosition({ errors: {}, rightAscension: "5.9 .. xvgty" });
    expect(f).toThrow("valid");

    f = () =>
      parseTargetPosition({
        errors: {},
        rightAscension: "7.890 .. 7.891 .. 8.0"
      });
    expect(f).toThrow(/neither.*range/);
  });

  it("should throw an error if the right ascension is less than 0.", () => {
    let f = () => parseTargetPosition({ errors: {}, rightAscension: "-0.1" });
    expect(f).toThrow("valid");

    f = () =>
      parseTargetPosition({ errors: {}, rightAscension: "117 .. -345" });
    expect(f).toThrow("valid");
  });

  it("should throw an error if the right ascension is greater than 360.", () => {
    let f = () => parseTargetPosition({ errors: {}, rightAscension: "360.1" });
    expect(f).toThrow("valid");

    f = () => parseTargetPosition({ errors: {}, rightAscension: "200 .. 765" });
    expect(f).toThrow("valid");
  });

  it("should throw an error if a right ascension range has zero length", () => {
    const f = () =>
      parseTargetPosition({ errors: {}, rightAscension: "17 .. 17" });
    expect(f).toThrow("length 0");
  });

  it("should parse right ascensions correctly", () => {
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "0",
        declination: "17"
      }).rightAscensions[0]
    ).toBeCloseTo(0);
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "113.67",
        declination: "17"
      }).rightAscensions[0]
    ).toBeCloseTo(113.67);
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "360",
        declination: "17"
      }).rightAscensions[0]
    ).toBeCloseTo(360);
  });

  it("should parse right ascension ranges correctly", () => {
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "0 .. 67.9",
        declination: "0 .. 1"
      }).rightAscensions[0]
    ).toBeCloseTo(0);
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "0 .. 67.9",
        declination: "0 .. 1"
      }).rightAscensions[1]
    ).toBeCloseTo(67.9);

    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "113.67 .. 110",
        declination: "0 .. 1"
      }).rightAscensions[0]
    ).toBeCloseTo(113.67);
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "113.67 .. 110",
        declination: "0 .. 1"
      }).rightAscensions[1]
    ).toBeCloseTo(110);
  });

  it("should apply a default right ascension range width", () => {
    let rightAscensions = parseTargetPosition({
      errors: {},
      rightAscension: "23",
      declination: "-7 .. -6"
    }).rightAscensions;
    expect(rightAscensions[0]).toBeCloseTo(
      23 - DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );
    expect(rightAscensions[1]).toBeCloseTo(
      23 + DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );

    rightAscensions = parseTargetPosition({
      errors: {},
      rightAscension: "0",
      declination: "-7 .. -6"
    }).rightAscensions;
    expect(rightAscensions[0]).toBeCloseTo(
      360 - DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );
    expect(rightAscensions[1]).toBeCloseTo(DEFAULT_COORDINATE_SEARCH_RADIUS, 6);

    rightAscensions = parseTargetPosition({
      errors: {},
      rightAscension: "360",
      declination: "-7 .. -6"
    }).rightAscensions;
    expect(rightAscensions[0]).toBeCloseTo(
      360 - DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );
    expect(rightAscensions[1]).toBeCloseTo(DEFAULT_COORDINATE_SEARCH_RADIUS, 6);
  });

  // declination

  it("should throw an error if the declination has an invalid format", () => {
    let f = () => parseTargetPosition({ errors: {}, declination: "xvgty" });
    expect(f).toThrow("valid");

    f = () => parseTargetPosition({ errors: {}, declination: "5.9 .. xvgty" });
    expect(f).toThrow("valid");

    f = () =>
      parseTargetPosition({ errors: {}, declination: "7.890 .. 7.891 .. 8.0" });
    expect(f).toThrow(/neither.*range/);
  });

  it("should throw an error if the declination is less than -90.", () => {
    let f = () => parseTargetPosition({ errors: {}, declination: "-90.1" });
    expect(f).toThrow("valid");

    f = () => parseTargetPosition({ errors: {}, declination: "17 .. -345" });
    expect(f).toThrow("valid");
  });

  it("should throw an error if the declination is greater than 90.", () => {
    let f = () => parseTargetPosition({ errors: {}, declination: "90.1" });
    expect(f).toThrow("valid");

    f = () => parseTargetPosition({ errors: {}, declination: "20 .. 765" });
    expect(f).toThrow("valid");
  });

  it("should throw an error if a declination range has zero length", () => {
    const f = () =>
      parseTargetPosition({ errors: {}, declination: "17 .. 17" });
    expect(f).toThrow("length 0");
  });

  it("should parse declinations correctly", () => {
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "9",
        declination: "-90"
      }).declinations[0]
    ).toBeCloseTo(-90);
    expect(
      parseTargetPosition({ errors: {}, rightAscension: "9", declination: "0" })
        .declinations[0]
    ).toBeCloseTo(0);
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "9",
        declination: "23.8"
      }).declinations[0]
    ).toBeCloseTo(23.8);
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "9",
        declination: "90"
      }).declinations[0]
    ).toBeCloseTo(90);
  });

  it("should parse declination ranges correctly", () => {
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "14 .. 15",
        declination: "-11.6 .. 5.98"
      }).declinations[0]
    ).toBeCloseTo(-11.6);
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "14 .. 15",
        declination: "-11.6 .. 5.98"
      }).declinations[1]
    ).toBeCloseTo(5.98);

    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "14 .. 15",
        declination: "67.3 .. -8.76"
      }).declinations[0]
    ).toBeCloseTo(-8.76);
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "14 .. 15",
        declination: "67.3 .. -8.76"
      }).declinations[1]
    ).toBeCloseTo(67.3);
  });

  it("should apply a default declination range width", () => {
    let declinations = parseTargetPosition({
      errors: {},
      rightAscension: "17 .. 18",
      declination: "-8"
    }).declinations;
    expect(declinations[0]).toBeCloseTo(
      -8 - DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );
    expect(declinations[1]).toBeCloseTo(
      -8 + DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );

    declinations = parseTargetPosition({
      errors: {},
      rightAscension: "17 .. 18",
      declination: "-90"
    }).declinations;
    expect(declinations[0]).toBeCloseTo(-90, 6);
    expect(declinations[1]).toBeCloseTo(
      -90 + DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );

    declinations = parseTargetPosition({
      errors: {},
      rightAscension: "17 .. 18",
      declination: "90"
    }).declinations;
    expect(declinations[0]).toBeCloseTo(
      90 - DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );
    expect(declinations[1]).toBeCloseTo(90, 6);

    declinations = parseTargetPosition({ errors: {}, declination: "-8" })
      .declinations;
    expect(declinations[0]).toBeCloseTo(
      -8 - DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );
    expect(declinations[1]).toBeCloseTo(
      -8 + DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );

    declinations = parseTargetPosition({ errors: {}, declination: "-90" })
      .declinations;
    expect(declinations[0]).toBeCloseTo(-90, 6);
    expect(declinations[1]).toBeCloseTo(
      -90 + DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );

    declinations = parseTargetPosition({ errors: {}, declination: "90" })
      .declinations;
    expect(declinations[0]).toBeCloseTo(
      90 - DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );
    expect(declinations[1]).toBeCloseTo(90, 6);
  });

  // search cone radius

  it("should throw an error if both a coordinate range and a search cone radius are given", () => {
    let f = () =>
      parseTargetPosition({
        errors: {},
        rightAscension: "3 .. 5",
        searchConeRadius: "2",
        searchConeRadiusUnits: "arcminutes"
      });
    expect(f).toThrow(/(range.*radius|radius.*range)/);

    f = () =>
      parseTargetPosition({
        errors: {},
        declination: "3 .. 5",
        searchConeRadius: "2",
        searchConeRadiusUnits: "arcminutes"
      });
    expect(f).toThrow(/(range.*radius|radius.*range)/);
  });

  it("should throw an error if the search cone radius is not valid", () => {
    const f = () =>
      parseTargetPosition({
        errors: {},
        rightAscension: "1",
        declination: "1",
        searchConeRadius: "hjudeth",
        searchConeRadiusUnits: "degrees"
      });
    expect(f).toThrow(/radius.*positive number/);
  });

  it("should throw an error if the search cone radius is not positive", () => {
    let f = () =>
      parseTargetPosition({
        errors: {},
        rightAscension: "1",
        declination: "1",
        searchConeRadius: "-13",
        searchConeRadiusUnits: "arcseconds"
      });
    expect(f).toThrow(/radius.*positive number/);

    f = () =>
      parseTargetPosition({
        errors: {},
        rightAscension: "1",
        declination: "1",
        searchConeRadius: "0",
        searchConeRadiusUnits: "arcseconds"
      });
    expect(f).toThrow(/radius.*positive number/);
  });

  it("should throw an error if the search cone radius is too large", () => {
    let f = () =>
      parseTargetPosition({
        errors: {},
        rightAscension: "1",
        declination: "1",
        searchConeRadius: "" + (MAXIMUM_COORDINATE_SEARCH_RADIUS + 0.0001),
        searchConeRadiusUnits: "degrees"
      });
    expect(f).toThrow(/radius.*greater than/);
  });

  it("should use a default search cone radius", () => {
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "100",
        declination: "9"
      }).searchConeRadius
    ).toBeCloseTo(DEFAULT_COORDINATE_SEARCH_RADIUS, 6);
  });

  // search cone radius units

  it("should throw an error if a search cone radius is given without units", () => {
    const f = () =>
      parseTargetPosition({
        errors: {},
        rightAscension: "1",
        declination: "-8",
        searchConeRadius: "6"
      });
    expect(f).toThrow(/supply.*units/);
  });

  it("should throw an error if invalid search cone radius units are given", () => {
    const f = () =>
      parseTargetPosition({
        errors: {},
        rightAscension: "4",
        declination: "-17",
        searchConeRadius: "7",
        searchConeRadiusUnits: "uxfghj"
      });
    expect(f).toThrow("not supported");
  });

  it("should apply the search cone radius units correctly", () => {
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "0",
        declination: "0",
        searchConeRadius: "0.0234",
        searchConeRadiusUnits: "degrees"
      }).searchConeRadius
    ).toBeCloseTo(0.0234);
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "0",
        declination: "0",
        searchConeRadius: "1.8",
        searchConeRadiusUnits: "arcminutes"
      }).searchConeRadius
    ).toBeCloseTo(0.03);
    expect(
      parseTargetPosition({
        errors: {},
        rightAscension: "0",
        declination: "0",
        searchConeRadius: "180",
        searchConeRadiusUnits: "arcseconds"
      }).searchConeRadius
    ).toBeCloseTo(0.05);
  });
});
