import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../../CSS/signup.css";
import "../../CSS/homepage.css";
const Post = (post) => {
  const { posts_id, title, description } = post;
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div>
      {/* <Container className="text-center">
        <h1 className="pt-3 pb-3">{event.society_name}</h1>
        <hr style={{ width: "350px", margin: "20px auto" }} />
        <h1>{title}</h1>
        <p>
          {showFull ? description : truncatedText}{" "}
          <a className="show-button" onClick={handleClick}>
            {showFull ? "Show less" : "Show more"}
          </a>
        </p>
      </Container> */}
      <div className="card" style={{ width: "18rem" }}>
        <Link to={`/posts/${posts_id}`}>
          <img
            className="card-img-top"
            src="https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
          />
        </Link>
        <div className="card-body">
          <h5 className="card-title text-capitalize">{title}</h5>
          <p class="card-text">
            {showInfo ? description : `${description.substring(0, 50)}...`}
            <p
              className="btn text-primary"
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo ? "show less" : "show more"}
            </p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
