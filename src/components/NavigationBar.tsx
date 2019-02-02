import * as React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

/*

The navigation bar containing links to all pages, as well as a link for logging
out and a shopping cart icon.

Properties:
-----------
user : User
    The currently logged in user. If the user is not logged in, a falsy value
    must be passed.
logout : () => void
    A function for logging out.

*/

// TODO: replace user type with correct one
interface INavigationBarProps {
  user: { isAdmin: () => boolean } | null | undefined; // currently logged in user
  logout: () => void; // logout function
}

interface INavigationBarState {
  isMenuActive: boolean;
}

const Nav = styled.nav.attrs({ className: "navbar" })``;

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
        <div className={`navbar-menu ${isMenuActive ? "is-active" : ""}`}>
          <div className="navbar-start">
            {/* Link to search page */}
            <NavLink className="navbar-item" to="/">
              Search
            </NavLink>

            {/* Link to data requests page */}
            {user && (
              <NavLink className="navbar-item" to="/data-requests">
                Data Requests
              </NavLink>
            )}

            {/* Link to admin page */}
            {user && user.isAdmin() && (
              <NavLink className="navbar-item" to="/admin">
                Admin
              </NavLink>
            )}
          </div>
          <div className="navbar-end">
            {/* Dropdown menu for account related content */}
            {user && (
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Hello User</a>

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
                {/* Button for logging in */}
                <NavLink className="navbar-item button is-primary" to="/login">
                  <strong>Login</strong>
                </NavLink>
                ( /* Button for registering */ }
                <NavLink
                  className="navbar-item button is-outlined"
                  to="/register"
                >
                  Register
                </NavLink>
              </>
            )}

            {/* Cart icon */}
            <span className="navbar-item">CART</span>
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
