import * as React from "react";

export interface IValue {
  value: string | undefined;
  error?: string | undefined;
  onChange?: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}
export interface IName {
  name: string;
  error?: string;
  onChange?: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}

export interface ICode {
  code: string | undefined;
  error?: string | undefined;
  onChange?: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}

export interface ITitle {
  title: string | undefined;
  error?: string | undefined;
  onChange?: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}

// data _________________________________

export interface IData {
  dataTypes: string[];
  selectedDataType: string;
  arcs: boolean;
  biases: boolean;
  flats: boolean;
  standards: boolean;
  onChange: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}
// proposal____________________________________
interface IObsDate {
  onsDate: IValue;
}
interface IProposalCode {
  proposalCode: ICode;
}
interface IProposalTitle {
  proposalCode: ICode;
}
interface IPi {
  proposalCode: ICode;
}
export interface IProposal {
  onsDate: IObsDate;
  pi: IPi;
  proposalCode: IProposalCode;
  proposalTitle: IProposalTitle;
  onChange: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}
// target_________________________________________

export interface ITarget {
  ra?: string;
  dec?: string;
  radius?: string;
  radiusUnits?: string;
  name?: string;
  resolver?: string;
  errors: {
    ra?: string;
    radius?: string;
    name?: string;
    dec?: string;
  };
}

// telescope_______________________________________

interface ITelescope {
  name: string;
}

export interface ISALT extends ITelescope {
  instrument: string;
}

interface IInstrumentsDetails {
  mode?: string;
  filter?: string;
  detectorMode?: string;
  exposureMode?: string;
}
export interface ITelescopeDetails {
  telescope: string;
  instrument: string;
  instrumentDetails: any;
}

export interface IInstrumentsMode {
  bvit: {
    filter: string;
    mode: string;
  };
  hippo: {};
  hrs: {
    mode: string;
  };
  rss: {
    detectorMode: string;
    mode: string;
  };
  satlicam: {
    detectorMode: string;
  };
  shoc: {};
  spupMic: {};
}

export interface IState {
  data: IData;
  proposal: IProposal;
  target: ITarget;
  telescope: ITelescope;
}
