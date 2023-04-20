import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useRef, useEffect, useContext, useState } from "react";
import { emailVerification, signup } from "../API/api";
import { useLocation } from "react-router-dom";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import "../CSS/signup.css";

const VerifyEmail = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const [otp, setOTP] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [error, setError] = useState("");
  const [resend, setResend] = useState(0);

  function otpGenerator() {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  }

  useEffect(() => {
    let newOtp = otpGenerator();
    setOTP(newOtp);
    emailVerification(state.email, newOtp);
  }, [resend]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userOtp != otp) {
      setError("Invalid OTP");
    } else {
      const res = await signup(
        state.email,
        state.password,
        state.username,
        state.accountType
      );
      user.setAccountID(res.data.accountID);
      user.setAccountType(state.accountType);
      navigate("/");
    }
  };

  return (
    <div className="form">
      <Container>
        <Form onSubmit={handleSubmit}>
          <h1 className="text-center pt-3 pb-3">OTP Verification</h1>

          <hr />

          <Stack gap={1} className="col-12 mx-auto">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                value={userOtp}
                onChange={(e) => {
                  setUserOtp(e.target.value);
                }}
                required
              />
            </Form.Group>
            <a
              onClick={() => setResend(resend + 1)}
              className="d-flex justify-content-end"
              style={{
                fontSize: "12px",
                color: "#0A66C2",
                paddingLeft: "5px",
                cursor: "pointer",
              }}
            >
              Resend OTP
            </a>
            <Button variant="outline-primary" type="submit" className="my-2">
              Verify OTP
            </Button>

            {error && <Alert variant="danger text-center">{error}</Alert>}
          </Stack>
        </Form>
      </Container>
    </div>
  );
};

export default VerifyEmail;
