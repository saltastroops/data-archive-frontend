const updateState = (state: any, name: string, value: string) => {
  let newState = state;
  if (name === "targetName") {
    newState = {
      ...state,
      target: {
        ...state.target,
        targetName: {
          ...state.target.targetName,
          name: value
        }
      }
    };
  }
  if (name === "ra") {
    newState = {
      ...state,
      target: {
        ...state.target,
        ra: {
          ...state.target.ra,
          value
        }
      }
    };
  }
  if (name === "dec") {
    newState = {
      ...state,
      target: {
        ...state.target,
        dec: {
          ...state.target.dec,
          value
        }
      }
    };
  }
  if (name === "radius") {
    newState = {
      ...state,
      target: {
        ...state.target,
        radius: {
          ...state.target.radius,
          value
        }
      }
    };
  }
  if (name === "radiusUnits") {
    newState = {
      ...state,
      target: {
        ...state.target,
        radiusUnits: {
          ...state.target.radiusUnits,
          value
        }
      }
    };
  }
  if (name === "resolver") {
    newState = {
      ...state,
      target: {
        ...state.target,
        resolver: {
          ...state.target.resolver,
          value
        }
      }
    };
  }
  if (name === "proposalCode") {
    newState = {
      ...state,
      proposal: {
        ...state.proposal,
        proposalCode: {
          ...state.proposal.proposalCode,
          code: value
        }
      }
    };
  }
  if (name === "proposalTitle") {
    newState = {
      ...state,
      proposal: {
        ...state.proposal,
        proposalTitle: {
          ...state.proposal.proposalTitle,
          title: value
        }
      }
    };
  }
  if (name === "pi") {
    newState = {
      ...state,
      proposal: {
        ...state.proposal,
        pi: {
          ...state.proposal.pi,
          name: value
        }
      }
    };
  }
  if (name === "obsDate") {
    newState = {
      ...state,
      proposal: {
        ...state.proposal,
        obsDate: {
          ...state.proposal.obsDate,
          value
        }
      }
    };
  }
  if (name === "telescope") {
    newState = {
      ...state,
      telescope: {
        ...state.telescope,
        selectedTelescope: value
      }
    };
  }
  if (name === "instrument") {
    newState = {
      ...state,
      telescope: {
        ...state.telescope,
        selectedInstrument: value
      }
    };
  }
  if (name === "dataType") {
    newState = {
      ...state,
      data: {
        ...state.data,
        selectedDataType: value
      }
    };
  }
  if (name === "arcs") {
    console.log("arcs", value);
    newState = {
      ...state,
      data: {
        ...state.data,
        arcs: !state.data.arcs
      }
    };
  }
  if (name === "biases") {
    newState = {
      ...state,
      data: {
        ...state.data,
        biases: !state.data.biases
      }
    };
  }
  if (name === "standards") {
    newState = {
      ...state,
      data: {
        ...state.data,
        standards: !state.data.standards
      }
    };
  }
  if (name === "flats") {
    newState = {
      ...state,
      data: {
        ...state.data,
        flats: !state.data.flats
      }
    };
  }
  return newState;
};

const checkDateFormatError = (date: string) => {
  let error = "";
  const dateReg = /^[0-3]\d([./-])[0-1]\d\1\d{4}$/;
  if (date !== "" && !date.match(dateReg)) {
    error = "Date format does not match (date should be like [DD-MM-YYYY])";
  }
  return error;
};

const checkNameFormatError = (name: string) => {
  let error = "";
  const nameReg = /^[a-zA-Z0-9 ]*$/;
  if (name !== "" && !name.match(nameReg)) {
    error = "This should only contains characters contained in a name only";
  }
  return error;
};

const checkValueFormatError = (value: string) => {
  let error = "";
  const dateReg = /^[1-9]\d*(\.\d+)?$/;
  if (value !== "" && !value.match(dateReg)) {
    error = "This should be a number";
  }
  return error;
};

const validateQuery = (state: any) => {
  return {
    ...state,
    proposal: {
      obsDate: {
        ...state.proposal.obsDate,
        error: checkDateFormatError(state.proposal.obsDate.value)
      },
      pi: {
        ...state.proposal.pi,
        error: checkNameFormatError(state.proposal.pi.name)
      },
      proposalCode: {
        ...state.proposal.proposalCode,
        error: checkNameFormatError(state.proposal.proposalCode.code)
      },
      proposalTitle: {
        ...state.proposal.proposalTitle,
        error: checkNameFormatError(state.proposal.proposalTitle.title)
      }
    },
    target: {
      dec: {
        ...state.target.dec,
        error: checkValueFormatError(state.target.dec.value)
      },
      ra: {
        ...state.target.ra,
        error: checkValueFormatError(state.target.ra.value)
      },
      radius: {
        ...state.target.radius,
        error: checkValueFormatError(state.target.radius.value)
      },
      radiusUnits: {
        ...state.target.radiusUnits
      },
      resolver: {
        ...state.target.resolver
      },
      targetName: {
        ...state.target.targetName,
        error: checkNameFormatError(state.target.targetName.name)
      }
    }
  };
};
export { updateState, validateQuery };
