import {
  DEFAULT_COORDINATE_SEARCH_RADIUS,
  MAXIMUM_COORDINATE_SEARCH_RADIUS,
  parseDeclination,
  parseRightAscension,
  parseTargetPosition
} from "../util/query/parse";

describe("parseRightAscension", () => {
  it("should parse valid degree values correctly", () => {
    expect(parseRightAscension("0")).toBeCloseTo(0, 8);

    expect(parseRightAscension("0.")).toBeCloseTo(0, 8);

    expect(parseRightAscension("  117.345\n")).toBeCloseTo(117.345, 8);

    expect(parseRightAscension("360")).toBeCloseTo(360, 8);

    expect(parseRightAscension("\n360.\t")).toBeCloseTo(360, 8);
  });

  it("should parse valid hour, minute, second values correctly", () => {
    expect(parseRightAscension("0h 00m 00s")).toBeCloseTo(0, 8);

    expect(parseRightAscension("00 0 00s")).toBeCloseTo(0, 8);

    expect(parseRightAscension("3.5h")).toBeCloseTo(52.5, 8);

    expect(parseRightAscension("00001 h\n0002 003")).toBeCloseTo(15.5125, 8);

    expect(parseRightAscension("01 h 02 3")).toBeCloseTo(15.5125, 8);

    expect(parseRightAscension("01s 02h 3m")).toBeCloseTo(15.5125, 8);

    expect(parseRightAscension("\n1 -2 -3\t")).toBeCloseTo(15.5125, 8);

    expect(parseRightAscension("09:14:56.89")).toBeCloseTo(138.737041666667, 8);

    expect(parseRightAscension("24h00m00s")).toBeCloseTo(360, 8);
  });

  it("should reject invalid values", () => {
    let f = () => parseRightAscension("xyz");
    expect(f).toThrow("xyz");

    f = () => parseRightAscension("a0");
    expect(f).toThrow();

    f = () => parseRightAscension("1 2 3 4");
    expect(f).toThrow();

    f = () => parseRightAscension("-3.967");
    expect(f).toThrow();

    f = () => parseRightAscension("360.0001");
    expect(f).toThrow();

    f = () => parseRightAscension("700");
    expect(f).toThrow();

    f = () => parseRightAscension("-9h 5m 8s");
    expect(f).toThrow();

    f = () => parseRightAscension("1h 60m 1s");
    expect(f).toThrow();

    f = () => parseRightAscension("1h 2m 60s");
    expect(f).toThrow();

    f = () => parseRightAscension("24h 0m 0.001s");
    expect(f).toThrow();
  });
});

describe("parseDeclination", () => {
  it("should parse valid degree values correctly", () => {
    expect(parseDeclination("0")).toBeCloseTo(0, 8);

    expect(parseDeclination("-90")).toBeCloseTo(-90, 8);

    expect(parseDeclination("90")).toBeCloseTo(90, 8);

    expect(parseDeclination("-34.5678")).toBeCloseTo(-34.5678, 8);

    expect(parseDeclination("+23.9234")).toBeCloseTo(23.9234, 8);

    expect(parseDeclination("-0.65123")).toBeCloseTo(-0.65123, 8);

    expect(parseDeclination("\n0.65123\t")).toBeCloseTo(0.65123, 8);

    expect(parseDeclination("+0.65123")).toBeCloseTo(0.65123, 8);

    expect(parseDeclination("+03.9234")).toBeCloseTo(3.9234, 8);
  });

  it("should parse valid degree, arcminute, arcsecond values correctly", () => {
    expect(parseDeclination("-78° 14′ 34.1″")).toBeCloseTo(-78.24277777778);

    expect(parseDeclination("-78″ 14° 34.1′")).toBeCloseTo(-78.24277777778);

    expect(parseDeclination("-78d 14m 34.1s")).toBeCloseTo(-78.24277777778);

    expect(parseDeclination("-78d14m34.1s")).toBeCloseTo(-78.24277777778);

    expect(parseDeclination("-78 14 34.1")).toBeCloseTo(-78.24277777778);

    expect(parseDeclination("-0 30 5")).toBeCloseTo(-0.501388888889);

    expect(parseDeclination("0 30 5")).toBeCloseTo(0.501388888889);

    expect(parseDeclination("  \t +0 30 5\n")).toBeCloseTo(0.501388888889);

    expect(parseDeclination("+0 -30 -5")).toBeCloseTo(0.501388888889);

    expect(parseDeclination("1 2 3")).toBeCloseTo(1.034166666667);

    expect(parseDeclination("01 02 03")).toBeCloseTo(1.034166666667);

    expect(parseDeclination("+50deg")).toBeCloseTo(50);

    expect(parseDeclination("+50deg40arcmin")).toBeCloseTo(50.66666667);

    expect(parseDeclination("+50deg40arcmin36arcsec")).toBeCloseTo(50.67666667);

    expect(parseDeclination("000050 0040 00036")).toBeCloseTo(50.67666667);

    expect(parseDeclination("+50deg")).toBeCloseTo(50);
  });

  it("should reject invalid values", () => {
    let f = () => expect(parseDeclination("xyz"));
    expect(f).toThrow("xyz");

    f = () => expect(parseDeclination("-xyz"));
    expect(f).toThrow("-xyz");

    f = () => expect(parseDeclination("-15.98 4 7"));
    expect(f).toThrow("-15.98 4 7");

    f = () => expect(parseDeclination("7 13.8 7"));
    expect(f).toThrow();

    f = () => expect(parseDeclination("6 60 8"));
    expect(f).toThrow();

    f = () => expect(parseDeclination("6 9 60"));
    expect(f).toThrow();

    f = () => expect(parseDeclination("-90.0001"));
    expect(f).toThrow();

    f = () => expect(parseDeclination("90.0001"));
    expect(f).toThrow();

    f = () => expect(parseDeclination("-90 0 0.0001"));
    expect(f).toThrow();

    f = () => expect(parseDeclination("90 0 0.0001"));
    expect(f).toThrow();

    f = () => expect(parseDeclination("1 2 3 4"));
    expect(f).toThrow();
  });
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
        declination: "17",
        errors: {},
        rightAscension: "0"
      }).rightAscensions[0]
    ).toBeCloseTo(0);
    expect(
      parseTargetPosition({
        declination: "17",
        errors: {},
        rightAscension: "113.67"
      }).rightAscensions[0]
    ).toBeCloseTo(113.67);
    expect(
      parseTargetPosition({
        declination: "17",
        errors: {},
        rightAscension: "360"
      }).rightAscensions[0]
    ).toBeCloseTo(360);
  });

  it("should parse right ascension ranges correctly", () => {
    expect(
      parseTargetPosition({
        declination: "0 .. 1",
        errors: {},
        rightAscension: "0 .. 67.9"
      }).rightAscensions[0]
    ).toBeCloseTo(0);
    expect(
      parseTargetPosition({
        declination: "0 .. 1",
        errors: {},
        rightAscension: "0 .. 67.9"
      }).rightAscensions[1]
    ).toBeCloseTo(67.9);

    expect(
      parseTargetPosition({
        declination: "0 .. 1",
        errors: {},
        rightAscension: "113.67 .. 110"
      }).rightAscensions[0]
    ).toBeCloseTo(113.67);
    expect(
      parseTargetPosition({
        declination: "0 .. 1",
        errors: {},
        rightAscension: "113.67 .. 110"
      }).rightAscensions[1]
    ).toBeCloseTo(110);
  });

  it("should apply a default right ascension range width", () => {
    let rightAscensions = parseTargetPosition({
      declination: "-7 .. -6",
      errors: {},
      rightAscension: "23"
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
      declination: "-7 .. -6",
      errors: {},
      rightAscension: "0"
    }).rightAscensions;
    expect(rightAscensions[0]).toBeCloseTo(
      360 - DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );
    expect(rightAscensions[1]).toBeCloseTo(DEFAULT_COORDINATE_SEARCH_RADIUS, 6);

    rightAscensions = parseTargetPosition({
      declination: "-7 .. -6",
      errors: {},
      rightAscension: "360"
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
        declination: "-90",
        errors: {},
        rightAscension: "9"
      }).declinations[0]
    ).toBeCloseTo(-90);
    expect(
      parseTargetPosition({ errors: {}, rightAscension: "9", declination: "0" })
        .declinations[0]
    ).toBeCloseTo(0);
    expect(
      parseTargetPosition({
        declination: "23.8",
        errors: {},
        rightAscension: "9"
      }).declinations[0]
    ).toBeCloseTo(23.8);
    expect(
      parseTargetPosition({
        declination: "90",
        errors: {},
        rightAscension: "9"
      }).declinations[0]
    ).toBeCloseTo(90);
  });

  it("should parse declination ranges correctly", () => {
    expect(
      parseTargetPosition({
        declination: "-11.6 .. 5.98",
        errors: {},
        rightAscension: "14 .. 15"
      }).declinations[0]
    ).toBeCloseTo(-11.6);
    expect(
      parseTargetPosition({
        declination: "-11.6 .. 5.98",
        errors: {},
        rightAscension: "14 .. 15"
      }).declinations[1]
    ).toBeCloseTo(5.98);

    expect(
      parseTargetPosition({
        declination: "67.3 .. -8.76",
        errors: {},
        rightAscension: "14 .. 15"
      }).declinations[0]
    ).toBeCloseTo(-8.76);
    expect(
      parseTargetPosition({
        declination: "67.3 .. -8.76",
        errors: {},
        rightAscension: "14 .. 15"
      }).declinations[1]
    ).toBeCloseTo(67.3);
  });

  it("should apply a default declination range width", () => {
    let declinations = parseTargetPosition({
      declination: "-8",
      errors: {},
      rightAscension: "17 .. 18"
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
      declination: "-90",
      errors: {},
      rightAscension: "17 .. 18"
    }).declinations;
    expect(declinations[0]).toBeCloseTo(-90, 6);
    expect(declinations[1]).toBeCloseTo(
      -90 + DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );

    declinations = parseTargetPosition({
      declination: "90",
      errors: {},
      rightAscension: "17 .. 18"
    }).declinations;
    expect(declinations[0]).toBeCloseTo(
      90 - DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );
    expect(declinations[1]).toBeCloseTo(90, 6);

    declinations = parseTargetPosition({ declination: "-8", errors: {} })
      .declinations;
    expect(declinations[0]).toBeCloseTo(
      -8 - DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );
    expect(declinations[1]).toBeCloseTo(
      -8 + DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );

    declinations = parseTargetPosition({ declination: "-90", errors: {} })
      .declinations;
    expect(declinations[0]).toBeCloseTo(-90, 6);
    expect(declinations[1]).toBeCloseTo(
      -90 + DEFAULT_COORDINATE_SEARCH_RADIUS,
      6
    );

    declinations = parseTargetPosition({ declination: "90", errors: {} })
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
        declination: "3 .. 5",
        errors: {},
        searchConeRadius: "2",
        searchConeRadiusUnits: "arcminutes"
      });
    expect(f).toThrow(/(range.*radius|radius.*range)/);
  });

  it("should throw an error if the search cone radius is not valid", () => {
    const f = () =>
      parseTargetPosition({
        declination: "1",
        errors: {},
        rightAscension: "1",
        searchConeRadius: "hjudeth",
        searchConeRadiusUnits: "degrees"
      });
    expect(f).toThrow(/radius.*positive number/);
  });

  it("should throw an error if the search cone radius is not positive", () => {
    let f = () =>
      parseTargetPosition({
        declination: "1",
        errors: {},
        rightAscension: "1",
        searchConeRadius: "-13",
        searchConeRadiusUnits: "arcseconds"
      });
    expect(f).toThrow(/radius.*positive number/);

    f = () =>
      parseTargetPosition({
        declination: "1",
        errors: {},
        rightAscension: "1",
        searchConeRadius: "0",
        searchConeRadiusUnits: "arcseconds"
      });
    expect(f).toThrow(/radius.*positive number/);
  });

  it("should throw an error if the search cone radius is too large", () => {
    const f = () =>
      parseTargetPosition({
        declination: "1",
        errors: {},
        rightAscension: "1",
        searchConeRadius: "" + (MAXIMUM_COORDINATE_SEARCH_RADIUS + 0.0001),
        searchConeRadiusUnits: "degrees"
      });
    expect(f).toThrow(/radius.*greater than/);
  });

  it("should use a default search cone radius", () => {
    expect(
      parseTargetPosition({
        declination: "9",
        errors: {},
        rightAscension: "100"
      }).searchConeRadius
    ).toBeCloseTo(DEFAULT_COORDINATE_SEARCH_RADIUS, 6);
  });

  // search cone radius units

  it("should throw an error if a search cone radius is given without units", () => {
    const f = () =>
      parseTargetPosition({
        declination: "-8",
        errors: {},
        rightAscension: "1",
        searchConeRadius: "6"
      });
    expect(f).toThrow(/supply.*units/);
  });

  it("should throw an error if invalid search cone radius units are given", () => {
    const f = () =>
      parseTargetPosition({
        declination: "-17",
        errors: {},
        rightAscension: "4",
        searchConeRadius: "7",
        searchConeRadiusUnits: "uxfghj"
      });
    expect(f).toThrow("not supported");
  });

  it("should apply the search cone radius units correctly", () => {
    expect(
      parseTargetPosition({
        declination: "0",
        errors: {},
        rightAscension: "0",
        searchConeRadius: "0.0234",
        searchConeRadiusUnits: "degrees"
      }).searchConeRadius
    ).toBeCloseTo(0.0234);
    expect(
      parseTargetPosition({
        declination: "0",
        errors: {},
        rightAscension: "0",
        searchConeRadius: "1.8",
        searchConeRadiusUnits: "arcminutes"
      }).searchConeRadius
    ).toBeCloseTo(0.03);
    expect(
      parseTargetPosition({
        declination: "0",
        errors: {},
        rightAscension: "0",
        searchConeRadius: "180",
        searchConeRadiusUnits: "arcseconds"
      }).searchConeRadius
    ).toBeCloseTo(0.05);
  });
});
