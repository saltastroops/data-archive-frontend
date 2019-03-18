import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faSignInAlt,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

/**
 * The navigation bar containing links to all pages, as well as a link for
 * logging out and a link to the shopping cart.
 *
 * Properties:
 * -----------
 * user : User
 *     The currently logged in user. If the user is not logged in, a falsy value
 *     must be passed.
 * logout : () => void
 *     A function for logging out.
 */

// TODO: replace user type with correct one
interface INavigationBarProps {
  user?: {
    isAdmin: () => boolean;
    name: string;
    username: string;
  }; // currently logged in user
  logout: () => void; // logout function
}

interface INavigationBarState {
  isMenuActive: boolean;
}

const Nav = styled.nav.attrs({
  ariaLabel: "menu",
  className: "navbar is-light is-full-width"
})``;

class NavigationBar extends React.Component<
  INavigationBarProps,
  INavigationBarState
> {
  public state = {
    isMenuActive: false
  };

  public render() {
    const { logout, user } = this.props;
    const { isMenuActive } = this.state;

    return (
      <Nav>
        <div className="navbar-brand">
          {/* "Burger" for toggling the menu on a mobile device */}
          <a
            className={`navbar-burger burger ${
              isMenuActive ? "is-active" : ""
            }`}
            role="button"
            aria-label="menu"
            aria-expanded={isMenuActive ? "true" : "false"}
            onClick={this.toggleMenu}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>

        {/* Menu */}
        <div
          className={`navbar-menu title  ${isMenuActive ? "is-active" : ""}`}
        >
          <div className="navbar-start ">
            {/* Link to search page */}
            <NavLink className="navbar-item is-1" to="/">
              Search
            </NavLink>

            {/* Link to data requests page */}
            {user && (
              <NavLink className="navbar-item is-3" to="/data-requests">
                Data Requests
              </NavLink>
            )}

            {/* Link to admin page */}
            {user && user.isAdmin() && (
              <NavLink className="navbar-item is-3" to="/admin">
                Admin
              </NavLink>
            )}
          </div>
          <div className="navbar-end subtitle is-4">
            {/* Dropdown menu for account related content */}
            {user && (
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Hello {`${user.name}`}</a>

                <div className="navbar-dropdown">
                  {/* Link to page for editing account details */}
                  <NavLink className="navbar-item" to="/account">
                    Account
                  </NavLink>

                  {/* Link for logging out */}
                  <a
                    className="navbar-item"
                    data-test="logout"
                    onClick={logout}
                  >
                    Logout
                  </a>
                </div>
              </div>
            )}

            {!user && (
              <>
                <div className={"navbar-item"}>
                  {/* Link for logging in */}
                  <NavLink
                    className=" button is-primary  is-outlined"
                    to="/login"
                  >
                    <span>
                      Login <FontAwesomeIcon icon={faSignInAlt} />
                    </span>
                  </NavLink>
                </div>
                <div className={"navbar-item"}>
                  {/* Link for registering */}
                  <NavLink
                    className=" button is-info is-outlined"
                    to="/register"
                  >
                    <span>
                      Register <FontAwesomeIcon icon={faUserPlus} />
                    </span>
                  </NavLink>
                </div>
              </>
            )}

            {/* Cart icon */}
            <div className={"navbar-item is-hidden-descktop"}>
              <NavLink className=" button is-link" to="/cart">
                <span>
                  <FontAwesomeIcon icon={faShoppingCart} /> CART
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </Nav>
    );
  }

  private toggleMenu = () => {
    this.setState(prevState => ({
      isMenuActive: !prevState.isMenuActive
    }));
  };
}

export default NavigationBar;
