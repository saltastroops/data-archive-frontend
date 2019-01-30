import * as Sentry from "@sentry/browser";
import * as React from "react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN
});

class App extends React.Component {
  public render() {
    return <h1>Here be content!</h1>;
  }
}

export default App;
