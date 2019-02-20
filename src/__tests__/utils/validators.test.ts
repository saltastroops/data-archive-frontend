import * as React from "react";
import { isFloat } from "../../utils/validators";

describe("isFloat should be true if value is float else false", () => {
  it("Should be true", () => {
    expect(isFloat("1.1")).toBe(true);
    expect(isFloat("1,1")).toBe(true);
    expect(isFloat("1")).toBe(true);
    expect(isFloat("1111.11")).toBe(true);
    expect(isFloat("1.1")).toBe(true);
  });
  it("Should be true for numbers", () => {
    let value: any; // Fool TypeScript any type
    value = 12.12;
    expect(isFloat(value)).toBe(true);
    value = 1212;
    expect(isFloat(value)).toBe(true);
    value = 1;
    expect(isFloat(value)).toBe(true);
    value = 12;
    expect(isFloat(value)).toBe(true);
  });
  it("Should be true for array containing only one truthful value", () => {
    let value: any; // Fool TypeScript any type
    value = [12.12];
    expect(isFloat(value)).toBe(true);
    value = ["12.12"];
    expect(isFloat(value)).toBe(true);
    value = [1];
    expect(isFloat(value)).toBe(true);
    value = ["12."];
    expect(isFloat(value)).toBe(true);
  });
  it("Should be false for none floats", () => {
    expect(isFloat("1.1.")).toBe(false);
    expect(isFloat("1,1,")).toBe(false);
    expect(isFloat("")).toBe(false);
    expect(isFloat("1as")).toBe(false);
    expect(isFloat("11,11.11")).toBe(false);
    expect(isFloat("1ton")).toBe(false);
  });
  it("Should be false for none string value", () => {
    let value: any; // Fool TypeScript any type
    value = null;
    expect(isFloat(value)).toBe(false);
    value = undefined;
    expect(isFloat(value)).toBe(false);
    value = { value: "1.1" };
    expect(isFloat(value)).toBe(false);
    value = ["20.12", "1.1"];
    expect(isFloat(value)).toBe(false);
  });
});
