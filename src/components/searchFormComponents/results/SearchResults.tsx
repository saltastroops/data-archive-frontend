import * as React from "react";
import ObservationResults from "./Observation";
import SearchRow from "./SearchRow";
import TableHead from "./TableHead";

// I assume that each file will belong to one and only one observation and one file can be used in multiple observations

class SearchResults extends React.Component<
  { searchResults: any; cart: any; updateCart: any },
  any
> {
  /**
   * It adds all the of the files belonging to an observation
   *
   * @param event
   *      Button click event
   * @param observation
   *      Result from the observation query
   *
   * @return void
   */
  public addAll = (event: React.MouseEvent<HTMLElement>, observation: any) => {
    const { cart, updateCart } = this.props;
    const newCart = [
      ...cart.filter((item: any) => {
        return !observation.files.includes(item); // removing any file from the cart that might belong to this observation to avoid duplication
      }),
      ...observation.files // adding all the files from this observation
    ];
    updateCart(newCart);
  };
  /**
   * Removes all the files from the cart that belong to this observation
   *
   * @param event
   *      Button click event
   * @param observation
   *      Result from the observation query
   *
   * @return void
   */
  public removeAll = (
    event: React.MouseEvent<HTMLElement>,
    observation: any
  ) => {
    const { cart, updateCart } = this.props;
    const newCart = [
      ...cart.filter((item: any) => {
        return !observation.files.includes(item); // removing any file from the cart that belong to this observation
      })
    ];
    updateCart(newCart);
  };

  /**
   * Add or remove file from cart if checkbox is active file is added, else removed.
   *
   * @param event
   *      Checkbox change event
   * @param file
   *      File to add to cart
   * @return void
   */
  public addFile = (event: React.ChangeEvent<HTMLInputElement>, file: any) => {
    const { cart, updateCart } = this.props;
    if (event.target.checked) {
      updateCart([...cart, file]);
    } else {
      updateCart(
        cart.filter((item: any) => {
          if (item.name !== file.name) {
            return item;
          }
        })
      );
    }
  };
  public render() {
    const { searchResults, cart } = this.props;
    console.log("Search state", this.props);
    return (
      <table className={"table"}>
        <tbody>
          <tr className="notification">
            <th colSpan={3}>Name</th>
            <th colSpan={2}>Proposal</th>
            <th colSpan={2}>Telescope</th>
            <th colSpan={2}>Start time</th>
            <td />
            <td />
          </tr>
          {searchResults.map((r: any) => {
            return (
              <>
                {
                  <ObservationResults
                    observation={r}
                    cart={cart}
                    addAll={this.addAll}
                    removeAll={this.removeAll}
                  />
                }

                <TableHead />
                {r.files.map((f: any) => {
                  return (
                    <SearchRow
                      key={f.name}
                      files={f}
                      addFile={this.addFile}
                      cart={cart}
                    />
                  );
                })}
              </>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default SearchResults;
