import * as Raven from "raven-js";
import * as React from "react";

import SendMessage from "./components/SendMessage";

import { sentryUrl } from "./senrtyConfig";

Raven.config(sentryUrl).install();

class App extends React.Component {
  public render() {
    return <SendMessage />;
  }
}

export default App;
