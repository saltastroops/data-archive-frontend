import * as React from "react";
import { Route } from "react-router";
import Message from "./basicComponents/Message";

interface IUser {
  user?: {
    name: string;
    username: string;
    isAdmin: () => boolean;
  };
}
class AppRoute extends React.Component<IUser, any> {
  public render() {
    const { user } = this.props;
    console.log(window.location.pathname);
    return (
      <>
        <Route
          exact={true}
          path="/"
          render={() => <h1 className={"title"}>Main Page</h1>}
        />
        <Route
          exact={true}
          path="/register"
          component={() => <h1 className={"title"}>User register</h1>}
        />
        {user ? (
          <Message message={"You are already logged in"} type={"warning"} />
        ) : (
          <Route
            exact={true}
            path="/login"
            component={() => <h1 className={"title"}>Login page</h1>}
          />
        )}
        {!user ? (
          <Message message={"You are not logged in"} type={"danger"} />
        ) : (
          <Route
            exact={true}
            path="/account"
            component={() => <h1 className={"title"}>User account</h1>}
          />
        )}
        {!user ? (
          <Message message={"You are not logged in."} type={"danger"} />
        ) : (
          <Route
            exact={true}
            path="/data-requests"
            component={() => <h1 className={"title"}>Data request page</h1>}
          />
        )}

        <Route
          exact={true}
          path="/cart"
          component={() => <h1 className={"title"}>Cart page</h1>}
        />

        <Route
          exact={true}
          path="/admin"
          component={() => <h1 className={"title"}>Admin page</h1>}
        />
      </>
    );
  }
}

export default AppRoute;
