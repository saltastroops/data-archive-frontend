Fun with the frontend (Part 1)
==============================

Setting up the React app
------------------------
Go to the root folder

```cfml
cd /path/to/root/folder
```

Use `create-react-app` to create a new React app.

```cfml
create-react-app frontend --scripts-version=react-scripts-ts
```

The above command will create a react application of name frontend and, the 
flag `--scripts-version=react-scripts-ts` will initiate typescript and setup tslint without any rules

```cfml
cd frontend
```

note:
----- 
Flag `--typescript` will initiate type script and initiate git only 

Because our command does not initiate git we need to initiate it manually.

Note:
-----

Make sure that you are in the root directory of frontend "`/path/to/root/folder/frontend`"
IDE files are included on the `.gitignore` file
i.e The `.gitignore` file should contain below line if you are using `intelliJ IDE`
```cfml
# IDE
/.idea
```
 
run:
---
```cfml
git init
git add .
git commit -m "Initial commint"

```
With git initialized now you can run all command that are mentioned on the `package.json`("script") file

Running react application
-------------------------

```cfml

yarn start

```
Your default browser will launch the default react application.

Making it prettier
------------------

As for the backend, we use Prettier and TSLint. But this time we also add
lint rules for React and JSX into the mix.
```cfml
yarn add -D prettier tslint tslint-react tslint-config-prettier
```

edit tslint.json file to
```json
{
  "extends": ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
  "rules": {
    "member-access": {
      "severity": "off"
    },
    "jsx-no-lambda": false,
    "indent": [
      true,
      "spaces",
      2
    ]
  },
  "linterOptions": {
    "exclude": [
      "config/**/*.js",
      "node_modules/**/*.ts",
      "coverage/lcov-report/*.js"
    ]
  }
}

```

Let’s add tasks for Prettier and TSLint to the `package.json` file.

```cfml
{
  ...
  "scripts": {
    ...
    "format": "prettier --write 'src/**/*.{js,ts,tsx,json,css}'", 
    "lint": "tslint 'src/**/*.{ts,tsx}'",
    "lint:fix": "tslint --fix 'src/**/*.{ts,tsx}'",
    ...
  }
  ...
}

```

Adding Apollo
-------------

We’ll communicate to our server using Apollo and GraphQL queries. So let’s install the necessary packages.
```cfml
yarn add apollo-client@alpha react-apollo apollo-link-http apollo-cache-inmemory graphql graphql-tag  
yarn add -D @types/graphql
```
Update `tsconfig.json` file to show it where the types are.
```cfml
{
  "compilerOptions": {
    ...
    "lib": [
        "es6",
        "dom",
        "esnext"
    ],
    ...
    "typeRoots": [
      "node_modules/@types"
    ]
    ...
  },
  ...
}

``` 
We can then connect an Apollo client to React by replacing the content of `src/index.tsx` with the following.

```typescript jsx
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import * as ReactDOM from "react-dom";
import App from "./App";

import * as serviceWorker from "./registerServiceWorker";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: "graphQL-Endpoint"
    })
});
ReactDOM.render(
    <ApolloProvider client={client}>
     <App />
    </ApolloProvider>,
    document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers:  http://bit.ly/CRA-PWA
serviceWorker.unregister();
```
Note that we are not importing `src/index.css` any longer, so you may remove this file



Adding styling
------------

We have agreed to style our application with bulma

```cfml
yarn add node-sass bulma
```

Import Bulma css in `src/index.tsx`
```typescript jsx
import 'bulma/css/bulma.css'
```
Now we could just add Bulma-specific class names such as “button”, “primary” and “textarea” to the form components. 


However, let’s take it
a step further and throw styled components into the mix

```cfml
yarn add styled-components
yarn add -D @types/styled-components
```

now you can create components looking like 
```typescript jsx
import * as React from "react";
import { ChangeEvent, Component } from "react";
import { Mutation } from "react-apollo";

import styled from 'styled-components';
const PaddedDiv = styled.div`
  padding: 15px;
`;
const SubmitButton = styled.button.attrs({ className: 'button primary'})`
  && {
    background-color: lightblue;
    color: white;
  }
`;

const MessageTextArea = styled.textarea.attrs({ className: 'textarea' })`
  && {
    min-width: 50%;
    width: 50%;
  }
`;

interface ISendMessageState {
  message: string;
}

class SendMessage extends Component<{}, ISendMessageState> {
  state = { message: "" };
handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
  e.preventDefault();
  e.persist();
  this.setState(
    () =>
      ({
        [e.target.name]: e.target.value
      } as any)
    );
  };
  render() {
    return (
      <form>
        <PaddedDiv>
          <MessageTextArea
            name="message"
            placeholder="Type your message"
            onChange={this.handleChange}
            value={this.state.message}
          />
        </PaddedDiv>
        <PaddedDiv>
          <SubmitButton type="submit">Submit</SubmitButton>
        </PaddedDiv>
      </form>
    );
  }
}
export default SendMessage;
```
