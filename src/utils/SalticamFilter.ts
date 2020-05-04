export type SalticamFilter =
  | "SalticamFilter_Name"
  | "340-35"
  | "380-40"
  | "B-S1"
  | "CLR-S1"
  | "Halpha-S1"
  | "Hbn-S1"
  | "Hbw-S1"
  | "I-S1"
  | "R-S1"
  | "Sb-S1"
  | "SDSSg-S1"
  | "SDSSi-S1"
  | "SDSSr-S1"
  | "SDSSu-S1"
  | "SDSSz-S1"
  | "SR613-21"
  | "SR708-25"
  | "SR815-29"
  | "SR862-32"
  | "Su-S1"
  | "Sv-S1"
  | "Sy-S1"
  | "U-S1"
  | "V-S1";

export interface ISalticamFilter {
  name: SalticamFilter;
  descriptiveName: string;
}
