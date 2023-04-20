import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useContext, useState } from "react";
import { createPost } from "../../API/api";
import { UserContext } from "./../../UserContext";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import "../../CSS/signup.css";

const CreatePost = () => {
  const { accountID, fetchData } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    dateTime: "",
    postCategory: "",
    eventDescription: "",
    eventLocation: "",
    user_id: accountID,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost(formData);
    fetchData();
    navigate("/");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="form">
      <Container>
        <Form onSubmit={handleSubmit}>
          <h1 className="text-center pt-3 pb-3">Create Post</h1>

          <hr style={{ width: "350px", margin: "20px auto" }} />

          <Stack gap={1} className="col-12 mx-auto">
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="text"
                name="dateTime"
                onFocus={(e) => (e.target.type = "datetime-local")}
                placeholder="Event Date and Time"
                value={formData.dateTime}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="eventLocation"
                placeholder="Event Location"
                value={formData.eventLocation}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Select
                name="postCategory"
                defaultValue=""
                onChange={handleChange}
              >
                <option value="" disabled>
                  Post Category
                </option>
                <option value="general">General</option>
                <option value="event">Event</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                name="eventDescription"
                placeholder="Description"
                value={formData.eventDescription}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="outline-primary" type="submit" className="my-2">
              Create Post
            </Button>
          </Stack>
        </Form>
      </Container>
    </div>
  );
};

export default CreatePost;
