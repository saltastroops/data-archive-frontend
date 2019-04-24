import {
  faShoppingCart,
  faSignInAlt,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as React from "react";
import { Mutation } from "react-apollo";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { LOGOUT_MUTATION } from "../graphql/Mutations";
import { USER_QUERY } from "../graphql/Query";

/**
 * The navigation bar containing links to all pages, as well as a link for
 * logging out and a link to the shopping cart.
 *
 * Properties:
 * -----------
 * user : User
 *     The currently logged in user. If the user is not logged in, a falsy value
 *     must be passed.
 */
interface INavigationBarProps {
  user?: {
    familyName: string;
    givenName: string;
    isAdmin: boolean;
  } | null; // currently logged in user,
  cache?: INavigationBarCache;
}

/**
 * The cache for the navigation bar.
 *
 * The errors are cached.
 */
interface INavigationBarCache {
  errors?: { responseError?: string };
}

interface INavigationBarState {
  isMenuActive: boolean;
  errors: { responseError?: string };
}

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

const Nav = styled.nav.attrs({
  ariaLabel: "menu",
  className: "navbar is-full-width "
})``;

class NavigationBar extends React.Component<
  INavigationBarProps,
  INavigationBarState
> {
  public state = {
    errors: { responseError: "" },
    isMenuActive: false
  };

  logout = async (logout: any) => {
    try {
      await logout();
      this.updateState({
        errors: {
          responseError: ""
        }
      });
    } catch (error) {
      this.updateState({
        errors: {
          responseError: "Something went wrong trying to logout."
        }
      });
    }
  };

  public render() {
    // classes for highlighting a link to nan active tab
    const activeTab = "has-text-weight-bold has-text-link";

    const { user } = this.props;
    const { errors, isMenuActive } = this.state;

    return (
      <Mutation
        mutation={LOGOUT_MUTATION}
        refetchQueries={[{ query: USER_QUERY }]}
      >
        {userLogout => {
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
                      activeClassName={activeTab}
                      className="navbar-item item"
                      exact={true}
                      to="/"
                    >
                      Search
                    </NavLink>

                    {/* Link to data requests page */}
                    {user && (
                      <NavLink
                        activeClassName={activeTab}
                        className="navbar-item item"
                        to="/data-requests"
                      >
                        Data Requests
                      </NavLink>
                    )}

                    {/* Link to admin page */}
                    {user && user.isAdmin && (
                      <NavLink
                        activeClassName={activeTab}
                        className="navbar-item"
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
                        <a className="navbar-link">
                          Hello {`${user.givenName}`}
                        </a>

                        <div className="navbar-dropdown">
                          {/* Link to page for editing account details */}
                          <NavLink
                            activeClassName={activeTab}
                            className="navbar-item"
                            to="/account"
                          >
                            Account
                          </NavLink>

                          {/* Link for logging out */}
                          <NavLink
                            className="navbar-item"
                            data-test="logout"
                            onClick={() => this.logout(userLogout)}
                            to="/"
                          >
                            Logout
                          </NavLink>
                        </div>
                      </div>
                    )}

                    {!user && (
                      <>
                        {/* Link for logging in */}
                        <div className={"navbar-item"}>
                          <NavLink
                            className=" button is-primary is-outlined"
                            to="/login"
                          >
                            <span>
                              Login <FontAwesomeIcon icon={faSignInAlt} />
                            </span>
                          </NavLink>
                        </div>

                        {/* Link for registering */}
                        <div className={"navbar-item"}>
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
                      <NavLink
                        className="button is-link is-outlined"
                        to="/cart"
                      >
                        <span>
                          <FontAwesomeIcon icon={faShoppingCart} /> CART
                        </span>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </Nav>
              <hr className="navbar-divider" />
              {errors.responseError ? (
                <ErrorMessage>{errors.responseError}</ErrorMessage>
              ) : null}
            </div>
          );
        }}
      </Mutation>
    );
  }

  private toggleMenu = () => {
    this.setState(prevState => ({
      isMenuActive: !prevState.isMenuActive
    }));
  };

  /**
   * Update the form state and the cache.
   */
  private updateState = (update: object) => {
    this.setState(
      () => update,
      () => {
        if (this.props.cache) {
          this.props.cache.errors = _.cloneDeep(this.state.errors);
        }
      }
    );
  };
}

export default NavigationBar;
