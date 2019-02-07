export interface IValue {
  value: string | undefined;
  error?: string | undefined;
  onChange?: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}
export interface IName {
  name: string;
  error?: string | undefined;
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
interface Idata {
  arcs: boolean;
  biases: boolean;
  dataType: string[];
  flats: boolean;
  selectedDataType: boolean;
  standards: boolean;
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
interface IProposal {
  onsDate: IObsDate;
  pi: IPi;
  proposalCode: IProposalCode;
  proposalTitle: IProposalTitle;
}
// target_________________________________________
interface IRa {
  ra: IValue;
}
interface IDec {
  dec: IValue;
}
interface ITargetName {
  targetName: IValue;
}
interface IResolver {
  resolver: IValue;
}
interface IRadius {
  radius: IValue;
}
interface IRadiusUnits {
  radiusUnits: IValue;
}
interface ITarget {
  ra: IRa;
  dec: IDec;
  radius: IRadius;
  radiusUnits: IRadiusUnits;
  targetName: ITargetName;
  resolver: IResolver;
}

// telescope_______________________________________

interface ITelescope {
  otherInstruments: string[];
  saltInstruments: string[];
  selectedInstrument: string;
  selectedTelescope: string;
  telescopes: string[];
}

export interface IState {
  data: Idata;
  proposal: IProposal;
  target: ITarget;
  telescope: ITelescope;
}
