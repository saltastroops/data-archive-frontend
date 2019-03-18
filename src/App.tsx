import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoute from "./components/AppRoute";
import NavigationBar from "./components/NavigationBar";

class App extends React.Component<any, any> {
  state = {
    user: {
      isAdmin: () => true,
      name: "Nhlavu",
      username: "nhlavu"
    }
  };

  logout = () => {
    this.setState(() => ({
      ...this.state,
      user: undefined
    }));
  };
  public render() {
    /* TODO:
     * user is currently unknown so I am using a dummy user
     * this will affect the test of this component after user is defined
     * */
    const { user } = this.state;

    return (
      <Router>
        <>
          <NavigationBar user={user} logout={this.logout} />
          <AppRoute user={user} />
        </>
      </Router>
    );
  }
}

export default App;
