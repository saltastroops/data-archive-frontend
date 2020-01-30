import {
  faDownload,
  faEraser,
  faUserPlus,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Mutation } from "react-apollo";
import Modal from "react-responsive-modal";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { CREATE_DATA_REQUEST } from "../graphql/Mutations";
import { USER_DATA_REQUESTS_QUERY } from "../graphql/Query";
import cache from "../util/cache";
import {
  Cart,
  CART_QUERY,
  CLEAR_CART_MUTATION,
  ICartFile,
  INCLUDE_CALIBRATIONS_IN_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION
} from "../util/Cart";
import CartFileRow from "./cart/CartFileRow";

interface ICart {
  open: boolean;
  openCart: (open: boolean) => void;
  user?: any;
}

const LargeCheckbox = styled.input.attrs({
  className: "checkbox",
  type: "checkbox"
})`
  && {
    width: 18px;
    height: 18px;
  }
`;

const ErrorMessage = styled.p.attrs({
  className: "error tile"
})`
  && {
    text-align: left;
    margin: 3px 0 3px 0;
    padding: 2px 0 2px 0;
    background-color: hsl(348, 100%, 61%);
    color: white;
  }
`;

class CartModal extends React.Component<ICart, any> {
  render() {
    const { open, openCart, user } = this.props;

    // Get current cart content

    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        refetchQueries={[{ query: CART_QUERY }]}
      >
        {(removeFromCart: any) => (
          <Mutation
            mutation={INCLUDE_CALIBRATIONS_IN_CART_MUTATION}
            refetchQueries={[{ query: CART_QUERY }]}
          >
            {(includeCalibrations: any) => {
              const cartContent: any = cache.readQuery({
                query: CART_QUERY
              }) || {
                cart: { files: [], includeCalibrations: true }
              };
              const groupedCart: any = [];
              const cart = new Cart(
                cartContent.cart.files,
                cartContent.cart.includeCalibrations
              );
              cart.groupByObservation().forEach((v, k) => {
                groupedCart.push({
                  files: v,
                  id: k,
                  name: v[0].observation.name
                });
              });
              const dataFileIds = Array.from(cart.files).map(file =>
                parseInt(file.id, 10)
              );
              const includeCalibrationFiles = cart.includeCalibrations;

              const updateIncludeCalibrations = async (
                event: React.ChangeEvent<HTMLInputElement>
              ) => {
                includeCalibrations({
                  variables: { includeCalibrations: event.target.checked }
                });
              };

              return (
                <Mutation
                  mutation={CREATE_DATA_REQUEST}
                  refetchQueries={[
                    {
                      query: USER_DATA_REQUESTS_QUERY,
                      variables: {
                        limit: 5,
                        startIndex: 0
                      }
                    }
                  ]}
                >
                  {(createDataRequest: any, { error }: any) => (
                    <Mutation
                      mutation={CLEAR_CART_MUTATION}
                      refetchQueries={[{ query: CART_QUERY }]}
                    >
                      {(clearCart: any) => (
                        <Modal
                          open={open}
                          onClose={() => openCart(false)}
                          center={true}
                        >
                          <div className={"section"}>
                            {error ? (
                              <ErrorMessage>
                                {error.message
                                  .replace("Network error: ", "")
                                  .replace("GraphQL error: ", "")}
                              </ErrorMessage>
                            ) : null}
                            <div
                              className={
                                "table-container cart-table-scroll-vertically"
                              }
                            >
                              <table
                                className={
                                  "table is-fullwidth is-outlined is-bordered"
                                }
                              >
                                <thead>
                                  <tr>
                                    <th>Observation</th>
                                    <th>Remove</th>
                                    <th>Filename</th>
                                    <th>Target name</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {!groupedCart.length ? (
                                    <tr>
                                      <td colSpan={4} rowSpan={20}>
                                        <div
                                          className={
                                            "column is-center notification"
                                          }
                                        >
                                          <p
                                            className={
                                              "has-text-centered has-text-info is-size-3"
                                            }
                                          >
                                            The cart is empty.
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  ) : (
                                    groupedCart.map(
                                      (obz: any, obzIndex: number) => {
                                        return Array.from(
                                          obz.files
                                        ).map((file: any, index: number) => (
                                          <CartFileRow
                                            index={index}
                                            id={file.id}
                                            key={file.id}
                                            file={file}
                                            obzIndex={obzIndex}
                                            remove={this.remove}
                                            removeFromCart={removeFromCart}
                                          />
                                        ));
                                      }
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className={"section"}>
                            <div className="include-calibrations">
                              <label>
                                <LargeCheckbox
                                  checked={cart.includeCalibrations}
                                  onChange={updateIncludeCalibrations}
                                />{" "}
                                Include calibration files
                              </label>
                            </div>
                            <div className={"columns cart-buttons-section"}>
                              <div className={"column"}>
                                {!user ? (
                                  <NavLink to={"login"}>
                                    <button
                                      className={"button is-primary"}
                                      onClick={() => openCart(false)}
                                    >
                                      <span>
                                        Login{" "}
                                        <FontAwesomeIcon icon={faUserPlus} />
                                      </span>
                                    </button>
                                  </NavLink>
                                ) : (
                                  <NavLink to={"data-requests"}>
                                    <button
                                      className={"button is-primary"}
                                      onClick={() => {
                                        this.createDataRequest(
                                          createDataRequest,
                                          clearCart,
                                          dataFileIds,
                                          includeCalibrationFiles
                                        );
                                        if (!error) {
                                          openCart(false);
                                        }
                                      }}
                                    >
                                      <span>
                                        Request{" "}
                                        <FontAwesomeIcon icon={faDownload} />
                                      </span>
                                    </button>
                                  </NavLink>
                                )}
                              </div>
                              <div className={"column"}>
                                <button
                                  className={"button is-danger"}
                                  onClick={() => openCart(false)}
                                >
                                  <span>
                                    Close{" "}
                                    <FontAwesomeIcon icon={faWindowClose} />
                                  </span>
                                </button>
                              </div>
                              <div className={"column"}>
                                <button
                                  className={"button is-warning"}
                                  onClick={e =>
                                    this.remove(e, removeFromCart, cart.files)
                                  }
                                >
                                  <span>
                                    Clear <FontAwesomeIcon icon={faEraser} />
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </Modal>
                      )}
                    </Mutation>
                  )}
                </Mutation>
              );
            }}
          </Mutation>
        )}
      </Mutation>
    );
  }

  remove = async (
    event: React.MouseEvent,
    removeFromCart: any,
    files: ICartFile[]
  ) => {
    await removeFromCart({
      variables: {
        files
      }
    });
  };

  createDataRequest = async (
    create: any,
    clearCart: any,
    dataFilesIds: number[],
    includeCalibrations: boolean
  ) => {
    await create({
      variables: { dataFiles: dataFilesIds, includeCalibrations }
    });
    await clearCart();
  };
}

export default CartModal;
