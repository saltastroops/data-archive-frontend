import { ISALT, ITarget } from "../util/query/types";
import {
  generalWhereCondition,
  targetWhereCondition,
  telescopeWhereCondition,
  whereCondition,
} from "../util/query/whereCondition";
import {
  IGeneral,
  IObservationQueryParameters,
  IRSS,
} from "../utils/ObservationQueryParameters";
import { TargetType } from "../utils/TargetType";

describe("whereCondition", () => {
  it("should map query parameters correctly", () => {
    const general: IGeneral = {
      errors: {},
      observationNight: "2019-02-19",
      principalInvestigator: "John",
      productTypes: new Set(),
      proposalCode: "SCI",
    };
    const target: ITarget = {
      declination: "-42",
      errors: {},
      rightAscension: "12.34",
      searchConeRadius: "0.01",
      searchConeRadiusUnits: "degrees",
    };
    const rss: IRSS = {
      detectorMode: "Normal",
      errors: {},
      name: "RSS",
    };
    const salt: ISALT = {
      instrument: rss,
      name: "SALT",
    };
    const queryParameters: IObservationQueryParameters = {
      general,
      target,
      telescope: salt,
    };
    const expected = {
      AND: [
        generalWhereCondition(general),
        targetWhereCondition(target),
        telescopeWhereCondition(salt),
      ],
    };
    expect(whereCondition(queryParameters)).toEqual(expected);
  });
});

describe("generalWhereCondition", () => {
  it("should raise an error for an invalid observation night format", () => {
    const f = () =>
      generalWhereCondition({
        errors: {},
        observationNight: "invaliddate",
        productTypes: new Set(),
      });
    expect(f).toThrow(/invaliddate.*valid/);
  });

  it("should raise an error for an invalid observation night", () => {
    const f = () =>
      generalWhereCondition({
        errors: {},
        observationNight: "2019-02-29",
        productTypes: new Set(),
      });
    expect(f).toThrow(/2019-02-29.*valid/);
  });

  it("should raise an error for an invalid observation night range", () => {
    let f = () =>
      generalWhereCondition({
        errors: {},
        observationNight: "2019-02-29 ..",
        productTypes: new Set(),
      });
    expect(f).toThrow(/2019-02-29.*valid/);

    f = () =>
      generalWhereCondition({
        errors: {},
        observationNight: ".. 2019-02-29",
        productTypes: new Set(),
      });
    expect(f).toThrow("not a valid");

    f = () =>
      generalWhereCondition({
        errors: {},
        observationNight: "2019-02-29 .. 2020",
        productTypes: new Set(),
      });
    expect(f).toThrow("not a valid");
  });

  it("should map an observation night to a greater equal and less equal condition spanning one night", () => {
    expect(
      generalWhereCondition({
        errors: {},
        observationNight: "2019-02-17",
        productTypes: new Set(),
      })
    ).toMatchSnapshot();
  });

  it("should map a Principal Investigator to a contains condition", () => {
    expect(
      generalWhereCondition({
        errors: {},
        principalInvestigator: "Doe",
        productTypes: new Set(),
      })
    ).toMatchSnapshot();
  });

  it("should map a proposal code to a contains condition", () => {
    expect(
      generalWhereCondition({
        errors: {},
        productTypes: new Set(),
        proposalCode: "2-SCI",
      })
    ).toMatchSnapshot();
  });

  it("should map input data correctly", () => {
    expect(
      generalWhereCondition({
        errors: {},
        observationNight: "2019-05-13",
        principalInvestigator: "Sipho",
        productTypes: new Set(),
        proposalCode: "2019-1-SCI-042",
      })
    ).toMatchSnapshot();

    expect(
      generalWhereCondition({
        errors: {},
        observationNight: "2019-05-01 .. 2019-05-13",
        principalInvestigator: "Sipho",
        productTypes: new Set(),
        proposalCode: "2019-1-SCI-042",
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
        searchConeRadiusUnits: "degrees",
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
        rightAscension: "13",
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
        rightAscension: "4 ... 355",
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
        rightAscension: "5 .. 9",
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
        rightAscension: "115 .. 200",
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
        targetTypes: new Set<TargetType>(["Galaxy"]),
      })
    );
    expect(
      targetWhereCondition({
        errors: {},
        targetTypes: new Set<TargetType>(["Galaxy", "Star"]),
      })
    );
    expect(
      targetWhereCondition({
        errors: {},
        targetTypes: new Set<TargetType>([
          "ISM",
          "Solar System Body",
          "Galaxy",
        ]),
      })
    );
  });
});

describe("telescopeWhereCondition", () => {
  it("should map conditions correctly", () => {
    expect(
      telescopeWhereCondition({
        detectorModes: ["Normal"],
        filters: ["Johnson U", "Cousins I"],
        hrsModes: ["High Stability"],
        instrumentModes: ["Imaging", "Spectroscopy"],
        instruments: ["RSS"],
        rssFabryPerotModes: ["MR", "HR"],
        rssGratings: ["pg0900", "pg1800"],
        rssPolarimetryModes: ["LINEAR"],
        telescopes: ["Lesedi", "SALT"],
      })
    ).toMatchSnapshot();
  });

  it("should map empty arrays correctly", () => {
    expect(
      telescopeWhereCondition({
        detectorModes: [],
        filters: [],
        hrsModes: [],
        instrumentModes: [],
        instruments: [],
        rssFabryPerotModes: [],
        rssGratings: [],
        rssPolarimetryModes: [],
        telescopes: [],
      })
    ).toMatchSnapshot();
  });

  it("should map All correctly", () => {
    expect(
      telescopeWhereCondition({
        detectorModes: ["All"],
        filters: ["All"],
        hrsModes: ["All"],
        instrumentModes: ["All"],
        instruments: ["All"],
        rssFabryPerotModes: ["All"],
        rssGratings: ["All"],
        rssPolarimetryModes: ["All"],
        telescopes: ["All"],
      })
    ).toMatchSnapshot();
  });

  it("should map All together with other items correctly", () => {
    expect(
      telescopeWhereCondition({
        detectorModes: ["All", "Normal"],
        filters: ["Johnson U", "All", "Cousins I"],
        hrsModes: ["High Stability", "All"],
        instrumentModes: ["All", "Imaging", "Spectroscopy"],
        instruments: ["RSS", "All"],
        rssFabryPerotModes: ["MR", "HR", "All"],
        rssGratings: ["All", "pg0900", "pg1800"],
        rssPolarimetryModes: ["LINEAR", "All"],
        telescopes: ["Lesedi", "All", "SALT"],
      })
    ).toMatchSnapshot();
  });
});
