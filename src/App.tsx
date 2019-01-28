import * as Sentry from "@sentry/browser";
import * as React from "react";

import SendMessage from "./components/SendMessage";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN
});

class App extends React.Component {
  public render() {
    return <SendMessage />;
  }
}

export default App;
