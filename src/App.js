import "./App.css";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import PageNotFound from "./pages/PageNotFound";
import ProfilePage from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({username: "", id: 0, status: false});

//   let history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:3001/auth/validatetoken', {   // This is a middleware varification route, to verify that the user did a real request. After this it goes to headers and get a token. 
      headers : {
        accessToken: localStorage.getItem("accessToken"),
      }}
      ).then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, status: false }); // Here we destructure the authState object and then we change only status of it.
      } else {
        setAuthState({username: response.data.username, id: response.data.id, status: true});
      }
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    // history.push("./login");
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}> 
        <Router> 
          <div className="navbar">  
            <div className='links'>
              {!authState.status ? (       // if authState is true we are loggedIn and we do want to show this, but if false we are not loggedIn and we want to display this.
                <>
                  <Link to="/login"> Login </Link>
                  <Link to="/registration"> Registration </Link>
                </>
              ) : (
                <>
                  <Link to="/"> Home Page </Link>
                  <Link to="/createpost"> Create A Post </Link>
                </>
              )}
            </div>
            <div className='loggedInContainer'>
              <h3>{authState.username}</h3>
              {authState.status && <button onClick={logout}>Logout</button>}
            </div>
          </div>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/createpost" exact component={CreatePost} />
            <Route path="/post/:id" exact component={Post} />
            <Route path="/login" exact component={Login} />
            <Route path="/profile/:id" exact component={ProfilePage} />
            <Route path="/registration" exact component={Registration} />
            <Route path="/changepassword" exact component={ChangePassword} />
            <Route path="*" exact component={PageNotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
