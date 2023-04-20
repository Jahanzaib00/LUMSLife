import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import "./App.css";
import Homepage from "./pages/Homepage/Hompage";
import EventPage from "./pages/Homepage/SinglePost.jsx";

import { UserContext } from "./UserContext";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./pages/Navbar.js";
import VerifyEmail from "./pages/VerifyEmail";
import CreatePost from "./pages/society/CreatePost";
import PostDetails from "./pages/Homepage/PostDetails";
import { getHomeFeed } from "../src/API/api";

function App() {
  const [accountID, setAccountID] = useState(false);
  const [accountType, setAccountType] = useState(null);
  const [accountName, setAccountName] = useState(null);
  const [homeFeed, setHomeFeed] = useState(null);

  const fetchData = async () => {
    const posts = await getHomeFeed();
    console.log(posts.data);
    setHomeFeed(posts.data);
  };

  const userContext = {
    accountID,
    setAccountID,
    accountType,
    setAccountType,
    accountName,
    setAccountName,
    fetchData,
    homeFeed,
  };

  // this useEffect is not working desireably, so need to be fixes

  useEffect(() => {
    // const savedState = JSON.parse(localStorage.getItem("userContext"));
    // console.log(savedState);
    // if (savedState) {
    //   userContext.setAccountID(savedState.accountID);
    //   userContext.setAccountType(savedState.accountType);
    //   userContext.setAccountName(savedState.accountName);
    // } else {
    //   localStorage.setItem("userContext", JSON.stringify(userContext));
    // }
    fetchData();
  }, []);

  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={userContext}>
          {console.log(homeFeed)}
          {accountID && <Navbar />}
          <Routes>
            <Route path="/" element={accountID ? <Homepage /> : <Login />} />
            <Route exact path="/signup" element={<Signup />}></Route>
            <Route
              exact
              path="/create-post"
              element={accountID ? <CreatePost /> : <Login />}
            ></Route>
            <Route
              exact
              path="/event"
              element={accountID ? <EventPage /> : <Login />}
            ></Route>
            <Route path="/verify-email" element={<VerifyEmail />}></Route>
            <Route
              path="/posts/:id"
              element={accountID ? <PostDetails /> : <Login />}
            ></Route>
          </Routes>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
