import * as React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import SearchForm from "./components/SearchForm";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";

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
  state = {
    user: {
      isAdmin: () => true,
      name: "Nhlavu",
      username: "nhlavu"
    }
  };

  logout = () => {
    this.setState(() => ({
      ...this.state,
      user: undefined
    }));
  };

  public render() {
    /* TODO:
     * user is currently unknown so I am using a dummy user
     * this will affect the test of this component after user is defined
     * */
    const { user } = this.state;

    return (
      <>
        <NavigationBar user={user} logout={this.logout} />

        <Switch>
          {/* search page */}
          <Route exact={true} path="/" render={() => <SearchForm />} />

          {/* registration page */}
          <Route
            exact={true}
            path="/register"
            component={() => <RegistrationForm />}
          />

          {/* login page */}
          <Route exact={true} path="/login" component={() => <LoginForm />} />

          {/* account details page */}
          <ProtectedRoute
            user={user}
            exact={true}
            path="/account"
            component={() => <h1 className="title">User account</h1>}
          />

          {/* data requests page */}
          <ProtectedRoute
            user={user}
            exact={true}
            path="/data-requests"
            component={() => <h1 className="title">Data request page</h1>}
          />

          {/* cart page */}
          <Route
            exact={true}
            path="/cart"
            component={() => <h1 className="title">Cart page</h1>}
          />

          {/* admin page */}
          <ProtectedRoute
            user={user}
            exact={true}
            path="/admin"
            component={() => <h1 className="title">Admin page</h1>}
          />

          {/* page not found */}
          <Route component={() => <h1 className="title">Page not found</h1>} />
        </Switch>
      </>
    );
  }
}

export default App;
