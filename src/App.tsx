import "./App.css";
import * as React from "react";
import { Query } from "react-apollo";
import { Redirect, Route, Switch } from "react-router-dom";
import CartModal from "./components/CartModal";
import DataRequestsForm from "./components/dataRequest/DataRequestsForm";
import LoginForm, { ILoginFormCache } from "./components/LoginForm";
import NavigationBar from "./components/NavigationBar";
import RegistrationForm, {
  IRegistrationFormCache
} from "./components/RegistrationForm";
import ISearchFormCache from "./components/searchFormComponents/ISearchFormCache";
import SearchPage from "./components/searchFormComponents/SearchPage";
import UserUpdateForm, {
  IUserUpdateFormCache
} from "./components/UserUpdateForm";
import { USER_QUERY } from "./graphql/Query";

interface IUser {
  familyName: string;
  givenName: string;
  isAdmin: boolean;
}

interface IProtectedRouteProps {
  component: any;
  user: IUser | null | undefined;
  [propName: string]: any;
}

interface ICache {
  loginForm: ILoginFormCache;
  registrationForm: IRegistrationFormCache;
  searchForm: ISearchFormCache;
  userUpdateForm: IUserUpdateFormCache;
}

/**
 * A route which redirects to the login page if the user is not logged in.
 */
function ProtectedRoute({
  component: Component,
  user,
  ...rest
}: IProtectedRouteProps) {
  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

interface IAppState {
  user?: IUser;
  screenDimensions: { innerHeight: number; innerWidth: number };
}

/**
 * The data archive.
 */
class App extends React.Component<{}, IAppState> {
  state = {
    cart: { open: false },
    screenDimensions: {
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth
    },
    user: undefined
  };

  private cache: ICache = {
    loginForm: {},
    registrationForm: {},
    searchForm: {},
    userUpdateForm: {}
  };

  public render() {
    const { open } = this.state.cart;
    return (
      <Query query={USER_QUERY}>
        {({ data, loading }: any) => {
          if (loading) {
            return <p>Loading...</p>;
          }

          const currentUser =
            data && data.user
              ? {
                  familyName: data.user.familyName,
                  givenName: data.user.givenName,
                  isAdmin: data.user.roles.some(
                    (role: string) => role === "ADMIN"
                  )
                }
              : null;

          return (
            <>
              <NavigationBar user={currentUser} openCart={this.openCart} />
              <CartModal
                user={currentUser}
                open={open}
                openCart={this.openCart}
              />

              <Switch>
                {/* search page */}
                <Route
                  exact={true}
                  path="/"
                  render={() => (
                    <SearchPage
                      cache={this.cache.searchForm}
                      screenDimensions={this.state.screenDimensions}
                    />
                  )}
                />

                {/* registration page */}
                <Route
                  exact={true}
                  path="/register"
                  render={() => (
                    <RegistrationForm cache={this.cache.registrationForm} />
                  )}
                />

                {/* login page */}
                <Route
                  exact={true}
                  path="/login"
                  render={() => <LoginForm cache={this.cache.loginForm} />}
                />

                {/* account details page */}
                <ProtectedRoute
                  user={currentUser}
                  exact={true}
                  path="/account"
                  component={() => (
                    <h1 className="title">
                      {currentUser
                        ? `${currentUser.givenName} ${
                            currentUser.familyName
                          } Account`
                        : "No User"}
                    </h1>
                  )}
                />

                {/* data requests page */}
                <ProtectedRoute
                  user={currentUser}
                  exact={true}
                  path="/data-requests"
                  component={() => <DataRequestsForm />}
                />

                {/* admin page */}
                <ProtectedRoute
                  user={currentUser}
                  exact={true}
                  path="/admin"
                  component={() => <h1 className="title">Admin page</h1>}
                />

                {/* update user page */}
                <ProtectedRoute
                  user={currentUser}
                  exact={true}
                  path="/user-update"
                  component={() => (
                    <UserUpdateForm cache={this.cache.userUpdateForm} />
                  )}
                />

                {/* page not found */}
                <Route
                  component={() => <h1 className="title">Page not found</h1>}
                />
              </Switch>
            </>
          );
        }}
      </Query>
    );
  }
  public openCart = async (open: boolean) => {
    await this.setState(() => ({ ...this.state, cart: { open } }));
  };
}

export default App;
