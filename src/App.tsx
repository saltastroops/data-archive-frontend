import * as React from "react";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import AppRoute from "./components/AppRoute";
import NavigationBar from "./components/NavigationBar";

class App extends React.Component {
  public render() {
    const user = {
      isAdmin: () => true,
      name: "Nhlavutelo",
      username: "Eb-Zeero"
    };
    return (
      <Router>
        <>
          <NavigationBar
            user={user}
            logout={() => {
              return;
            }}
          />
          {<AppRoute user={undefined} />}
        </>
      </Router>
    );
  }
}

export default App;
