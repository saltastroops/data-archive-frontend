import * as React from "react";
import {
  updateState,
  validateQuery
} from "../../components/basicComponents/util";

const onChange = () => {
  return;
};
const state = {
  data: {
    arcs: false,
    biases: false,
    dataType: ["aaa", "bbb", "ccc"],
    flats: false,
    selectedDataType: "aaa",
    standards: false
  },
  proposal: {
    obsDate: {
      error: "",
      onChange,
      value: ""
    },
    pi: {
      error: "",
      name: "",
      onChange
    },
    proposalCode: {
      code: "",
      error: "",
      onChange
    },
    proposalTitle: {
      error: "",
      onChange,
      title: ""
    }
  },
  target: {
    dec: {
      error: "",
      onChange,
      value: ""
    },
    ra: {
      error: "",
      onChange,
      value: ""
    },
    radius: {
      error: "",
      onChange,
      value: ""
    },
    radiusUnits: {
      error: "",
      onChange,
      value: ""
    },
    resolver: {
      error: "",
      onChange,
      value: ""
    },
    targetName: {
      error: "",
      name: "",
      onChange
    }
  },
  telescope: {
    otherInstruments: ["any", "Hippo", "SHOC", "SpupMic"],
    saltInstruments: ["any", "HRS", "RSS", "BVIT", "SALTICAM"],
    selectedInstrument: "any",
    selectedTelescope: "any",
    telescopes: ["any", "SALT", "Lesedi", "1.9 inch"]
  }
};

describe("State update", () => {
  it("No update anything", () => {
    expect(updateState({ name: "" }, "name", "value")).toEqual({ name: "" });
  });
  it("Update any target value and only that value", () => {
    const targetState = { target: { ra: { value: "" } } };
    expect(updateState(targetState, "ra", "8")).toEqual({
      target: { ra: { value: "8" } }
    });
  });
  it("Update any proposal value without changing any thing else", () => {
    const proposalState = {
      proposal: { pi: { name: "" } },
      target: { ra: { value: "bbb" } }
    };
    expect(updateState(proposalState, "pi", "my name")).toEqual({
      proposal: { pi: { name: "my name" } },
      target: { ra: { value: "bbb" } }
    });
  });
  it("Update telescope value and add the value if there was no value", () => {
    const telescopeState = {};
    expect(updateState(telescopeState, "telescope", "XXX")).toEqual({
      telescope: { selectedTelescope: "XXX" }
    });
  });
});

describe("Generate error if value has error", () => {
  it("not cause error if there is no error", () => {
    expect(validateQuery(state)).toEqual(state);
    const goodState = {
      data: {
        arcs: false,
        biases: false,
        dataType: ["aaa", "bbb", "ccc"],
        flats: true,
        selectedDataType: "aaa",
        standards: true
      },
      proposal: {
        obsDate: {
          error: "",
          onChange,
          value: "11-12-1234"
        },
        pi: {
          error: "",
          name: "good",
          onChange
        },
        proposalCode: {
          code: "good",
          error: "",
          onChange
        },
        proposalTitle: {
          error: "",
          onChange,
          title: "very good"
        }
      },
      target: {
        dec: {
          error: "",
          onChange,
          value: "1"
        },
        ra: {
          error: "",
          onChange,
          value: "1"
        },
        radius: {
          error: "",
          onChange,
          value: "1"
        },
        radiusUnits: {
          error: "",
          onChange,
          value: "1"
        },
        resolver: {
          error: "",
          onChange,
          value: "good"
        },
        targetName: {
          error: "",
          name: "good",
          onChange
        }
      },
      telescope: {
        otherInstruments: ["any", "Hippo", "SHOC", "SpupMic"],
        saltInstruments: ["any", "HRS", "RSS", "BVIT", "SALTICAM"],
        selectedInstrument: "any",
        selectedTelescope: "any",
        telescopes: ["any", "SALT", "Lesedi", "1.9 inch"]
      }
    };
    expect(validateQuery(goodState)).toEqual(goodState);
  });
  it("cause error if there is an error", () => {
    expect(validateQuery(state)).toEqual(state);
    const badState = {
      data: {
        arcs: false,
        biases: false,
        dataType: ["aaa", "bbb", "ccc"],
        flats: true,
        selectedDataType: "aaa",
        standards: true
      },
      proposal: {
        obsDate: {
          error: "",
          onChange,
          value: "11-yui"
        },
        pi: {
          error: "",
          name: "good",
          onChange
        },
        proposalCode: {
          code: "good",
          error: "",
          onChange
        },
        proposalTitle: {
          error: "",
          onChange,
          title: "very good"
        }
      },
      target: {
        dec: {
          error: "",
          onChange,
          value: "1"
        },
        ra: {
          error: "",
          onChange,
          value: "hello"
        },
        radius: {
          error: "",
          onChange,
          value: "1"
        },
        radiusUnits: {
          error: "",
          onChange,
          value: "1"
        },
        resolver: {
          error: "",
          onChange,
          value: "good"
        },
        targetName: {
          error: "",
          name: "good",
          onChange
        }
      },
      telescope: {
        otherInstruments: ["any", "Hippo", "SHOC", "SpupMic"],
        saltInstruments: ["any", "HRS", "RSS", "BVIT", "SALTICAM"],
        selectedInstrument: "any",
        selectedTelescope: "any",
        telescopes: ["any", "SALT", "Lesedi", "1.9 inch"]
      }
    };
    expect(validateQuery(badState).proposal.obsDate.error).toEqual(
      "Date format does not match (date should be like [DD-MM-YYYY])"
    );
    expect(validateQuery(badState).target.ra.error).toEqual(
      "This should be a number"
    );
  });
});
