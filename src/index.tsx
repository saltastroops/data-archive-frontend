import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import "bulma/css/bulma.css";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import * as ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import App from "./App";

import * as serviceWorker from "./registerServiceWorker";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.REACT_APP_GQL_ENDPOINT
  })
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <div className={"container"}>
      <App />
    </div>
  </ApolloProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
