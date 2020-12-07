import React, {useEffect, createContext, useReducer, useContext} from 'react'
import {BrowserRouter as Router, Switch, Route, useHistory} from 'react-router-dom';
import Home from "./pages/Home.js";
import Signup from "./pages/Signup.js";
import Login from "./pages/Login.js";
import Account from "./pages/Account.js";
import Post from "./pages/Post.js";
import Main from "./pages/Main.js";
import Forum from "./pages/Forum.js";
import Search from "./pages/Search.js";
import Profile from "./pages/Profile.js";
import OtherAccount from "./pages/OtherAccount.js";
import OtherProfile from "./pages/OtherProfile.js";

import {reducer, initialState} from "./reducers/userReducer";
export const UserContext = createContext();

const RouteControl = () => {
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const {state, dispatch} = useContext(UserContext);
  
  useEffect(() => {
    /* Acquire current authentication information
     from JSON data in the storage. Make sure the user is logged in. */
    const user = localStorage.getItem("user");
    if (user) {
      /* Make sure the user is logged in if the browser
      is not logged on and is closed */
      dispatch({type: "USER", payload: user});
      console.log(`User local storage item: ${user}`);
    }
     else {
      if(!history.location.pathname.startsWith('/reset'))
          /* If not, redirect to login page */
          history.push('/login');
    }
  }, [history, dispatch]);
  
  return (
    <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/sign-up' exact component={Signup} />
        <Route path='/login' exact component={Login} />
        <Route path='/account' exact component={Account} />
        <Route path='/account/:username' component={OtherAccount} />
        <Route path='/post' exact component={Post} />
        <Route path='/main' exact component={Main} />
        <Route path='/forum' exact component={Forum} />
        <Route path='/search' exact component={Search} />
        <Route path='/profile' exact component={Profile} />
        <Route path='/profile/:username' component={OtherProfile} />
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{state, dispatch}} >
      <Router>
        <RouteControl />
      </Router> 
    </UserContext.Provider>
  );
}

export default App;
