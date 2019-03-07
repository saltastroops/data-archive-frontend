import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoute from "./components/AppRoute";
import NavigationBar from "./components/NavigationBar";

class App extends React.Component {
  public render() {
    /* TODO:
     * user is currently unknown so I am using a dummy user
     * this will affect the test of this component after user is defined
     * */
    const user = {
      isAdmin: () => true,
      name: "Nhlavu",
      username: "Nhlavu"
    };
    // const user = undefined;
    return (
      <Router>
        <>
          <NavigationBar
            user={user}
            logout={() => {
              return;
            }}
          />
          <AppRoute user={user} />
        </>
      </Router>
    );
  }
}

export default App;
