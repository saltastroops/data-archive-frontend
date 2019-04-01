import { Cart, CartFile } from "../../util/Cart";

describe("Cart", () => {
  it("should know what it contains", () => {
    const cart = new Cart([
      { id: "A", name: "File A" },
      { id: "F", name: "File F" }
    ]);

    expect(cart.contains({ id: "A", name: "File A" })).toBe(true);
    expect(cart.contains({ id: "F", name: "File A" })).toBe(true);
    expect(cart.contains({ id: "AA", name: "File AA" })).toBe(false);
    expect(cart.contains({ id: "B", name: "File B" })).toBe(false);
    expect(cart.contains({ id: "", name: "File" })).toBe(false);
  });

  it("should add and remove files", () => {
    const cart = new Cart([
      { id: "A", name: "File A" },
      { id: "B", name: "File B" },
      { id: "C", name: "File C" },
      { id: "D", name: "File D" },
      { id: "E", name: "File E" },
      { id: "F", name: "File F" }
    ]);
    cart.addOrRemove([
      { id: "A", name: "File A" },
      { id: "Q", name: "File Q" },
      { id: "D", name: "File D" },
      { id: "R", name: "File R" }
    ]);
    expect(cart.contains({ id: "A", name: "File A" })).toBe(false);
    expect(cart.contains({ id: "B", name: "File B" })).toBe(true);
    expect(cart.contains({ id: "C", name: "File C" })).toBe(true);
    expect(cart.contains({ id: "D", name: "File D" })).toBe(false);
    expect(cart.contains({ id: "E", name: "File E" })).toBe(true);
    expect(cart.contains({ id: "F", name: "File F" })).toBe(true);
    expect(cart.contains({ id: "Q", name: "File Q" })).toBe(true);
    expect(cart.contains({ id: "R", name: "File R" })).toBe(true);
  });

  it("should provide cart items grouped by observation", () => {
    const cart = new Cart([
      {
        id: "A",
        name: "File A",
        observation: { id: "Obs-A", name: "Observation A" }
      },
      { id: "B", name: "File B" },
      { id: "C", name: "File C" },
      {
        id: "D",
        name: "File D",
        observation: { id: "Obs-B", name: "Observation B" }
      },
      {
        id: "E",
        name: "File E",
        observation: { id: "Obs-A", name: "Observation A" }
      },
      {
        id: "F",
        name: "File F",
        observation: { id: "Obs-A", name: "Observation A" }
      },
      {
        id: "G",
        name: "File G",
        observation: { id: "Obs-C", name: "Observation C" }
      },
      {
        id: "H",
        name: "File H",
        observation: { id: "Obs-B", name: "Observation B" }
      },
      { id: "I", name: "File I" }
    ]);
    const expected = new Map<String, Set<CartFile>>();
    expected.set(
      "",
      new Set<CartFile>([
        { id: "B", name: "File B" },
        { id: "C", name: "File C" },
        { id: "I", name: "File I" }
      ])
    );
    expected.set(
      "Obs-A",
      new Set<CartFile>([
        {
          id: "A",
          name: "File A",
          observation: { id: "Obs-A", name: "Observation A" }
        },
        {
          id: "E",
          name: "File E",
          observation: { id: "Obs-A", name: "Observation A" }
        },
        {
          id: "F",
          name: "File F",
          observation: { id: "Obs-A", name: "Observation A" }
        }
      ])
    );
    expected.set(
      "Obs-B",
      new Set<CartFile>([
        {
          id: "D",
          name: "File D",
          observation: { id: "Obs-B", name: "Observation B" }
        },
        {
          id: "H",
          name: "File H",
          observation: { id: "Obs-B", name: "Observation B" }
        }
      ])
    );
    expected.set(
      "Obs-C",
      new Set<CartFile>([
        {
          id: "G",
          name: "File G",
          observation: { id: "Obs-C", name: "Observation C" }
        }
      ])
    );
    expect(cart.groupByObservation()).toEqual(expected);
  });
});
