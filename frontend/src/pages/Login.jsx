import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useRef, useEffect, useContext, useState } from "react";
import { login } from "../API/api";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import "../CSS/signup.css";

const Login = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("student");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [email, password, accountType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await login(email, password, accountType);
    if (res.data.isSuccessful) {
      user.setAccountID(res.data.accountID);
      user.setAccountType(res.data.accountType);
      // navigate(`/${accountType}`, {
      //   state: { email: email, password: password },
      // });
    } else {
      setError(res.data.errorMessage);
    }
  };

  return (
    <div className="form">
      <Container>
        <Form onSubmit={handleSubmit}>
          <h1 className="text-center pt-3 pb-3">Sign In</h1>

          <hr />

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

            <Form.Select
              onChange={(e) => {
                setAccountType(e.target.value);
              }}
            >
              <option value="student">Student</option>
              <option value="society">Society</option>
              <option value="admin">Admin</option>
            </Form.Select>
            <h3
              style={{
                fontSize: "12px",
                color: "#0A66C2",
                paddingLeft: "5px",
              }}
            >
              Forgot Password?
            </h3>
            <Button variant="outline-primary" type="submit" className="my-2">
              Sign In
            </Button>
            <p style={{ fontSize: "12px", paddingLeft: "5px" }}>
              New here? <Link to="/signup">create new account</Link>
            </p>

            {error && <Alert variant="danger">{error}</Alert>}
          </Stack>
        </Form>
      </Container>
    </div>
  );
};

export default Login;
