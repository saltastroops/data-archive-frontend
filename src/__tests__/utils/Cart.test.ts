import DataKeys from "../../components/searchFormComponents/results/DataKeys";
import { Cart, ICartFile } from "../../util/Cart";

describe("Cart", () => {
  it("should have the correct size", () => {
    let cart = new Cart([
      { id: "A", name: "File A" },
      { id: "F", name: "File F" }
    ]);
    expect(cart.size).toBe(2);

    cart = new Cart([
      { id: "A", name: "File A" },
      { id: "B", name: "File B" },
      {
        id: "C",
        name: "File C",
        observation: { id: "Obs-B", name: "Observation B" }
      },
      { id: "D", name: "File D" },
      {
        id: "E",
        name: "File E",
        observation: { id: "Obs-A", name: "Observation A" }
      },
      { id: "F", name: "File F" }
    ]);
    expect(cart.size).toBe(6);
  });

  it("should return the correct files", () => {
    const files = [{ id: "A", name: "File A" }, { id: "F", name: "File F" }];
    expect(new Cart(files).files).toBe(files);
  });

  it("should know what it contains", () => {
    const cart = new Cart([
      { id: "A", name: "File A" },
      { id: "F", name: "File F" }
    ]);

    expect(cart.contains("A")).toBe(true);
    expect(cart.contains("F")).toBe(true);
    expect(cart.contains("AA")).toBe(false);
    expect(cart.contains("B")).toBe(false);
    expect(cart.contains("")).toBe(false);
  });

  it("should add files", () => {
    const cart = new Cart([
      { id: "A", name: "File A" },
      { id: "B", name: "File B" },
      { id: "C", name: "File C" },
      { id: "D", name: "File D" },
      { id: "E", name: "File E" },
      { id: "F", name: "File F" }
    ]);
    cart.add([
      { id: "A", name: "File A" },
      { id: "Q", name: "File Q" },
      { id: "D", name: "File D" },
      { id: "R", name: "File R" }
    ]);
    expect(cart.size).toBe(8);
    expect(cart.contains("A")).toBe(true);
    expect(cart.contains("B")).toBe(true);
    expect(cart.contains("C")).toBe(true);
    expect(cart.contains("D")).toBe(true);
    expect(cart.contains("E")).toBe(true);
    expect(cart.contains("F")).toBe(true);
    expect(cart.contains("Q")).toBe(true);
    expect(cart.contains("R")).toBe(true);
  });

  it("should remove files", () => {
    const cart = new Cart([
      { id: "A", name: "File A" },
      { id: "B", name: "File B" },
      { id: "C", name: "File C" },
      { id: "D", name: "File D" },
      { id: "E", name: "File E" },
      { id: "F", name: "File F" }
    ]);
    cart.remove([
      { id: "A", name: "File A" },
      { id: "Q", name: "File Q" },
      { id: "D", name: "File D" },
      { id: "R", name: "File R" }
    ]);
    expect(cart.size).toBe(4);
    expect(cart.contains("B")).toBe(true);
    expect(cart.contains("C")).toBe(true);
    expect(cart.contains("E")).toBe(true);
    expect(cart.contains("F")).toBe(true);
  });

  it("should provide cart items grouped by observation", () => {
    const cart = new Cart([
      {
        id: "A",
        [DataKeys.DATA_FILE_FILENAME]: "File A",
        [DataKeys.OBSERVATION_ID]: "Obs-A",
        [DataKeys.OBSERVATION_NAME]: "Observation A"
      },
      { id: "B", [DataKeys.DATA_FILE_FILENAME]: "File B" },
      { id: "C", [DataKeys.DATA_FILE_FILENAME]: "File C" },
      {
        id: "D",
        [DataKeys.DATA_FILE_FILENAME]: "File D",
        [DataKeys.OBSERVATION_ID]: "Obs-B",
        [DataKeys.OBSERVATION_NAME]: "Observation B"
      },
      {
        id: "E",
        [DataKeys.DATA_FILE_FILENAME]: "File E",
        [DataKeys.OBSERVATION_ID]: "Obs-A",
        [DataKeys.OBSERVATION_NAME]: "Observation A"
      },
      {
        id: "F",
        [DataKeys.DATA_FILE_FILENAME]: "File F",
        [DataKeys.OBSERVATION_ID]: "Obs-A",
        [DataKeys.OBSERVATION_NAME]: "Observation A"
      },
      {
        id: "G",
        [DataKeys.DATA_FILE_FILENAME]: "File G",
        [DataKeys.OBSERVATION_ID]: "Obs-C",
        [DataKeys.OBSERVATION_NAME]: "Observation C"
      },
      {
        id: "H",
        [DataKeys.DATA_FILE_FILENAME]: "File H",
        [DataKeys.OBSERVATION_ID]: "Obs-B",
        [DataKeys.OBSERVATION_NAME]: "Observation B"
      },
      { id: "I", [DataKeys.DATA_FILE_FILENAME]: "File I" }
    ]);
    const expected = new Map<string, ICartFile[]>();
    expected.set("", [
      { id: "B", [DataKeys.DATA_FILE_FILENAME]: "File B" },
      { id: "C", [DataKeys.DATA_FILE_FILENAME]: "File C" },
      { id: "I", [DataKeys.DATA_FILE_FILENAME]: "File I" }
    ]);
    expected.set("Obs-A", [
      {
        id: "A",
        [DataKeys.DATA_FILE_FILENAME]: "File A",
        [DataKeys.OBSERVATION_ID]: "Obs-A",
        [DataKeys.OBSERVATION_NAME]: "Observation A"
      },
      {
        id: "E",
        [DataKeys.DATA_FILE_FILENAME]: "File E",
        [DataKeys.OBSERVATION_ID]: "Obs-A",
        [DataKeys.OBSERVATION_NAME]: "Observation A"
      },
      {
        id: "F",
        [DataKeys.DATA_FILE_FILENAME]: "File F",
        [DataKeys.OBSERVATION_ID]: "Obs-A",
        [DataKeys.OBSERVATION_NAME]: "Observation A"
      }
    ]);
    expected.set("Obs-B", [
      {
        id: "D",
        [DataKeys.DATA_FILE_FILENAME]: "File D",
        [DataKeys.OBSERVATION_ID]: "Obs-B",
        [DataKeys.OBSERVATION_NAME]: "Observation B"
      },
      {
        id: "H",
        [DataKeys.DATA_FILE_FILENAME]: "File H",
        [DataKeys.OBSERVATION_ID]: "Obs-B",
        [DataKeys.OBSERVATION_NAME]: "Observation B"
      }
    ]);
    expected.set("Obs-C", [
      {
        id: "G",
        [DataKeys.DATA_FILE_FILENAME]: "File G",
        [DataKeys.OBSERVATION_ID]: "Obs-C",
        [DataKeys.OBSERVATION_NAME]: "Observation C"
      }
    ]);
    expect(cart.groupByObservation()).toEqual(expected);
  });
});
