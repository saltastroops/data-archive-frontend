import {
  faDownload,
  faEraser,
  faUserPlus,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Mutation, Query } from "react-apollo";
import Modal from "react-responsive-modal";
import { NavLink, Redirect } from "react-router-dom";
import {
  Cart,
  CART_QUERY,
  ICartFile,
  REMOVE_FROM_CART_MUTATION
} from "../util/Cart";
import CartFile from "./cart/CartFile";

interface ICart {
  open: boolean;
  openCart: (open: boolean) => void;
  user?: any;
}

class CartModal extends React.Component<ICart, any> {
  state: {
    cart: any[];
  } = {
    cart: window.localStorage.getItem("cart")
      ? JSON.parse(window.localStorage.cart)
      : []
  };

  clearCart = async (
    e: React.MouseEvent<HTMLElement>,
    removeFromCart: any,
    files: ICartFile[]
  ) => {
    await removeFromCart({
      variables: {
        files
      }
    });
    return <Redirect to={"/"} />;
  };
  // removeFromCart = (event: any, file: ICartFile) => {
  //   console.log("Called");

  //   new Cart(this.state.cart).remove([file])
  // }

  render() {
    const { open, openCart, user } = this.props;
    const groupedCart: any = [];

    return (
      <Query query={CART_QUERY} variables={{ name: "name" }}>
        {({ data, loading }: any) => (
          <Mutation
            mutation={REMOVE_FROM_CART_MUTATION}
            refetchQueries={[{ query: CART_QUERY }]}
          >
            {(removeFromCart: any) => {
              if (loading) {
                return <div>Loading...</div>;
              }
              (new Cart(data.cart || []) || [])
                .groupByObservation()
                .forEach((v, k) => {
                  groupedCart.push({ files: v, id: k });
                });
              return (
                <Modal
                  open={open}
                  onClose={() => openCart(false)}
                  center={true}
                >
                  <div className={"section"}>
                    <div className={"cart-table"}>
                      <table
                        className={
                          "table is-striped  is-fullwidth is-outlined fixed-header"
                        }
                      >
                        <thead>
                          <tr className="notification cart-modal">
                            <th className="fixed-header-rest">Observation</th>
                            <th className="fixed-header-button">Remove</th>
                            <th className="fixed-header-rest">Filename</th>
                            <th className="fixed-header-rest">Target name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedCart.map((obz: any) => {
                            return (
                              <tr key={obz.id}>
                                {Array.from(obz.files).map(
                                  (file: any, index: number) => (
                                    <CartFile
                                      observation={obz}
                                      index={index}
                                      id={file.id}
                                      key={file.id}
                                      file={file}
                                      remove={this.remove}
                                      removeFromCart={removeFromCart}
                                    />
                                  )
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className={"section"}>
                    <div className={"columns cart-buttons-section"}>
                      <div className={"column"}>
                        {!user ? (
                          <NavLink to={"login"}>
                            <button
                              className={"button is-primary"}
                              onClick={() => openCart(false)}
                            >
                              <span>
                                Login <FontAwesomeIcon icon={faUserPlus} />
                              </span>
                            </button>
                          </NavLink>
                        ) : (
                          <NavLink to={"data-requests"}>
                            <button
                              className={"button is-primary"}
                              onClick={() => openCart(false)}
                            >
                              <span>
                                Request <FontAwesomeIcon icon={faDownload} />
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
                            Close <FontAwesomeIcon icon={faWindowClose} />
                          </span>
                        </button>
                      </div>
                      <div className={"column"}>
                        <button
                          className={"button is-warning"}
                          onClick={e =>
                            this.clearCart(e, removeFromCart, data.cart)
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
              );
            }}
          </Mutation>
        )}
      </Query>
    );
  }

  remove = async (
    event: React.MouseEvent,
    removeFromCart: any,
    file: ICartFile
  ) => {
    await removeFromCart({
      variables: {
        files: [file]
      }
    });
  };
}

export default CartModal;
