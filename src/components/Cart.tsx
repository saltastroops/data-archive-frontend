import {
  faDownload,
  faEraser,
  faUserPlus,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import Modal from "react-responsive-modal";
import { NavLink } from "react-router-dom";
import CartFile from "./cart/CartFile";

interface ICart {
  open: boolean;
  openCart: (open: boolean) => void;
  clearCart: () => void;
  user?: any;
}

class Cart extends React.Component<ICart, any> {
  state: {
    cart: any[];
  } = {
    cart: []
  };
  public render() {
    const { open, openCart, clearCart, user } = this.props;
    const c: any = [
      {
        files: [
          {
            declination: "12",
            filename: "filename-1",
            name: "name-1",
            rightAscension: "66",
            size: "3kb",
            targetName: "NGS-1234",
            type: "science"
          },
          {
            declination: "12",
            filename: "filename-12",
            rightAscension: "66",
            size: "1mb",
            targetName: "NGS-1234",
            type: "acquisition"
          },
          {
            declination: "12",
            filename: "filename-13",
            name: "name-13",
            rightAscension: "66",
            targetName: "NGS-1234",
            type: "science"
          }
        ],
        id: "ID-1"
      },
      {
        files: [
          {
            declination: "14",
            filename: "filename-2",
            name: "name-2",
            rightAscension: "63",
            size: "8kb",
            targetName: "NGS-123",
            type: "science"
          },
          {
            declination: "14",
            filename: "filename-21",
            name: "name-21",
            rightAscension: "63",
            targetName: "NGS-123",
            type: "science"
          },
          {
            declination: "14",
            filename: "filename-22",
            name: "name-22",
            rightAscension: "63",
            size: "2mb",
            targetName: "NGS-123",
            type: "science"
          },
          {
            declination: "14",
            filename: "filename-23",
            name: "name-23",
            rightAscension: "63",
            size: "2mb",
            targetName: "NGS-123",
            type: "science"
          }
        ],
        id: "ID-2"
      },
      {
        files: [
          {
            declination: "34",
            filename: "filename-3",
            name: "name-3",
            rightAscension: "33",
            targetName: "NGS-323",
            type: "science"
          },
          {
            declination: "34",
            filename: "filename-31",
            name: "name-31",
            rightAscension: "33",
            size: "2mb",
            targetName: "NGS-123",
            type: "science"
          },
          {
            declination: "14",
            filename: "filename-32",
            name: "name-32",
            rightAscension: "33",
            size: "2mb",
            targetName: "NGS-133",
            type: "science"
          }
        ],
        id: "ID-3"
      },
      {
        files: [
          {
            declination: "144",
            filename: "filename-4",
            name: "name-4",
            rightAscension: "43",
            size: "3mb",
            targetName: "NG4-123",
            type: "science"
          },
          {
            declination: "44",
            filename: "filename-41",
            name: "name-41",
            rightAscension: "43",
            size: "3mb",
            targetName: "NGS-123",
            type: "flats"
          },
          {
            declination: "14",
            filename: "filename-42",
            name: "name-42",
            rightAscension: "4",
            targetName: "NGS-143",
            type: "science"
          },
          {
            declination: "14",
            filename: "filename-43",
            name: "name-43",
            rightAscension: "63",
            size: "3mb",
            targetName: "NG4-123",
            type: "flats"
          }
        ],
        id: "ID-4"
      },
      {
        files: [
          {
            declination: "34",
            filename: "filename-3",
            name: "name-3",
            rightAscension: "33",
            size: "3mb",
            targetName: "NGS-323",
            type: "science"
          },
          {
            declination: "34",
            filename: "filename-31",
            name: "name-31",
            rightAscension: "33",
            size: "3mb",
            targetName: "NGS-123",
            type: "biases"
          },
          {
            declination: "14",
            filename: "filename-32",
            name: "name-32",
            rightAscension: "33",
            targetName: "NGS-133",
            type: "biases"
          }
        ],
        id: "ID-6"
      }
    ];
    return (
      <Modal open={open} onClose={() => openCart(false)} center={true}>
        <div className={"section"}>
          <div className={"cart-table"}>
            <table
              className={
                "table is-striped  is-fullwidth is-outlined fixed-header"
              }
            >
              <thead>
                <tr className="notification cart-modal">
                  <th>Observation</th>
                  <th>Remove</th>
                  <th>Filename</th>
                  <th>Size</th>
                  <th>File Type</th>
                  <th>Right ascension</th>
                  <th>Declination</th>
                  <th>Target name</th>
                </tr>
              </thead>
              <tbody>
                {c.map((obz: any) => {
                  return (
                    <>
                      {obz.files.map((file: any, index: number) => (
                        <CartFile
                          observation={obz}
                          index={index}
                          id={obz.id}
                          key={file.filename}
                          file={file}
                        />
                      ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className={"section"}>
          <div className={"button-scales "}>
            <div className={"columns"}>
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
                  onClick={() => clearCart()}
                >
                  <span>
                    Clear <FontAwesomeIcon icon={faEraser} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Cart;
