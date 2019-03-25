import * as React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import DataRequestsForm from "./components/dataRequest/DataRequestsForm";
import NavigationBar from "./components/NavigationBar";

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
      <Router>
        <>
          <NavigationBar user={user} logout={this.logout} />

          <Switch>
            {/* search page */}
            <Route
              exact={true}
              path="/"
              render={() => <h1 className="title">Main Page</h1>}
            />

            {/* registration page */}
            <Route
              exact={true}
              path="/register"
              component={() => <h1 className="title">User register</h1>}
            />

            {/* login page */}
            <Route
              exact={true}
              path="/login"
              component={() => <h1 className="title">Login page</h1>}
            />

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
              user={user}
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
      </Router>
    );
  }
}

export default App;
