import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";
import { IFile, IObservation } from "../../../utils/ObservationQueryParameters";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";
import ImageModal from "./ImageModal";
import SearchResultsTableRow from "./SearchResultsTableRow";
import { ApolloConsumer, Mutation, Query } from "react-apollo";
import {
  Cart,
  ADD_TO_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  CART_QUERY
} from "../../../util/Cart";
import { cache } from "../../../";

// I assume that each file will belong to one and only one observation and one file can be used in multiple observations

const Span = styled.span.attrs({
  className: "span"
})`
  && {
    font-weight: bold;
    padding-right: 10px;
  }
`;

interface ISearchResultsTableProps {
  searchResults: IObservation[];
}

interface ISearchResultsTableState {
  image: string;
  open: boolean;
}

/**
 * The table of search results.
 */
class SearchResultsTable extends React.Component<
  ISearchResultsTableProps,
  ISearchResultsTableState
> {
  public state = {
    image: "",
    open: false
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
    const { searchResults } = this.props;
    const { open, image } = this.state;
    return (
      <>
        {/* TODO see ImageModal for todo */}
        <ImageModal
          image={{ url: image, alt: "Some text to show" }}
          closeModal={this.closeModal}
          open={open}
        />
        <Mutation
          mutation={ADD_TO_CART_MUTATION}
          refetchQueries={[{ query: CART_QUERY }]}
        >
          {addToCart => (
            <Mutation
              mutation={REMOVE_FROM_CART_MUTATION}
              refetchQueries={[{ query: CART_QUERY }]}
            >
              {removeFromCart => (
                <table className={"table is-fullwidth is-striped"}>
                  {searchResults.map((observation: IObservation) => {
                    return (
                      <ObservationSearchResultsTableBody
                        addToCart={addToCart}
                        key={observation.id}
                        observation={observation}
                        openModal={this.openModal}
                        removeFromCart={removeFromCart}
                      />
                    );
                  })}
                </table>
              )}
            </Mutation>
          )}
        </Mutation>
      </>
    );
  }
}

interface IObservationSearchResultsTableBodyProps {
  addToCart: Function;
  observation: IObservation;
  openModal: Function;
  removeFromCart: Function;
}

interface IObservationSearchResultsTableBodyState {
  cart: Cart;
  loading: boolean;
}

class ObservationSearchResultsTableBody extends React.Component<
  IObservationSearchResultsTableBodyProps,
  IObservationSearchResultsTableBodyState
> {
  /**
   * Update the cart for the files linked to an observation. The files are
   * added if the event target is checked; otherwise they are removed.
   */
  private updateCartForObservation = async (
    event: React.ChangeEvent<HTMLInputElement>,
    observation: IObservation,
    addToCart: Function,
    removeFromCart: Function
  ) => {
    this.setState({ loading: true });
    const files = observation.files.map(f => ({
      id: f.id,
      name: f.name,
      observation: {
        id: observation.id,
        name: observation.name,
        __typename: "CartObservation"
      },
      __typename: "CartFile"
    }));
    if (event.target.checked) {
      await addToCart({ variables: { files } });
    } else {
      await removeFromCart({ variables: { files } });
    }

    this.updateState();
    this.setState({ loading: false });
    console.log("DONE");
  };

  private updateState = () => {
    // Get current cart content
    const cartContent: any = cache.readQuery({ query: CART_QUERY }) || {
      cart: []
    };
    const cart = new Cart(cartContent.cart);

    this.setState(() => ({ cart }));
  };

  constructor(props: IObservationSearchResultsTableBodyProps) {
    super(props);

    // Get current cart content
    const cartContent: any = cache.readQuery({ query: CART_QUERY }) || {
      cart: []
    };
    const cart = new Cart(cartContent.cart);

    this.state = { cart, loading: false };
  }

  render() {
    const { addToCart, observation, openModal, removeFromCart } = this.props;
    return (
      <tbody key={observation.id}>
        {/* main header for the observation */}
        <tr className="is-selected span">
          <td>
            <label>
              <Span>
                <LargeCheckbox
                  id={`Add-all-${observation.id}`}
                  disabled={this.state.loading}
                  checked={this.props.observation.files.every(f =>
                    this.state.cart.contains(f)
                  )}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.updateCartForObservation(
                      e,
                      observation,
                      addToCart,
                      removeFromCart
                    )
                  }
                />
              </Span>
              <Span className={"span"}>
                <FontAwesomeIcon icon={faShoppingCart} />
              </Span>
            </label>
          </td>
          <td colSpan={3}>
            <span>Observation: {observation.name}</span>
          </td>
          <td colSpan={2}>
            <span>Telescope: {observation.telescope}</span>
          </td>
          <td colSpan={2}>
            <span>Proposal: {observation.proposal}</span>
          </td>
          <td colSpan={2}>
            <span>Stat time: {observation.startTime}</span>
          </td>
        </tr>

        {/* sub header for the observation */}
        <tr>
          <th>In cart</th>
          <th>Filename</th>
          <th>Name</th>
          <th>Data type</th>
          <th>Raw/reduced</th>
          <th>Target name</th>
          <th>Right ascension</th>
          <th>Declination</th>
          <th>Category</th>
          <th>Instrument</th>
        </tr>

        {/* the search results */}
        {observation.files.map((file: IFile) => {
          return (
            <SearchResultsTableRow
              key={file.name}
              files={file}
              openModal={openModal}
            />
          );
        })}
      </tbody>
    );
  }
}

export default SearchResultsTable;
