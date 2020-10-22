import DataKeys from "../../components/searchFormComponents/results/DataKeys";
import { Cart, ICartFile } from "../../util/Cart";

describe("Cart", () => {
  it("should have the correct size", () => {
    let cart = new Cart(
      [
        {
          id: "A",
          name: "File A",
          observation: { id: "Obs-A", name: "Observation A" },
        } as ICartFile,
        { id: "F", name: "File F" } as ICartFile,
      ],
      true
    );
    expect(cart.size).toBe(2);

    cart = new Cart(
      [
        { id: "A", name: "File A" } as ICartFile,
        { id: "B", name: "File B" } as ICartFile,
        {
          id: "C",
          name: "File C",
          observation: { id: "Obs-B", name: "Observation B" },
        } as ICartFile,
        { id: "D", name: "File D" } as ICartFile,
        {
          id: "E",
          name: "File E",
          observation: { id: "Obs-A", name: "Observation A" },
        } as ICartFile,
        { id: "F", name: "File F" } as ICartFile,
      ],
      true
    );
    expect(cart.size).toBe(6);
  });

  it("should return the correct files", () => {
    const files = [
      { id: "A", name: "File A" } as ICartFile,
      { id: "F", name: "File F" } as ICartFile,
    ];
    expect(new Cart(files, true).files).toBe(files);
  });

  it("should know what it contains", () => {
    const cart = new Cart(
      [
        { id: "A", name: "File A" } as ICartFile,
        { id: "F", name: "File F" } as ICartFile,
      ],
      true
    );

    expect(cart.contains({ id: "A" } as ICartFile)).toBe(true);
    expect(cart.contains({ id: "F" } as ICartFile)).toBe(true);
    expect(cart.contains({ id: "AA" } as ICartFile)).toBe(false);
    expect(cart.contains({ id: "B" } as ICartFile)).toBe(false);
    expect(cart.contains({} as ICartFile)).toBe(false);
  });

  it("should add files", () => {
    const cart = new Cart(
      [
        { id: "A", name: "File A" } as ICartFile,
        { id: "B", name: "File B" } as ICartFile,
        { id: "C", name: "File C" } as ICartFile,
        { id: "D", name: "File D" } as ICartFile,
        { id: "E", name: "File E" } as ICartFile,
        { id: "F", name: "File F" } as ICartFile,
      ],
      true
    );
    cart.add([
      { id: "A", name: "File A" } as ICartFile,
      { id: "Q", name: "File Q" } as ICartFile,
      { id: "D", name: "File D" } as ICartFile,
      { id: "R", name: "File R" } as ICartFile,
    ]);
    expect(cart.size).toBe(8);
    expect(cart.contains({ id: "A" } as ICartFile)).toBe(true);
    expect(cart.contains({ id: "B" } as ICartFile)).toBe(true);
    expect(cart.contains({ id: "C" } as ICartFile)).toBe(true);
    expect(cart.contains({ id: "D" } as ICartFile)).toBe(true);
    expect(cart.contains({ id: "E" } as ICartFile)).toBe(true);
    expect(cart.contains({ id: "F" } as ICartFile)).toBe(true);
    expect(cart.contains({ id: "Q" } as ICartFile)).toBe(true);
    expect(cart.contains({ id: "R" } as ICartFile)).toBe(true);
  });

  it("should remove files", () => {
    const cart = new Cart(
      [
        { id: "A", name: "File A" } as ICartFile,
        { id: "B", name: "File B" } as ICartFile,
        { id: "C", name: "File C" } as ICartFile,
        { id: "D", name: "File D" } as ICartFile,
        { id: "E", name: "File E" } as ICartFile,
        { id: "F", name: "File F" } as ICartFile,
      ],
      true
    );
    cart.remove([
      { id: "A", name: "File A" } as ICartFile,
      { id: "Q", name: "File Q" } as ICartFile,
      { id: "D", name: "File D" } as ICartFile,
      { id: "R", name: "File R" } as ICartFile,
    ]);
    expect(cart.size).toBe(4);
    expect(cart.contains({ id: "B" } as ICartFile)).toBe(true);
    expect(cart.contains({ id: "C" } as ICartFile)).toBe(true);
    expect(cart.contains({ id: "E" } as ICartFile)).toBe(true);
    expect(cart.contains({ id: "F" } as ICartFile)).toBe(true);
  });

  it("should clear the cart", () => {
    const cart = new Cart(
      [
        {
          id: "A",
          name: "File A",
          observation: { id: "Obs-A", name: "Observation A" },
        } as ICartFile,
        {
          id: "D",
          name: "File D",
          observation: { id: "Obs-B", name: "Observation B" },
        } as ICartFile,
        {
          id: "C",
          name: "File C",
          observation: { id: "Obs-D", name: " Observation D" },
        } as ICartFile,
      ],
      true
    );
    cart.clear();
    expect(cart.groupByObservation()).toEqual(new Map());
  });

  it("should provide cart items grouped by observation", () => {
    const cart = new Cart(
      [
        {
          id: "A",
          name: "File A",
          observation: { id: "Obs-A", name: "Observation A" },
        } as ICartFile,
        {
          id: "D",
          name: "File D",
          observation: { id: "Obs-B", name: "Observation B" },
        } as ICartFile,
        {
          id: "C",
          name: "File C",
          observation: { id: "Obs-D", name: " Observation D" },
        } as ICartFile,
        {
          id: "E",
          name: "File E",
          observation: { id: "Obs-A", name: "Observation A" },
        } as ICartFile,
        {
          id: "F",
          name: "File F",
          observation: { id: "Obs-A", name: "Observation A" },
        } as ICartFile,
        {
          id: "G",
          name: "File G",
          observation: { id: "Obs-C", name: "Observation C" },
        } as ICartFile,
        {
          id: "H",
          name: "File H",
          observation: { id: "Obs-B", name: "Observation B" },
        } as ICartFile,
      ],
      true
    );
    const expected = new Map<string, ICartFile[]>();
    expected.set("Obs-A", [
      {
        id: "A",
        name: "File A",
        observation: { id: "Obs-A", name: "Observation A" },
      } as ICartFile,
      {
        id: "E",
        name: "File E",
        observation: { id: "Obs-A", name: "Observation A" },
      } as ICartFile,
      {
        id: "F",
        name: "File F",
        observation: { id: "Obs-A", name: "Observation A" },
      } as ICartFile,
    ]);
    expected.set("Obs-B", [
      {
        id: "D",
        name: "File D",
        observation: { id: "Obs-B", name: "Observation B" },
      } as ICartFile,
      {
        id: "H",
        name: "File H",
        observation: { id: "Obs-B", name: "Observation B" },
      } as ICartFile,
    ]);
    expected.set("Obs-C", [
      {
        id: "G",
        name: "File G",
        observation: { id: "Obs-C", name: "Observation C" },
      } as ICartFile,
    ]);
    expected.set("Obs-D", [
      {
        id: "C",
        name: "File C",
        observation: { id: "Obs-D", name: " Observation D" },
      } as ICartFile,
    ]);
    expect(cart.groupByObservation()).toEqual(expected);
  });
});
