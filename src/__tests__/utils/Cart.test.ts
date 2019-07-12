import { Cart, ICartFile } from "../../util/Cart";
import DataKeys from "../../components/searchFormComponents/results/DataKeys";

describe("Cart", () => {
  it("should have the correct size", () => {
    let cart = new Cart([
      { [DataKeys.DATA_FILE_ID]: "A", name: "File A" },
      { [DataKeys.DATA_FILE_ID]: "F", name: "File F" }
    ]);
    expect(cart.size).toBe(2);

    cart = new Cart([
      { [DataKeys.DATA_FILE_ID]: "A", name: "File A" },
      { [DataKeys.DATA_FILE_ID]: "B", name: "File B" },
      {
        [DataKeys.DATA_FILE_ID]: "C",
        name: "File C",
        observation: { [DataKeys.DATA_FILE_ID]: "Obs-B", name: "Observation B" }
      },
      { [DataKeys.DATA_FILE_ID]: "D", name: "File D" },
      {
        [DataKeys.DATA_FILE_ID]: "E",
        name: "File E",
        observation: { [DataKeys.DATA_FILE_ID]: "Obs-A", name: "Observation A" }
      },
      { [DataKeys.DATA_FILE_ID]: "F", name: "File F" }
    ]);
    expect(cart.size).toBe(6);
  });

  it("should return the correct files", () => {
    const files = [
      { [DataKeys.DATA_FILE_ID]: "A", name: "File A" },
      { [DataKeys.DATA_FILE_ID]: "F", name: "File F" }
    ];
    expect(new Cart(files).files).toBe(files);
  });

  it("should know what it contains", () => {
    const cart = new Cart([
      { [DataKeys.DATA_FILE_ID]: "A", name: "File A" },
      { [DataKeys.DATA_FILE_ID]: "F", name: "File F" }
    ]);

    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "A", name: "File A" })
    ).toBe(true);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "F", name: "File A" })
    ).toBe(true);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "AA", name: "File AA" })
    ).toBe(false);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "B", name: "File B" })
    ).toBe(false);
    expect(cart.contains({ [DataKeys.DATA_FILE_ID]: "", name: "File" })).toBe(
      false
    );
  });

  it("should add files", () => {
    const cart = new Cart([
      { [DataKeys.DATA_FILE_ID]: "A", name: "File A" },
      { [DataKeys.DATA_FILE_ID]: "B", name: "File B" },
      { [DataKeys.DATA_FILE_ID]: "C", name: "File C" },
      { [DataKeys.DATA_FILE_ID]: "D", name: "File D" },
      { [DataKeys.DATA_FILE_ID]: "E", name: "File E" },
      { [DataKeys.DATA_FILE_ID]: "F", name: "File F" }
    ]);
    cart.add([
      { [DataKeys.DATA_FILE_ID]: "A", name: "File A" },
      { [DataKeys.DATA_FILE_ID]: "Q", name: "File Q" },
      { [DataKeys.DATA_FILE_ID]: "D", name: "File D" },
      { [DataKeys.DATA_FILE_ID]: "R", name: "File R" }
    ]);
    expect(cart.size).toBe(8);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "A", name: "File A" })
    ).toBe(true);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "B", name: "File B" })
    ).toBe(true);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "C", name: "File C" })
    ).toBe(true);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "D", name: "File D" })
    ).toBe(true);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "E", name: "File E" })
    ).toBe(true);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "F", name: "File F" })
    ).toBe(true);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "Q", name: "File Q" })
    ).toBe(true);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "R", name: "File R" })
    ).toBe(true);
  });

  it("should remove files", () => {
    const cart = new Cart([
      { [DataKeys.DATA_FILE_ID]: "A", name: "File A" },
      { [DataKeys.DATA_FILE_ID]: "B", name: "File B" },
      { [DataKeys.DATA_FILE_ID]: "C", name: "File C" },
      { [DataKeys.DATA_FILE_ID]: "D", name: "File D" },
      { [DataKeys.DATA_FILE_ID]: "E", name: "File E" },
      { [DataKeys.DATA_FILE_ID]: "F", name: "File F" }
    ]);
    cart.remove([
      { [DataKeys.DATA_FILE_ID]: "A", name: "File A" },
      { [DataKeys.DATA_FILE_ID]: "Q", name: "File Q" },
      { [DataKeys.DATA_FILE_ID]: "D", name: "File D" },
      { [DataKeys.DATA_FILE_ID]: "R", name: "File R" }
    ]);
    expect(cart.size).toBe(4);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "B", name: "File B" })
    ).toBe(true);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "C", name: "File C" })
    ).toBe(true);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "E", name: "File E" })
    ).toBe(true);
    expect(
      cart.contains({ [DataKeys.DATA_FILE_ID]: "F", name: "File F" })
    ).toBe(true);
  });

  it("should provide cart items grouped by observation", () => {
    const cart = new Cart([
      {
        [DataKeys.DATA_FILE_ID]: "A",
        [DataKeys.DATA_FILE_FILENAME]: "File A",
        [DataKeys.OBSERVATION_ID]: "Obs-A",
        [DataKeys.OBSERVATION_NAME]: "Observation A"
      },
      { [DataKeys.DATA_FILE_ID]: "B", [DataKeys.DATA_FILE_FILENAME]: "File B" },
      { [DataKeys.DATA_FILE_ID]: "C", [DataKeys.DATA_FILE_FILENAME]: "File C" },
      {
        [DataKeys.DATA_FILE_ID]: "D",
        [DataKeys.DATA_FILE_FILENAME]: "File D",
        [DataKeys.OBSERVATION_ID]: "Obs-B",
        [DataKeys.OBSERVATION_NAME]: "Observation B"
      },
      {
        [DataKeys.DATA_FILE_ID]: "E",
        [DataKeys.DATA_FILE_FILENAME]: "File E",
        [DataKeys.OBSERVATION_ID]: "Obs-A",
        [DataKeys.OBSERVATION_NAME]: "Observation A"
      },
      {
        [DataKeys.DATA_FILE_ID]: "F",
        [DataKeys.DATA_FILE_FILENAME]: "File F",
        [DataKeys.OBSERVATION_ID]: "Obs-A",
        [DataKeys.OBSERVATION_NAME]: "Observation A"
      },
      {
        [DataKeys.DATA_FILE_ID]: "G",
        [DataKeys.DATA_FILE_FILENAME]: "File G",
        [DataKeys.OBSERVATION_ID]: "Obs-C",
        [DataKeys.OBSERVATION_NAME]: "Observation C"
      },
      {
        [DataKeys.DATA_FILE_ID]: "H",
        [DataKeys.DATA_FILE_FILENAME]: "File H",
        [DataKeys.OBSERVATION_ID]: "Obs-B",
        [DataKeys.OBSERVATION_NAME]: "Observation B"
      },
      { [DataKeys.DATA_FILE_ID]: "I", [DataKeys.DATA_FILE_FILENAME]: "File I" }
    ]);
    const expected = new Map<string, ICartFile[]>();
    expected.set("", [
      { [DataKeys.DATA_FILE_ID]: "B", [DataKeys.DATA_FILE_FILENAME]: "File B" },
      { [DataKeys.DATA_FILE_ID]: "C", [DataKeys.DATA_FILE_FILENAME]: "File C" },
      { [DataKeys.DATA_FILE_ID]: "I", [DataKeys.DATA_FILE_FILENAME]: "File I" }
    ]);
    expected.set("Obs-A", [
      {
        [DataKeys.DATA_FILE_ID]: "A",
        [DataKeys.DATA_FILE_FILENAME]: "File A",
        [DataKeys.OBSERVATION_ID]: "Obs-A",
        [DataKeys.OBSERVATION_NAME]: "Observation A"
      },
      {
        [DataKeys.DATA_FILE_ID]: "E",
        [DataKeys.DATA_FILE_FILENAME]: "File E",
        [DataKeys.OBSERVATION_ID]: "Obs-A",
        [DataKeys.OBSERVATION_NAME]: "Observation A"
      },
      {
        [DataKeys.DATA_FILE_ID]: "F",
        [DataKeys.DATA_FILE_FILENAME]: "File F",
        [DataKeys.OBSERVATION_ID]: "Obs-A",
        [DataKeys.OBSERVATION_NAME]: "Observation A"
      }
    ]);
    expected.set("Obs-B", [
      {
        [DataKeys.DATA_FILE_ID]: "D",
        [DataKeys.DATA_FILE_FILENAME]: "File D",
        [DataKeys.OBSERVATION_ID]: "Obs-B",
        [DataKeys.OBSERVATION_NAME]: "Observation B"
      },
      {
        [DataKeys.DATA_FILE_ID]: "H",
        [DataKeys.DATA_FILE_FILENAME]: "File H",
        [DataKeys.OBSERVATION_ID]: "Obs-B",
        [DataKeys.OBSERVATION_NAME]: "Observation B"
      }
    ]);
    expected.set("Obs-C", [
      {
        [DataKeys.DATA_FILE_ID]: "G",
        [DataKeys.DATA_FILE_FILENAME]: "File G",
        [DataKeys.OBSERVATION_ID]: "Obs-C",
        [DataKeys.OBSERVATION_NAME]: "Observation C"
      }
    ]);
    expect(cart.groupByObservation()).toEqual(expected);
  });
});
