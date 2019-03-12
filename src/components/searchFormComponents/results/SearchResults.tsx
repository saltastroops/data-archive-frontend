import * as React from "react";
import { IFile, IObservation } from "../../../utils/ObservationQueryParameters";
import ImageModal from "./ImageModal";
import ObservationResults from "./Observation";
import SearchRow from "./SearchRow";
import TableHead from "./TableHead";

// I assume that each file will belong to one and only one observation and one file can be used in multiple observations

class SearchResults extends React.Component<
  { searchResults: IObservation[]; cart: any; updateCart: any },
  any
> {
  public state = {
    image: "",
    open: false
  };

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
  public addAll = (
    event: React.MouseEvent<HTMLElement>,
    observation: IObservation
  ) => {
    const { cart, updateCart } = this.props;
    const newCart = [
      ...cart.filter((item: IFile) => {
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
    observation: IObservation
  ) => {
    const { cart, updateCart } = this.props;
    const newCart = [
      ...cart.filter((item: IFile) => {
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
  public addFile = (
    event: React.ChangeEvent<HTMLInputElement>,
    file: IFile
  ) => {
    const { cart, updateCart } = this.props;
    if (event.target.checked) {
      updateCart([...cart, file]);
    } else {
      updateCart(
        cart.filter((item: IFile) => {
          if (item.name !== file.name) {
            return item;
          }
        })
      );
    }
  };

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  openModal = (url: string) => {
    this.setState({ open: true, image: url });
  };

  closeModal = () => {
    this.setState({ open: false, image: "" });
  };
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  public render() {
    const { searchResults, cart } = this.props;
    const { open, image } = this.state;
    return (
      <>
        {/* TODO see ImageModal for todo */}
        <ImageModal
          image={{ url: image || "./image0.jpg", alt: "Some text to show" }}
          closeModal={this.closeModal}
          open={open}
        />
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
            {searchResults.map((observation: IObservation) => {
              return (
                <>
                  {
                    <ObservationResults
                      observation={observation}
                      cart={cart}
                      addAll={this.addAll}
                      removeAll={this.removeAll}
                    />
                  }

                  <TableHead />
                  {observation.files.map((file: IFile) => {
                    return (
                      <SearchRow
                        key={file.name}
                        files={file}
                        addFile={this.addFile}
                        cart={cart}
                        openModal={this.openModal}
                      />
                    );
                  })}
                </>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }
}

export default SearchResults;
