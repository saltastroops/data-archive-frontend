import * as React from "react";
import { Redirect, Route } from "react-router-dom";
import Message from "./basicComponents/Message";
import { canViewPage, isKnownPath } from "./navUtil";

class AppRoute extends React.Component<any, any> {
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
    if (!isKnownPath(path)) {
      /*
       * If path is not known display a default page not known message
       */
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
          <Message
            message={
              "Sorry you can not view this page. You are not allowed to view it"
            }
            type={"danger"}
          />
        </>
      );
    }
    return <></>;
  }
}

export default AppRoute;
