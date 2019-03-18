import * as React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

/**
 * The navigation bar containing links to all pages, as well as a link for logging
 * out and a shopping cart icon.
 * Properties:
 * -----------
 * user : User
 * The currently logged in user. If the user is not logged in, a falsy value
 * must be passed.
 * logout : () => void
 * A function for logging out.
 *
 */

// TODO: replace user type with correct one
interface INavigationBarProps {
  user?:
    | {
        isAdmin: () => boolean;
        name: string;
        username: string;
      }
    | null
    | undefined; // currently logged in user
  logout: () => void; // logout function
}

interface INavigationBarState {
  isMenuActive: boolean;
}

const Nav = styled.nav.attrs({
  ariaLabel: "menu",
  className: "navbar is-full-width ",
  role: "button"
})``;

class NavigationBar extends React.Component<
  INavigationBarProps,
  INavigationBarState
> {
  public state = {
    isMenuActive: false
  };

  public render() {
    const activeTab = "has-text-weight-bold has-text-link";
    const { logout, user } = this.props;
    const { isMenuActive } = this.state;

    return (
      <div>
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
            className={`navbar-menu has-text-weight-light  ${
              isMenuActive ? "is-active" : ""
            }`}
          >
            <div className="navbar-start ">
              {/* Link to search page */}
              <NavLink
                className={`navbar-item item ${
                  this.isActiveTab("Search") ? activeTab : ""
                }`}
                to="/"
              >
                Search
              </NavLink>

              {/* Link to data requests page */}
              {user && (
                <NavLink
                  className={`navbar-item item ${this.isActiveTab(
                    "DataRequests"
                  ) && activeTab}`}
                  to="/data-requests"
                >
                  Data Requests
                </NavLink>
              )}

              {/* Link to admin page */}
              {user && user.isAdmin() && (
                <NavLink
                  className={`navbar-item ${this.isActiveTab("Admin") &&
                    activeTab}`}
                  to="/admin"
                >
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
                    <NavLink
                      className={`navbar-item ${this.isActiveTab("Account") &&
                        activeTab}`}
                      to="/account"
                    >
                      Account
                    </NavLink>

                    {/* Link for logging out */}
                    <NavLink
                      className="navbar-item"
                      data-test="logout"
                      onClick={logout}
                      to="/"
                    >
                      Logout
                    </NavLink>
                  </div>
                </div>
              )}

              {!user && (
                <>
                  <div className={"navbar-item"}>
                    {/* Button for logging in */}
                    <NavLink
                      className=" button is-primary is-outlined"
                      to="/login"
                    >
                      <span>
                        Login <i className="fas fa-sign-in-alt" />
                      </span>
                    </NavLink>
                  </div>
                  <div className={"navbar-item is-outlined"}>
                    {/* Button for registering */}
                    <NavLink
                      className="button is-info is-outlined"
                      to="/register"
                    >
                      <span>
                        Register <i className="fas fa-user-plus" />
                      </span>
                    </NavLink>
                  </div>
                </>
              )}

              {/* Cart icon */}
              <div className={"navbar-item is-hidden-descktop"}>
                <NavLink
                  className={` button is-link  ${
                    this.isActiveTab("Cart") ? "" : "is-outlined"
                  }`}
                  to="/cart"
                >
                  <span>
                    <i className={`fas fa-shopping-cart `} /> CART
                  </span>
                </NavLink>
              </div>
            </div>
          </div>
        </Nav>
        <hr className="navbar-divider" />
      </div>
    );
  }

  private toggleMenu = () => {
    this.setState(prevState => ({
      isMenuActive: !prevState.isMenuActive
    }));
  };

  private isActiveTab = (tab: string) => {
    const currentPath = window.location.pathname;

    if (currentPath === "/" && tab === "Search") {
      return true;
    }
    if (currentPath === "/cart" && tab === "Cart") {
      return true;
    }
    if (currentPath === "/account" && tab === "Account") {
      return true;
    }
    if (currentPath === "/admin" && tab === "Admin") {
      return true;
    }
    return currentPath === "/data-requests" && tab === "DataRequests";
  };
}

export default NavigationBar;
