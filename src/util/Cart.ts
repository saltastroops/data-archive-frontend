import gql from "graphql-tag";

/**
 * The cart of requested files.
 */
export class Cart {
  /**
   * Create a Cart instance from a JSON representation.
   *
   * Default values (an empty array for the files, true for the flag to include
   * calibrations) are used if a property isn't defined in the JSON string, or
   * if the string is falsy.
   */
  static fromJSON(json: string | null): Cart {
    let o: any;
    try {
      o = JSON.parse(json || "{}");
    } catch (e) {
      o = {};
    }

    const files = o.files || [];

    // default to true if the flag for including calibrations is not defined
    const includeStandards = o.includeStandards !== false;
    const includeArcsFlatsBiases = o.includeArcsFlatsBiases !== false;

    // By default reduced data is included
    const includedCalibrationLevels = new Set<CalibrationLevel>(
      o.includedCalibrationLevels || ["REDUCED"]
    );

    const cart = new Cart(
      files,
      includeStandards,
      includeArcsFlatsBiases,
      includedCalibrationLevels
    );

    return cart;
  }

  private cartFiles: ICartFile[];
  private includeStandardFiles: boolean;
  private includeArcsFlatsBiasesFiles: boolean;
  private includedCalibrationLevelsFiles: Set<CalibrationLevel>;

  constructor(
    files: ICartFile[],
    includeStandards: boolean,
    includeArcsFlatsBiases: boolean,
    includedCalibrationLevels: Set<CalibrationLevel>
  ) {
    this.cartFiles = files || [];

    this.includeStandardFiles = includeStandards;
    this.includeArcsFlatsBiasesFiles = includeArcsFlatsBiases;

    if (
      includedCalibrationLevels !== undefined &&
      includedCalibrationLevels !== null
    ) {
      this.includedCalibrationLevelsFiles = includedCalibrationLevels;
    } else {
      this.includedCalibrationLevelsFiles = new Set<CalibrationLevel>([
        "REDUCED",
      ]);
    }
  }

  /**
   * JSON representation of the cart content.
   *
   * The string returned by this method is intended to be used with the fromJSON
   * method.
   */
  public toJSON(): string {
    return JSON.stringify({
      files: this.files,
      includeArcsFlatsBiases: this.includeArcsFlatsBiases,
      includeStandards: this.includeStandards,
      includedCalibrationLevels: Array.from(this.includedCalibrationLevels),
    });
  }

  /**
   * The files in the cart.
   *
   * While this method returns the original array of files rather than a copy,
   * you are strongly discouraged from modifying it. Use the add and remove
   * methods instead.
   */
  public get files() {
    return this.cartFiles;
  }

  /**
   * The number of files in the cart.
   */
  public get size() {
    return this.cartFiles.length;
  }

  /**
   * Whether calibration levels should be included.
   */
  public get includedCalibrationLevels() {
    return this.includedCalibrationLevelsFiles;
  }

  /**
   * Set whether calibration levels should be included.
   */
  public set includedCalibrationLevels(
    includedCalibrationLevels: Set<CalibrationLevel>
  ) {
    this.includedCalibrationLevelsFiles = includedCalibrationLevels;
  }

  /**
   * Whether standards should be included.
   */
  public get includeStandards() {
    return this.includeStandardFiles;
  }

  /**
   * Set whether standards should be included.
   */
  public set includeStandards(includeStandards: boolean) {
    this.includeStandardFiles = includeStandards;
  }

  /**
   * Whether arcs, flats and biases should be included.
   */

  public get includeArcsFlatsBiases() {
    return this.includeArcsFlatsBiasesFiles;
  }

  /**
   * Set whether arcs, biases and Flats should be included.
   */
  public set includeArcsFlatsBiases(includeArcsFlatsBiases: boolean) {
    this.includeArcsFlatsBiasesFiles = includeArcsFlatsBiases;
  }

  /**
   * Check whether the cart contains a file.
   *
   * Files are compared by their id. So if any cart file has the same id as the
   * given file, the function returns true, irrespective of any other key-value
   *
   * Parameters
   * ----------
   * file
   *     The file whose existence in the cart is checked.
   *
   * Returns
   * -------
   * contains:
   *     Whether the cart contains the file with the given id.
   */
  public contains(file: ICartFile) {
    return this.cartFiles.some((f) => f.id === file.id);
  }

  /**
   * Adds files to the cart.
   *
   * A file in the given array is added only if it is not in the cart already.
   * The same logic as for the contains method is used to decide whether a file
   * is in the cart.
   *
   * @param files
   */
  public add(files: ICartFile[]) {
    files.forEach((file) => {
      if (!this.contains(file)) {
        this.cartFiles = [...this.cartFiles, file];
      }
    });
  }

  /**
   * Removes files from the cart.
   *
   * If a file in the given array is not in the cart already, it is just
   * ignored. The same logic as for the contains method is used to decide
   * whether a file is in the cart.
   *
   * @param files
   */
  public remove(files: ICartFile[]) {
    this.cartFiles = this.cartFiles.filter(
      (file) => !files.some((f) => file.id === f.id)
    );
  }

  /**
   * Removes all files from the cart.
   */
  public clear() {
    this.cartFiles = [];
  }

  /**
   * Returns the cart files grouped by observation.
   *
   * The files are returned as a map whose keys are the observation ids. Each
   * value is the set of files for the observation which have the corresponding
   * key as their id.
   *
   * Files which are not linked to an observation are collected in a set with
   * the empty string as its key.
   *
   * For example, consider a cart containing the files
   *
   * A_Obs1, B, C_Obs1, D_Obs2, E
   *
   * where A_Obs1 and C_Obs1 are linked to observation with id Obs1, D_Obs2 is
   * linked to an observation with id Obs2 and B and E are not linked to any
   * observation. Then this method returns a map with the following content.
   *
   * {
   *   '': new Set(B, E),
   *   'Obs1': new Set(A_Obs1, C_Obs1),
   *   'Obs2': new Set(D_Obs2)
   * }
   */
  public groupByObservation() {
    const groups = new Map<string, ICartFile[]>();
    this.cartFiles.forEach((file) => {
      const key = file.observation.id || "";
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      (groups.get(key) as ICartFile[]).push(file);
    });

    return groups;
  }
}

/**
 * Interface for a cart file.
 *
 * Properties
 * ----------
 * id:
 *     Unique file id.
 * name:
 *     File name.
 * observation:
 *     Observation to which the file is linked.
 * target:
 *     Target name.
 */
export interface ICartFile {
  id: string;
  name: string;
  observation: { id: string; name: string };
  target: string | null;
}

/**
 * The available calibration levels.
 */
export type CalibrationLevel = "REDUCED" | "RAW";

/**
 * The available calibration types
 */
export type CalibrationType =
  | "SPECTROPHOTOMETRIC_STANDARD"
  | "RADIAL_VELOCITY_STANDARD"
  | "ARC"
  | "FLAT"
  | "BIAS";

export const CART_QUERY = gql`
  query CART_QUERY {
    cart @client {
      files {
        id
        name
        observation
        target
      }
      includeStandards
      includeArcsFlatsBiases
      includedCalibrationLevels
    }
  }
`;

export const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($files: [CartFileInput!]!) {
    addToCart(files: $files) @client
  }
`;

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($files: [CartFileInput!]!) {
    removeFromCart(files: $files) @client
  }
`;

export const CLEAR_CART_MUTATION = gql`
  mutation CLEAR_CART_MUTATION {
    clearCart @client
  }
`;

export const INCLUDE_CALIBRATION_TYPES_IN_CART_MUTATION = gql`
  mutation INCLUDE_CALIBRATION_TYPES_IN_CART_MUTATION(
    $includeStandards: Boolean
    $includeArcsFlatsBiases: Boolean
  ) {
    includeCalibrationTypesInCart(
      includeStandards: $includeStandards
      includeArcsFlatsBiases: $includeArcsFlatsBiases
    ) @client
  }
`;

export const INCLUDE_CALIBRATION_LEVELS_IN_CART_MUTATION = gql`
  mutation INCLUDE_CALIBRATION_LEVELS_IN_CART_MUTATION(
    $includedCalibrationLevels: [CalibrationLevel]
  ) {
    includeCalibrationLevelsInCart(
      includedCalibrationLevels: $includedCalibrationLevels
    ) @client
  }
`;
