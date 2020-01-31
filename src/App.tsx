import * as React from "react";
import { Query } from "react-apollo";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import { Spinner } from "./components/basicComponents/Grids";
import CartModal from "./components/CartModal";
import DataRequestsForm from "./components/dataRequest/DataRequestsForm";
import JS9View, { JS9ViewContext } from "./components/JS9View";
import LoginForm, { ILoginFormCache } from "./components/LoginForm";
import NavigationBar from "./components/NavigationBar";
import RegistrationForm, {
  IRegistrationFormCache
} from "./components/RegistrationForm";
import RequestResetPasswordForm from "./components/RequestResetPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import ISearchFormCache from "./components/searchFormComponents/ISearchFormCache";
import SearchPage, {
  DEFAULT_START_INDEX,
  ISearchPageCache
} from "./components/searchFormComponents/SearchPage";
import UserUpdateForm, {
  IUserUpdateFormCache
} from "./components/UserUpdateForm";
import { USER_QUERY } from "./graphql/Query";
import { IUser } from "./util/types";

interface IProtectedRouteProps {
  component: any;
  user: IUser | null | undefined;
  [propName: string]: any;
}

interface ICache {
  loginForm: ILoginFormCache;
  registrationForm: IRegistrationFormCache;
  searchForm: ISearchFormCache;
  searchPage: ISearchPageCache;
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
  js9ViewFITSURL: string;
  js9ViewOpen: boolean;
  user?: IUser;
  screenDimensions: { innerHeight: number; innerWidth: number };
}

/**
 * The data archive.
 */
class App extends React.Component<{}, IAppState> {
  state = {
    cart: { open: false },
    js9ViewFITSURL: "",
    js9ViewOpen: false,
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
    searchPage: { startIndex: DEFAULT_START_INDEX },
    userUpdateForm: {}
  };

  public render() {
    const { js9ViewFITSURL, js9ViewOpen } = this.state;
    const { open } = this.state.cart;
    return (
      <JS9ViewContext.Provider
        value={{
          close: this.js9ViewClose,
          load: this.js9ViewLoad,
          open: this.js9ViewOpen
        }}
      >
        <JS9View
          fitsURL={js9ViewFITSURL}
          onClose={() => this.setState({ js9ViewOpen: false })}
          open={js9ViewOpen}
        />
        <Query query={USER_QUERY}>
          {({ data, loading }: any) => {
            if (loading) {
              return <Spinner />;
            }

            const currentUser =
              data && data.user
                ? {
                    affiliation: data.user.affiliation,
                    authProvider: data.user.authProvider,
                    email: data.user.email,
                    familyName: data.user.familyName,
                    givenName: data.user.givenName,
                    isAdmin: data.user.roles.some(
                      (role: string) => role === "ADMIN"
                    ),
                    username: data.user.username
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
                        searchFormCache={this.cache.searchForm}
                        searchPageCache={this.cache.searchPage}
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
                  {/* We are passing a user property because it needs to be used in the componentDidMount() */}
                  <ProtectedRoute
                    user={currentUser}
                    exact={true}
                    path="/user-update"
                    component={() => (
                      <UserUpdateForm
                        cache={this.cache.userUpdateForm}
                        user={currentUser}
                      />
                    )}
                  />

                  {/* request reset password page */}
                  <Route
                    exact={true}
                    path="/request-reset-password"
                    component={RequestResetPasswordForm}
                  />

                  {/* request reset password page */}
                  <Route
                    exact={true}
                    path="/reset-password/:token"
                    component={ResetPasswordForm}
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
      </JS9ViewContext.Provider>
    );
  }

  public openCart = async (open: boolean) => {
    await this.setState(() => ({ ...this.state, cart: { open } }));
  };

  public js9ViewOpen = () => {
    this.setState({ js9ViewOpen: true });
  };

  public js9ViewClose = () => {
    this.setState({ js9ViewOpen: false });
  };

  public js9ViewLoad = (fitsURL: string) => {
    this.setState({ js9ViewFITSURL: fitsURL });
  };
}

export default App;
