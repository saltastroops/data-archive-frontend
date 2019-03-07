import * as React from "react";
import { Route } from "react-router";
import Message from "./basicComponents/Message";
import { canViewPage, isKnownPath } from "./navUtil";

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
    const path = window.location.pathname;
    if ((path === "/register" || path === "/login") && !!user) {
      return (
        <Route
          exact={true}
          path="/"
          render={() => <h1 className={"title"}>Main Page</h1>}
        />
      );
    }
    if ((path === "/data-requests" || path === "/account") && !user) {
      /* TODO:
       * Can route to '/login' or '/register' depending on which one has a link to the other
       * hence message component can be removed
       * */
      return (
        <>
          <Message message={"You are not logged in"} type={"warning"} />
          <span>
            Please login <a href={"/login"}>here</a>
          </span>
        </>
      );
    }
    if (!isKnownPath(path, user)) {
      return (
        <>
          {/*TODO: this could route to home page if unknown url is entered*/}
          <Message message={"Sorry page is unknown"} type={"danger"} />
        </>
      );
    }
    if (!canViewPage(path, user)) {
      return (
        <>
          {/*TODO: this could route to home page if unknown url is entered*/}
          <Message message={"Sorry page is unknown"} type={"danger"} />
        </>
      );
    }
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

        <Route
          exact={true}
          path="/login"
          component={() => <h1 className={"title"}>Login page</h1>}
        />
        <Route
          exact={true}
          path="/account"
          component={() => <h1 className={"title"}>User account</h1>}
        />
        <Route
          exact={true}
          path="/data-requests"
          component={() => <h1 className={"title"}>Data request page</h1>}
        />
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
