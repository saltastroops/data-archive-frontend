import moment, { Moment } from "moment";
import { IGeneral } from "./ObservationQueryParameters";

const GENERAL_OBSERVATION_NIGHT = "A.ObsNight";

const GENERAL_PRINCIPAL_INVESTIGATOR = "A.PrincipalInvestigator";

const GENERAL_PROPOSAL_CODE = "A.ProposalCode";

export function generalWhereConstraints(general: IGeneral): any {
  const constraints = [];

  // Night when the observation was taken
  const observationNight = trim(general.observationNight);
  if (observationNight) {
    const startTime = parseDate(observationNight).add(14, "hours"); // noon SAST
    const startTimeString = startTime.format("YYYY-MM-DD");
    const endTime = startTime.add(1, "day");
    const endTimeString = endTime.format("YYYY-MM-DD");
    constraints.push(greaterThan(GENERAL_OBSERVATION_NIGHT, startTimeString));
    constraints.push(lessThan(GENERAL_OBSERVATION_NIGHT, endTimeString));
  }

  // Principal Investigator
  const principalInvestigator = trim(general.principalInvestigator);
  if (principalInvestigator) {
    constraints.push(
      contains(GENERAL_PRINCIPAL_INVESTIGATOR, principalInvestigator)
    );
  }

  // Proposal code
  const proposalCode = trim(general.proposalCode);
  if (proposalCode) {
    constraints.push(contains(GENERAL_PROPOSAL_CODE, proposalCode));
  }

  return constraints;
}

type DATABASE_VALUE = string | number | boolean;

function equals(column: string, value: DATABASE_VALUE) {
  return {
    EQUALS: { column, value }
  };
}

function lessThan(column: string, value: DATABASE_VALUE) {
  return {
    LESS_THAN: { column, value }
  };
}

function greaterThan(column: string, value: DATABASE_VALUE) {
  return {
    GREATER_THAN: { column, value }
  };
}

function contains(column: string, value: DATABASE_VALUE) {
  return {
    CONTAINS: { column, value }
  };
}

function trim(value: string | null | undefined) {
  if (value) {
    return value.trim();
  }
  return value;
}

/**
 * Parse the given string as a date, and return the date as a string as a
 * Moment instance.
 *
 * Thec string must have the format 'YYYY-MM-DD', and it must be a valid date.
 *
 * The date is assumed to be given as UTC.
 */
function parseDate(date: string) {
  const t = moment.utc(date, "YYYY-MM-DD");
  if (!t.isValid()) {
    throw new Error(`${date} is not a valid date.`);
  }
  t.startOf("day");
  return t;
}
