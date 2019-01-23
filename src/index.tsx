import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import 'bulma'
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import * as ReactDOM from "react-dom";
import App from "./App";
import { gqlEndpoint } from "./config";

import * as serviceWorker from "./registerServiceWorker";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: gqlEndpoint
    })
});
ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById("root")
);
serviceWorker.unregister();
