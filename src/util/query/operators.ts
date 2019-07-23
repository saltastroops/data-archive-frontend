import { IWhereCondition, IWithinRadiusArguments } from "./types";

type DATABASE_VALUE = string | number | boolean;

export function and(conditions: IWhereCondition[]): IWhereCondition {
  return {
    AND: conditions
  };
}

export function or(conditions: IWhereCondition[]): IWhereCondition {
  return {
    OR: conditions
  };
}

export function not(condition: IWhereCondition): IWhereCondition {
  return {
    NOT: condition
  };
}

export function equals(column: string, value: DATABASE_VALUE): IWhereCondition {
  return {
    EQUALS: { column, value }
  };
}

export function isNull(column: string) {
  return {
    IS_NULL: column
  };
}

export function lessThan(
  column: string,
  value: DATABASE_VALUE
): IWhereCondition {
  return {
    LESS_THAN: { column, value }
  };
}

export function greaterThan(
  column: string,
  value: DATABASE_VALUE
): IWhereCondition {
  return {
    GREATER_THAN: { column, value }
  };
}

export function lessEqual(
  column: string,
  value: DATABASE_VALUE
): IWhereCondition {
  return {
    LESS_EQUAL: { column, value }
  };
}

export function greaterEqual(
  column: string,
  value: DATABASE_VALUE
): IWhereCondition {
  return {
    GREATER_EQUAL: { column, value }
  };
}

export function isIn(
  column: string,
  values: DATABASE_VALUE[]
): IWhereCondition {
  return {
    IS_IN: { column, values }
  };
}

export function contains(
  column: string,
  value: DATABASE_VALUE
): IWhereCondition {
  return {
    CONTAINS: { column, value }
  };
}

export function startsWith(
  column: string,
  value: DATABASE_VALUE
): IWhereCondition {
  return {
    STARTS_WITH: { column, value }
  };
}

export function endsWith(
  column: string,
  value: DATABASE_VALUE
): IWhereCondition {
  return {
    ENDS_WITH: { column, value }
  };
}

export function withinRadius(args: IWithinRadiusArguments): IWhereCondition {
  return {
    WITHIN_RADIUS: args
  };
}
