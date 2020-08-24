import {
  faDownload,
  faEraser,
  faUserPlus,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Mutation } from "react-apollo";
import Modal from "react-responsive-modal";
import fileDownload from "js-file-download";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { baseAxiosClient } from "../api";
import { CREATE_DATA_REQUEST } from "../graphql/Mutations";
import { USER_DATA_REQUESTS_QUERY } from "../graphql/Query";
import cache from "../util/cache";
import {
  CalibrationLevel,
  CalibrationType,
  Cart,
  CART_QUERY,
  CLEAR_CART_MUTATION,
  ICartFile,
  INCLUDE_CALIBRATION_LEVELS_IN_CART_MUTATION,
  INCLUDE_CALIBRATION_TYPES_IN_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
} from "../util/Cart";
import { HelpGrid } from "./basicComponents/Grids";
import HelpButton from "./basicComponents/HelpButton";
import CartFileRow from "./cart/CartFileRow";
import moment from "moment";

interface ICart {
  open: boolean;
  openCart: (open: boolean) => void;
  user?: any;
}

const LargeCheckbox = styled.input.attrs({
  className: "checkbox",
  type: "checkbox",
})`
  && {
    width: 18px;
    height: 18px;
  }
`;

const ErrorMessage = styled.p.attrs({
  className: "error tile",
})`
  && {
    text-align: left;
    margin: 3px 0 3px 0;
    padding: 2px 0 2px 0;
    background-color: hsl(348, 100%, 61%);
    color: white;
  }
`;

class CartModal extends React.Component<
  ICart,
  { error: string; requesting: boolean }
> {
  state = {
    error: "",
    requesting: false,
  };
  render() {
    const { open, openCart, user } = this.props;
    const { requesting } = this.state;

    // Get current cart content

    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        refetchQueries={[{ query: CART_QUERY }]}
      >
        {(removeFromCart: any) => (
          <Mutation
            mutation={INCLUDE_CALIBRATION_TYPES_IN_CART_MUTATION}
            refetchQueries={[{ query: CART_QUERY }]}
          >
            {(includeCalibrations: any) => {
              return (
                <Mutation
                  mutation={INCLUDE_CALIBRATION_LEVELS_IN_CART_MUTATION}
                  refetchQueries={[{ query: CART_QUERY }]}
                >
                  {(includeCalibrationLevels: any) => {
                    const cartContent: any = cache.readQuery({
                      query: CART_QUERY,
                    }) || {
                      cart: {
                        files: [],
                        includeArcsFlatsBiases: true,
                        includeStandards: true,
                        includedCalibrationLevels: new Set<CalibrationLevel>([
                          "REDUCED",
                        ]),
                      },
                    };

                    const groupedCart: any = [];
                    const cart = new Cart(
                      cartContent.cart.files,
                      cartContent.cart.includeStandards,
                      cartContent.cart.includeArcsFlatsBiases,
                      cartContent.cart.includedCalibrationLevels
                    );
                    cart.groupByObservation().forEach((v, k) => {
                      groupedCart.push({
                        files: v,
                        id: k,
                        name: v[0].observation.name,
                      });
                    });
                    const dataFileIds = Array.from(cart.files).map((file) =>
                      parseInt(file.id, 10)
                    );
                    const includeStandards = cart.includeStandards;
                    const includeArcsFlatsBiases = cart.includeArcsFlatsBiases;
                    const includedCalibrationLevels =
                      cart.includedCalibrationLevels;

                    const updateIncludeStandardCalibrations = async (
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      includeCalibrations({
                        variables: {
                          includeStandards: event.target.checked,
                        },
                      });
                    };

                    const updateIncludeArcsFlatsBiases = async (
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      includeCalibrations({
                        variables: {
                          includeArcsFlatsBiases: event.target.checked,
                        },
                      });
                    };

                    const updateIncludeReducedCalibrationLevel = async (
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      if (event.target.checked) {
                        cart.includedCalibrationLevels.add("REDUCED");
                      } else {
                        cart.includedCalibrationLevels.delete("REDUCED");
                      }

                      includeCalibrationLevels({
                        variables: {
                          includedCalibrationLevels:
                            cart.includedCalibrationLevels,
                        },
                      });
                    };

                    const updateIncludeRawCalibrationLevel = async (
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      if (event.target.checked) {
                        cart.includedCalibrationLevels.add("RAW");
                      } else {
                        cart.includedCalibrationLevels.delete("RAW");
                      }
                      includeCalibrationLevels({
                        variables: {
                          includedCalibrationLevels:
                            cart.includedCalibrationLevels,
                        },
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
                              startIndex: 0,
                            },
                          },
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
                                  {this.state && this.state.error ? (
                                    <ErrorMessage>
                                      {this.state.error}
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
                                              ).map(
                                                (file: any, index: number) => (
                                                  <CartFileRow
                                                    index={index}
                                                    id={file.id}
                                                    key={file.id}
                                                    file={file}
                                                    obzIndex={obzIndex}
                                                    remove={this.remove}
                                                    removeFromCart={
                                                      removeFromCart
                                                    }
                                                  />
                                                )
                                              );
                                            }
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div>
                                  <div className={"cart-heading"}>
                                    <label>Include</label>
                                  </div>
                                  <div
                                    className={
                                      "columns calibration-level-section"
                                    }
                                  >
                                    <div className="calibration-level">
                                      <label>
                                        <LargeCheckbox
                                          checked={cart.includeStandards}
                                          onChange={
                                            updateIncludeStandardCalibrations
                                          }
                                          name={"Standards"}
                                        />{" "}
                                        Standards
                                      </label>
                                      <HelpGrid>
                                        <HelpButton
                                          left={true}
                                          toolTipMessage={
                                            "Spectrophotometric and radial velocity standards are included. " +
                                            "In each case the standard taken nearest to the observation is used."
                                          }
                                        />
                                      </HelpGrid>
                                    </div>
                                    <div className="calibration-level">
                                      <label>
                                        <LargeCheckbox
                                          checked={cart.includeArcsFlatsBiases}
                                          onChange={
                                            updateIncludeArcsFlatsBiases
                                          }
                                          name={"ArcsFlatsBiases"}
                                        />{" "}
                                        Arcs/Flats/Biases
                                      </label>
                                      <HelpGrid>
                                        <HelpButton
                                          left={true}
                                          toolTipMessage={
                                            "Only calibrations taken as part of the observation are included."
                                          }
                                        />
                                      </HelpGrid>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      "columns calibration-level-section"
                                    }
                                  >
                                    <div className="calibration-level">
                                      <label>
                                        <LargeCheckbox
                                          checked={cart.includedCalibrationLevels.has(
                                            "REDUCED"
                                          )}
                                          onChange={
                                            updateIncludeReducedCalibrationLevel
                                          }
                                        />{" "}
                                        Reduced data
                                      </label>
                                    </div>
                                    <div className="calibration-level">
                                      <label>
                                        <LargeCheckbox
                                          checked={cart.includedCalibrationLevels.has(
                                            "RAW"
                                          )}
                                          onChange={
                                            updateIncludeRawCalibrationLevel
                                          }
                                        />{" "}
                                        Raw data
                                      </label>
                                    </div>
                                  </div>

                                  <div
                                    className={"columns cart-buttons-section"}
                                  >
                                    <div className={"column"}>
                                      {!user ? (
                                        <NavLink to={"login"}>
                                          <button
                                            className={"button is-primary"}
                                            disabled={requesting}
                                            onClick={() => openCart(false)}
                                          >
                                            <span>
                                              Login{" "}
                                              <FontAwesomeIcon
                                                icon={faUserPlus}
                                              />
                                            </span>
                                          </button>
                                        </NavLink>
                                      ) : (
                                        <button
                                          className={"button is-primary"}
                                          disabled={requesting}
                                          onClick={() => {
                                            this.downloadDataRequest(
                                              createDataRequest,
                                              clearCart,
                                              dataFileIds,
                                              includeStandards,
                                              includeArcsFlatsBiases,
                                              includedCalibrationLevels,
                                              openCart
                                            );
                                            if (
                                              !error &&
                                              this.isCalibrationLevelIncluded(
                                                cart.includedCalibrationLevels
                                              )
                                            ) {
                                              openCart(false);
                                            }
                                          }}
                                        >
                                          <span>
                                            Download data request{" "}
                                            <FontAwesomeIcon
                                              icon={faDownload}
                                            />
                                          </span>
                                        </button>
                                      )}
                                    </div>
                                    <div className={"column"}>
                                      <button
                                        className={"button is-danger"}
                                        disabled={requesting}
                                        onClick={() => openCart(false)}
                                      >
                                        <span>
                                          Close{" "}
                                          <FontAwesomeIcon
                                            icon={faWindowClose}
                                          />
                                        </span>
                                      </button>
                                    </div>
                                    <div className={"column"}>
                                      <button
                                        className={"button is-warning"}
                                        disabled={requesting}
                                        onClick={(e) =>
                                          this.remove(
                                            e,
                                            removeFromCart,
                                            cart.files
                                          )
                                        }
                                      >
                                        <span>
                                          Clear{" "}
                                          <FontAwesomeIcon icon={faEraser} />
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                  {requesting && (
                                    <div className={"notification is-warning"}>
                                      <p>
                                        Please wait while while your data
                                        request is being processed your download
                                        will start soon.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </Modal>
                            )}
                          </Mutation>
                        )}
                      </Mutation>
                    );
                  }}
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
        files,
      },
    });
  };

  downloadDataRequest = async (
    create: any,
    clearCart: any,
    dataFilesIds: number[],
    includeStandards: boolean,
    includeArcsFlatsBiases: boolean,
    includedCalibrationLevels: Set<CalibrationLevel>,
    openCart: (open: boolean) => void
  ) => {
    // If there is no data file in the data request, raise an error and abort data request creation
    if (!this.isDatafileIncluded(dataFilesIds)) {
      this.setState({
        error:
          "Please make sure that there is at least one file in your data request.",
      });
      return;
    }

    // If either reduced nor raw checkbox is selected, raise an error and abort data request creation
    if (!this.isCalibrationLevelIncluded(includedCalibrationLevels)) {
      this.setState({
        error: "Please make sure reduced or raw data is selected.",
      });
      return;
    }

    this.setState({
      error: "",
      requesting: true,
    });

    const calibrationTypes: CalibrationType[] = [];

    if (includeStandards) {
      calibrationTypes.push(
        "SPECTROPHOTOMETRIC_STANDARD",
        "RADIAL_VELOCITY_STANDARD"
      );
    }

    if (includeArcsFlatsBiases) {
      calibrationTypes.push("ARC", "FLAT", "BIAS");
    }
    const dr = await create({
      variables: {
        dataFiles: dataFilesIds,
        includedCalibrationLevels: Array.from(includedCalibrationLevels),
        includedCalibrationTypes: calibrationTypes,
      },
    });
    let response;
    if (dr.data.createDataRequest.status) {
      const id = dr.data.createDataRequest.dataRequestId;
      const zipUrl = `${
        process.env.REACT_APP_BACKEND_URI
          ? process.env.REACT_APP_BACKEND_URI.replace(/\/+$/, "")
          : ""
      }/downloads/data-requests/${id}`;
      response = await baseAxiosClient().get(zipUrl, {
        responseType: "blob",
      });
      fileDownload(
        response.data,
        `ssda-data-request-${moment().format("Y-MM-DD")}.zip`
      );
      this.setState({ requesting: false });
      openCart(false);
      await clearCart();
    }
  };

  // Check if one of the calibration levels, reduced or raw, is included.
  isCalibrationLevelIncluded(includedCalibrationLevels: Set<CalibrationLevel>) {
    return includedCalibrationLevels.size > 0;
  }

  // Check if there is at least one data file id in the request
  isDatafileIncluded(dataFileIds: number[]) {
    return dataFileIds.length > 0;
  }
}

export default CartModal;
