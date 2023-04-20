import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useRef, useEffect, useContext, useState } from "react";
import { validateEmail, signup } from "../API/api";
import { Redirect } from "react-router";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import "../CSS/signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [accountType, setAccountType] = useState("student");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [email, password, accountType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Incorrect Email");
    } else if (password.length < 8) {
      setError("Password must be atleast 8 characters");
    } else {
      let res = await validateEmail(email);
      if (res.data.isSuccessful) {
        const res = await signup(email, password, username, accountType);
        user.setAccountID(res.data.accountID);
        user.setAccountType(accountType);
        navigate(`/`);
      } else {
        setError(res.data.errorMessage);
      }
    }
  };

  return (
    <div className="form">
      <Container>
        <Form onSubmit={handleSubmit}>
          <h1 className="text-center pt-3 pb-3">Create Your Account</h1>

          <hr style={{ width: "350px", margin: "20px auto" }} />

          <Stack gap={1} className="col-12 mx-auto">
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="">
              <Form.Control
                type="text"
                placeholder="Name"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
              />
            </Form.Group>

            <Form.Select
              onChange={(e) => {
                setAccountType(e.target.value);
              }}
            >
              <option value="student">Student</option>
              <option value="society">Society</option>
              <option value="admin">Admin</option>
            </Form.Select>

            <Button variant="outline-primary" type="submit" className="my-2">
              Create My Account
            </Button>

            {error && <Alert variant="danger">{error}</Alert>}
          </Stack>
        </Form>
      </Container>
    </div>
  );
};

export default Signup;
