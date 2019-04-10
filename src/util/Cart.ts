import gql from "graphql-tag";

/**
 * The cart of requested files.
 */
export class Cart {
  private cartFiles: ICartFile[];

  constructor(files: ICartFile[]) {
    this.cartFiles = files;
  }

  /**
   * The files in the cart.
   *
   * While this method returns the original array of files rather than a copy,
   * you are strongly discouraged from modifying it. Use the add abd remove
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
   * Check whether the cart contains the given file.
   *
   * Files are compared by their id. So if any cart file has the same id as the
   * given file, the function returns true, irrespective of any other key-value
   * pairs are equal.
   *
   * Parameters
   * ----------
   * file:
   *     The file whose existence in the cart is checked.
   *
   * Returns
   * -------
   * contains:
   *     Whether the cart contains the given file.
   */
  public contains(file: ICartFile) {
    return this.cartFiles.some(f => f.id === file.id);
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
    files.forEach(file => {
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
      file => !files.some(f => file.id === f.id)
    );
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
    const groups = new Map<string, Set<ICartFile>>();
    this.cartFiles.forEach(file => {
      const key = (file.observation && file.observation.id) || "";
      if (!groups.has(key)) {
        groups.set(key, new Set<ICartFile>());
      }
      (groups.get(key) as Set<ICartFile>).add(file);
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
 */
export interface ICartFile {
  id: string;
  name: string;
  observation?: IObservation | null;
}

/**
 * Interface for an observation to which a cart file is linked.
 *
 * Properties
 * ----------
 * id:
 *     Unique observation id.
 * name:
 *     Observation name.
 */

interface IObservation {
  id: string;
  name: string;
}

export const CART_QUERY = gql`
  query CART_QUERY {
    cart @client {
      id
      name
      observation
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
