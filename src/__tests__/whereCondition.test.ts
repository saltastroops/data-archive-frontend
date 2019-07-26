import { ISALT, ITarget } from "../util/query/types";
import {
  bvitWhereCondition,
  generalWhereCondition,
  hrsWhereCondition,
  rssWhereCondition,
  salticamWhereCondition,
  saltWhereCondition,
  targetWhereCondition,
  telescopeWhereCondition,
  whereCondition
} from "../util/query/whereCondition";
import {
  HRSMode,
  IGeneral,
  IHRS,
  IObservationQueryParameters,
  IRSS,
  ISalticam,
  RSSFabryPerotMode,
  RSSGrating,
  RSSInstrumentMode,
  RSSPolarimetryMode
} from "../utils/ObservationQueryParameters";
import { TargetType } from "../utils/TargetType";

describe("whereCondition", () => {
  it("should map query parameters correctly", () => {
    const general: IGeneral = {
      calibrations: new Set(),
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
      generalWhereCondition({
        errors: {},
        observationNight: "invaliddate",
        calibrations: new Set()
      });
    expect(f).toThrow(/invaliddate.*valid/);
  });

  it("should raise an error for an invalid observation night", () => {
    const f = () =>
      generalWhereCondition({
        errors: {},
        observationNight: "2019-02-29",
        calibrations: new Set()
      });
    expect(f).toThrow(/2019-02-29.*valid/);
  });

  it("should map an observation night to a greater equal and less equal condition spanning one night", () => {
    expect(
      generalWhereCondition({
        errors: {},
        observationNight: "2019-02-17",
        calibrations: new Set()
      })
    ).toMatchSnapshot();
  });

  it("should map a Principal Investigator to a contains condition", () => {
    expect(
      generalWhereCondition({
        errors: {},
        principalInvestigator: "Doe",
        calibrations: new Set()
      })
    ).toMatchSnapshot();
  });

  it("should map a proposal code to a contains condition", () => {
    expect(
      generalWhereCondition({
        errors: {},
        proposalCode: "2-SCI",
        calibrations: new Set()
      })
    ).toMatchSnapshot();
  });

  it("should map input data correctly", () => {
    expect(
      generalWhereCondition({
        calibrations: new Set(),
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
  it("should map the detector mode correctly", () => {
    const detectorModes: any = [
      "Drift Scan",
      "Frame Transfer",
      "Normal",
      "Slot Mode"
    ];
    const expectedModes = [
      "DRIFT SCAN",
      "FRAME TRANSFER",
      "NORMAL",
      "SLOT MODE"
    ];
    detectorModes.forEach((_, index: number) => {
      const salticam: ISalticam = {
        errors: {},
        name: "Salticam",
        detectorMode: detectorModes[index]
      };
      const expected = {
        AND: [
          {
            EQUALS: { column: "Instrument.instrumentName", value: "Salticam" }
          },
          {
            EQUALS: {
              column: "Salticam.detectorMode",
              value: expectedModes[index]
            }
          }
        ]
      };
      expect(salticamWhereCondition(salticam)).toEqual(expected);
    });
  });

  it("should map the filter correctly", () => {
    const filters: any = ["R-S1", "340-35", "SR708-25", "Sv-S1"];
    filters.forEach((filter: any) => {
      const salticam: ISalticam = {
        errors: {},
        name: "Salticam",
        filter
      };
      const expected = {
        AND: [
          {
            EQUALS: { column: "Instrument.instrumentName", value: "Salticam" }
          },
          { EQUALS: { column: "Salticam.filterName", value: filter } }
        ]
      };
      expect(salticamWhereCondition(salticam)).toEqual(expected);
    });
  });

  it("should combine conditions with an AND", () => {
    const salticam: ISalticam = {
      errors: {},
      name: "Salticam",
      detectorMode: "Frame Transfer",
      filter: "R-S1"
    };
    const expected = {
      AND: [
        { EQUALS: { column: "Instrument.instrumentName", value: "Salticam" } },
        {
          EQUALS: { column: "Salticam.detectorMode", value: "FRAME TRANSFER" }
        },
        { EQUALS: { column: "Salticam.filterName", value: "R-S1" } }
      ]
    };
    expect(salticamWhereCondition(salticam)).toEqual(expected);
  });
});

describe("rssWhereCondition", () => {
  it("should map the detector mode correctly", () => {
    const detectorModes: any = [
      "Drift Scan",
      "Frame Transfer",
      "Normal",
      "Shuffle",
      "Slot Mode"
    ];
    const expectedModes = [
      "DRIFT SCAN",
      "FRAME TRANSFER",
      "NORMAL",
      "SHUFFLE",
      "SLOT MODE"
    ];
    detectorModes.forEach((_, index: number) => {
      const rss: IRSS = {
        errors: {},
        name: "RSS",
        detectorMode: detectorModes[index]
      };
      const expected = {
        AND: [
          { EQUALS: { column: "Instrument.instrumentName", value: "RSS" } },
          {
            EQUALS: { column: "RSS.detectorMode", value: expectedModes[index] }
          }
        ]
      };
      expect(rssWhereCondition(rss)).toEqual(expected);
    });
  });

  it("should map the RSS modes correctly", () => {
    const modeNames: any = new Set([
      "Spectroscopy",
      "MOS",
      "FP Polarimatry",
      "Polarimetric Imaging"
    ]);
    const rss: IRSS = {
      errors: {},
      name: "RSS",
      modes: {
        errors: {},
        names: modeNames
      }
    };
    expect(rssWhereCondition(rss)).toMatchSnapshot();
  });

  it("should map the grating correctly", () => {
    const gratings: RSSGrating[] = ["Open", "pg1300", "pg3000"];
    gratings.forEach(grating => {
      const rss: IRSS = {
        errors: {},
        name: "RSS",
        modes: {
          errors: {},
          grating,
          names: new Set<RSSInstrumentMode>(["Spectroscopy"])
        }
      };
      const expected = {
        AND: [
          { EQUALS: { column: "Instrument.instrumentName", value: "RSS" } },
          { IS_IN: { column: "RssMode.rssMode", values: ["Spectroscopy"] } },
          { EQUALS: { column: "RSS.grating", value: grating } }
        ]
      };
      expect(rssWhereCondition(rss)).toEqual(expected);
    });
  });

  it("should map the Fabry-Perot mode correctly", () => {
    const fabryPerotModes: RSSFabryPerotMode[] = ["HR", "LR", "MR", "TF"];
    fabryPerotModes.forEach(fabryPerotMode => {
      const rss: IRSS = {
        errors: {},
        name: "RSS",
        modes: {
          errors: {},
          fabryPerotMode,
          names: new Set<RSSInstrumentMode>(["Spectroscopy"])
        }
      };
      const expected = {
        AND: [
          { EQUALS: { column: "Instrument.instrumentName", value: "RSS" } },
          { IS_IN: { column: "RssMode.rssMode", values: ["Spectroscopy"] } },
          {
            EQUALS: {
              column: "RssFabryPerotMode.rssFabryPerotMode",
              value: fabryPerotMode
            }
          }
        ]
      };
      expect(rssWhereCondition(rss)).toEqual(expected);
    });
  });

  it("should map the polarimetry modes correctly", () => {
    const polarimetryModes = new Set<RSSPolarimetryMode>([
      "LINEAR",
      "CIRCULAR"
    ]);
    const rss: IRSS = {
      errors: {},
      name: "RSS",
      modes: {
        errors: {},
        names: new Set<RSSInstrumentMode>([
          "Spectropolarimetry",
          "Polarimetric imaging"
        ]),
        polarimetryModes
      }
    };
    expect(rssWhereCondition(rss)).toMatchSnapshot();
  });
});

describe("hrsWhereCondition", () => {
  it("should map the mode correctly", () => {
    const modes: HRSMode[] = [
      "LOW RESOLUTION",
      "HIGH RESOLUTION",
      "INT CAL FIBRE"
    ];
    modes.forEach(mode => {
      const hrs: IHRS = {
        name: "HRS",
        errors: {},
        mode
      };
      const expected = {
        AND: [
          { EQUALS: { column: "Instrument.instrumentName", value: "HRS" } },
          { EQUALS: { column: "HRS.observationMode", value: mode } }
        ]
      };
      expect(hrsWhereCondition(hrs)).toEqual(expected);
    });
  });
});

describe("bvitWhereCondition", () => {
  // TODO: Add unit tests
  it("should work", () => {
    // to be filled with life
  });
});
