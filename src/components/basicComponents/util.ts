const updateState = (state: any, name: string, value: string) => {
  switch (name) {
    // target ___________________________________________
    case "targetName": {
      return {
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
    case "ra": {
      return {
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
    case "dec": {
      return {
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
    case "radius": {
      return {
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
    case "radiusUnits": {
      return {
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
    case "resolver": {
      return {
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
    // Proposal ___________________________________________
    case "proposalCode": {
      return {
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
    case "proposalTitle": {
      return {
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
    case "pi": {
      return {
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
    case "obsDate": {
      return {
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
    // Telescope__________________________________________________________________________
    case "rssDetectorMode": {
      return {
        ...state,
        telescope: {
          ...state.telescope,
          instrumentsMode: {
            ...state.telescope.instrumentsMode,
            rss: {
              ...state.telescope.instrumentsMode.rss,
              detectorMode: value
            }
          }
        }
      };
    }
    case "rssMode": {
      return {
        ...state,
        telescope: {
          ...state.telescope,
          instrumentsMode: {
            ...state.telescope.instrumentsMode,
            rss: {
              ...state.telescope.instrumentsMode.rss,
              mode: value
            }
          }
        }
      };
    }
    case "hrsMode": {
      return {
        ...state,
        telescope: {
          ...state.telescope,
          instrumentsMode: {
            ...state.telescope.instrumentsMode,
            hrs: {
              mode: value
            }
          }
        }
      };
    }
    case "salticamDetectorMode": {
      return {
        ...state,
        telescope: {
          ...state.telescope,
          instrumentsMode: {
            ...state.telescope.instrumentsMode,
            satlicam: {
              detectorMode: value
            }
          }
        }
      };
    }
    case "bvitMode": {
      return {
        ...state,
        telescope: {
          ...state.telescope,
          instrumentsMode: {
            ...state.telescope.instrumentsMode,
            bvit: {
              ...state.telescope.instrumentsMode.bvit,
              mode: value
            }
          }
        }
      };
    }
    case "bvitFilter": {
      return {
        ...state,
        telescope: {
          ...state.telescope,
          instrumentsMode: {
            ...state.telescope.instrumentsMode,
            bvit: {
              ...state.telescope.instrumentsMode.bvit,
              filter: value
            }
          }
        }
      };
    }
    case "telescope": {
      return {
        ...state,
        telescope: {
          ...state.telescope,
          instrumentsMode: {
            bvit: {
              filter: "",
              mode: ""
            },
            hippo: {},
            hrs: {
              mode: ""
            },
            rss: {
              detectorMode: "",
              mode: ""
            },
            satlicam: {
              detectorMode: ""
            },
            shoc: {},
            spupMic: {}
          },
          selectedTelescope: value
        }
      };
    }
    case "instrument": {
      return {
        ...state,
        telescope: {
          ...state.telescope,
          instrumentsMode: {
            bvit: {
              filter: "",
              mode: ""
            },
            hippo: {},
            hrs: {
              mode: ""
            },
            rss: {
              detectorMode: "",
              mode: ""
            },
            satlicam: {
              detectorMode: ""
            },
            shoc: {},
            spupMic: {}
          },
          selectedInstrument: value
        }
      };
    }
    // __________________________________________________________________________
    case "dataType": {
      return {
        ...state,
        data: {
          ...state.data,
          selectedDataType: value
        }
      };
    }
    case "arcs": {
      return {
        ...state,
        data: {
          ...state.data,
          arcs: !state.data.arcs
        }
      };
    }
    case "biases": {
      return {
        ...state,
        data: {
          ...state.data,
          biases: !state.data.biases
        }
      };
    }
    case "standards": {
      return {
        ...state,
        data: {
          ...state.data,
          standards: !state.data.standards
        }
      };
    }
    case "flats": {
      return {
        ...state,
        data: {
          ...state.data,
          flats: !state.data.flats
        }
      };
    }
    default:
      return state;
  }
};

const updateTelescopeDetails = (state: any, name: string, value: string) => {
  return {
    ...state,
    telescopeDetails: {
      ...state.telescopeDetails,
      instrumentsDetails: {
        detectorMode: "",
        exposureMode: "",
        filter: "",
        mode: ""
      },
      [name]: value
    }
  };
};
const updateInstrumentDetails = (state: any, name: string, value: string) => {
  const instrument = state.telescopeDetails.instrument;
  let details = { ...state.telescopeDetails.instrumentDetails };
  switch (instrument) {
    case "bvit": {
      details = {
        ...state.telescopeDetails.instrumentDetails,
        [name]: value,
        detectorMode: "",
        exposureMode: ""
      };
      break;
    }
    case "hrs": {
      details = {
        detectorMode: "",
        exposureMode: "",
        filter: "",
        mode: value
      };
      break;
    }
    case "rss": {
      details = {
        ...state.telescopeDetails.instrumentDetails,
        [name]: value,
        exposureMode: "",
        filter: ""
      };
      break;
    }
    case "salticam": {
      details = {
        detectorMode: value,
        exposureMode: "",
        filter: "",
        mode: ""
      };
    }
  }
  return {
    ...state,
    telescopeDetails: {
      ...state.telescopeDetails,
      instrumentDetails: {
        ...details
      }
    }
  };
};

const checkDateFormatError = (date: string) => {
  let error = "";
  const dateReg = /^[0-3]\d([./-])[0-1]\d\1\d{4}$/;
  if (date !== "" && !date.match(dateReg)) {
    error = "Date format does not match (date should be like [DD-MM-YYYY])";
  }
  return error;
};

export const checkNameFormatError = (name: string) => {
  let error = "";
  const nameReg = /^[a-zA-Z0-9 ]*$/;
  if (name !== "" && !name.match(nameReg)) {
    error = "This should only contains characters contained in a name only";
  }
  return error;
};
const resolveTargetName = (name: string, resolver: string) => {
  return {
    dec: 0,
    eqinox: 2000,
    ra: 0
  };
};

const resolveTargetNameError = (name: string, resolver: string) => {
  if (
    name === "" ||
    name === "error" ||
    name === undefined ||
    name === null ||
    ["ned", "simbad", "vizier"].indexOf(resolver.toLocaleLowerCase()) === 0
  ) {
    return `Can not resolve name ${name} by resolver ${resolver}`;
  }
  return "";
};

const checkValueFormatError = (value: string) => {
  let error = "";
  const dateReg = /^[-+]?[1-9]\d*(\.\d*)?$/; // /^\d{1,3}\D+\d{1,2}\D+\
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
        error: resolveTargetNameError(
          state.target.targetName.name,
          state.target.resolver.value
        )
      }
    }
  };
};

export {
  updateState,
  validateQuery,
  updateTelescopeDetails,
  updateInstrumentDetails
};
