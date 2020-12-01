import React from 'react'
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from "./pages/Home.js";
import Signup from "./pages/Signup.js";
import Login from "./pages/Login.js";
import Account from "./pages/Account.js";
import Post from "./pages/Post.js";
import Main from "./pages/Main.js";
import Forum from "./pages/Forum.js";

function App() {
  return (
    <Router>
      <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/sign-up' exact component={Signup} />
          <Route path='/login' exact component={Login} />
          <Route path='/account' exact component={Account} />
          <Route path='/post' exact component={Post} />
          <Route path='/main' exact component={Main} />
          <Route path='/forum' exact component={Forum} />
      </Switch>
    </Router> 
  );
}

export default App;
