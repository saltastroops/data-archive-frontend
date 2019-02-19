import {
  DEFAULT_COORDINATE_SEARCH_RADIUS,
  MAXIMUM_COORDINATE_SEARCH_RADIUS,
  parseTargetPosition
} from "../util/query/parse";

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
