import React from "react";
// import "./App.css";
import SinglePost from "./SinglePost";
import { useContext } from "react";
import { UserContext } from "../../UserContext";

const HomeFeed = () => {
  const { homeFeed } = useContext(UserContext);
  return (
    <>
      <h2 className="text-center m-5">Posts</h2>
      <div className="container post-container">
        {homeFeed.map((post) => {
          return (
            <div className="single-post" key={post.id}>
              <SinglePost {...post} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HomeFeed;
