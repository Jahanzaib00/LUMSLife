import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../UserContext";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { interact_post, bookEvent } from "../../API/api";
import "../../CSS/homepage.css";
export const Post = () => {
  const { id } = useParams();
  const { homeFeed, accountID, fetchData } = useContext(UserContext);
  const [post, setPost] = useState([]);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [seeComments, setSeeComments] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // console.log(post);
    console.log(homeFeed);
    console.log(id);
    const post = homeFeed.find((post) => post.posts_id == id);
    setCategory(post.category);
    setPost(post);
  }, [homeFeed, id]);

  const date = new Date(post.date_time);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const DateTime = date.toLocaleString("en-US", options);

  const likeHandler = async () => {
    setLiked(!liked);
    await interact_post(post.posts_id, post.user_id, !liked, comment);
    fetchData();
  };

  const postCommentHandler = async () => {
    try {
      await interact_post(post.posts_id, accountID, liked, comment);
      fetchData();
    } catch {
      setError("You can comment only once");
    }
  };

  const bookEventHandler = async () => {
    try {
      await bookEvent(post.posts_id, accountID);
      fetchData();
    } catch {
      setError("Too many Bookings");
    }
  };
  return (
    <div className="form">
      <div className="card m-3">
        <img
          class="card-img-top"
          src="https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
        />
        <div className="card-body">
          <h5 className="card-title text-capitalize d-flex justify-content-between">
            <span>{post.title}</span>
            <div>
              {liked ? (
                <FaHeart onClick={likeHandler} />
              ) : (
                <FaRegHeart onClick={likeHandler} />
              )}
            </div>
          </h5>
          <div className="mt-2 mb-2">
            <FaCalendarAlt />
            <span>{DateTime}</span>
          </div>
          <div className="mt-2 mb-2">
            <FaMapMarkerAlt />
            <span>{post.location}</span>
          </div>
          <p className="card-text">{post.description}</p>
          <div className="card-buttons">
            <Link to="/" className="card-link">
              Go Back
            </Link>
            {category === "general" && (
              <div
                className="card-link"
                onClick={() => setSeeComments(!seeComments)}
              >
                see comments
              </div>
            )}
          </div>
          {category === "general" &&
            seeComments &&
            (post.comments ? (
              post.comments.map((comment) => <div>{comment.comment}</div>)
            ) : (
              <div>No comments Posted</div>
            ))}
          {category === "general" && (
            <Form.Group className="mb-3" controlId="">
              <Form.Control
                type="text"
                placeholder="comment..."
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                required
              />
            </Form.Group>
          )}
          {category === "general" ? (
            <button
              className="btn btn-primary w-100"
              onClick={postCommentHandler}
            >
              Post Comment
            </button>
          ) : (
            <button
              className="btn btn-primary w-100"
              onClick={bookEventHandler}
            >
              Book Now
            </button>
          )}
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </div>
  );
};
export default Post;

{
  /* <div className="form">
  <Container className="text-center">
    <h1 className="pt-3 pb-3">{event.society_name}</h1>
    <hr style={{ width: "350px", margin: "20px auto" }} />
    <h1>{event.name}</h1>
    <p>
      {showFull ? event.description : truncatedText}{" "}
      <a className="show-button" onClick={handleClick}>
        {showFull ? "Show less" : "Show more"}
      </a>
    </p>
    <div className="d-flex justify-content-around">
      <div className="event-location">
        <FaCalendarAlt />
        <span>Date</span>
        <p>{event.date}</p>
      </div>
      <div className="event-location">
        <FaMapMarkerAlt />
        <span>Location</span>
        <p>{event.location}</p>
      </div>
    </div>
  </Container>
</div>; */
}
