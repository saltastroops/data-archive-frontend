/**
 * The cart of requested files.
 */
export class Cart {
  constructor(private files: CartFile[]) {}

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
  public contains(file: CartFile) {
    return this.files.some(f => f.id === file.id);
  }

  /**
   * Adds or removes files from the cart.
   *
   * A file in the given array is added if it is not in the cart yet, and it is
   * removed if it is in the cart already. The same logic as for the contains
   * method is used to decide whether a file is in the cart.
   *
   * @param files
   */
  public addOrRemove(files: CartFile[]) {
    files.forEach(file => {
      const cartFilesFilesWithoutFile = this.files.filter(
        f => f.id !== file.id
      );
      if (cartFilesFilesWithoutFile.length !== this.files.length) {
        this.files = [...cartFilesFilesWithoutFile];
      } else {
        this.files = [...this.files, file];
      }
    });
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
    const groups = new Map<string, Set<CartFile>>();
    this.files.forEach(file => {
      const key = (file.observation && file.observation.id) || "";
      if (!groups.has(key)) {
        groups.set(key, new Set<CartFile>());
      }
      (groups.get(key) as Set<CartFile>).add(file);
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
export interface CartFile {
  id: string;
  name: string;
  observation?: Observation | null;
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
interface Observation {
  id: string;
  name: string;
}
