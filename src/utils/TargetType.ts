export type TargetType = "Galaxy" | "ISM" | "Solar System Body" | "Star";

export const GALAXY = "Galaxy";

export const ISM = "ISM";

export const SOLAR_SYSTEM_BODY = "Solar System Body";

export const STAR = "Star";

export const TARGET_TYPE_CODES = new Map<TargetType, string>([
  ["Galaxy", "15"],
  ["ISM", "13"],
  ["Solar System Body", "50"],
  ["Star", "14"],
]);
