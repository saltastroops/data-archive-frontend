import * as React from "react";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";

class App extends React.Component {
  public render() {
    const initUserInput = {
      affiliation: "",
      confirmPassword: "",
      email: "",
      familyName: "",
      givenName: "",
      password: "",
      username: ""
    };
    return (
      <div>
        <RegistrationForm userInput={initUserInput} />
      </div>
    );
  }
}

export default App;
