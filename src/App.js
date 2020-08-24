import React, { Component } from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Auth from "./Auth/Auth";
import Callback from "./Callback";
import Public from "./Public";
import Private from "./Private";
import Courses from "./Courses";
import PrivateRoute from "./PrivateRoute";
import AuthContext from "./AuthContext";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      auth: new Auth(this.props.history),
      tokenRenewalComplete: false
    }
  }

  componentDidMount() {
    this.state.auth.renewToken(() => {
      this.setState({tokenRenewalComplete: true});
    });
  }

  render() {
    const {auth} = this.state;
    if (!this.state.tokenRenewalComplete) return "loading...";
    return (
      <AuthContext.Provider value={auth}>
        <Nav auth={auth} />
        <div className="body">
          <Route path="/" exact render={props => <Home auth={auth} {...props}></Home>} />
          <Route path="/callback" render={props => <Callback auth={auth} {...props}></Callback>} />
          <PrivateRoute path="/profile" component={Profile} />
          <Route path="/public" component={Public}></Route>
          <PrivateRoute path="/private" component={Private} />
          <PrivateRoute path="/courses" component={Courses} scopes={["read:courses"]} />
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
