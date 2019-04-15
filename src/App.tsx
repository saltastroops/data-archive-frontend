import * as React from "react";
import { Mutation, Query } from "react-apollo";
import { Redirect, Route, Switch } from "react-router-dom";
import DataRequestsForm from "./components/dataRequest/DataRequestsForm";
import LoginForm, { ILoginFormCache } from "./components/LoginForm";
import NavigationBar from "./components/NavigationBar";
import RegistrationForm, {
  IRegistrationFormCache
} from "./components/RegistrationForm";
import SearchForm, { ISearchFormCache } from "./components/SearchForm";
import { LOGOUT_USER_MUTATION } from "./graphql/Mutations";
import { USER_QUERY } from "./graphql/Query";

interface IUser {
  name: string;
  username: string;
  isAdmin: () => boolean;
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

/**
 * The data archive.
 */
class App extends React.Component<any, any> {
  private cache: ICache = {
    loginForm: {},
    registrationForm: {},
    searchForm: {}
  };

  logout = async (userLogout: any) => {
    await userLogout();
  };

  public render() {
    return (
      <Query query={USER_QUERY}>
        {({ data, loading }) => {
          if (loading) {
            return <p>Loading...</p>;
          }

          const currentUser =
            data && data.user
              ? {
                  isAdmin: () => false,
                  name: data.user.givenName,
                  username: data.user.familyName
                }
              : null;

          return (
            <>
              <Mutation
                mutation={LOGOUT_USER_MUTATION}
                refetchQueries={[{ query: USER_QUERY }]}
              >
                {userLogout => {
                  return (
                    <NavigationBar
                      user={currentUser}
                      logout={() => this.logout(userLogout)}
                    />
                  );
                }}
              </Mutation>

              <Switch>
                {/* search page */}
                <Route
                  exact={true}
                  path="/"
                  render={() => <SearchForm cache={this.cache.searchForm} />}
                />

                {/* registration page */}
                <Route
                  exact={true}
                  path="/register"
                  component={() => (
                    <RegistrationForm cache={this.cache.registrationForm} />
                  )}
                />

                {/* login page */}
                <Route
                  exact={true}
                  path="/login"
                  component={() => <LoginForm cache={this.cache.loginForm} />}
                />

                {/* account details page */}
                <ProtectedRoute
                  user={currentUser}
                  exact={true}
                  path="/account"
                  component={() => (
                    <h1 className="title">
                      {currentUser
                        ? `${currentUser.name} ${currentUser.username} Account`
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

                {/* cart page */}
                <Route
                  exact={true}
                  path="/cart"
                  component={() => <h1 className="title">Cart page</h1>}
                />

                {/* admin page */}
                <ProtectedRoute
                  user={currentUser}
                  exact={true}
                  path="/admin"
                  component={() => <h1 className="title">Admin page</h1>}
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
}

export default App;
