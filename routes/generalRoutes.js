const express = require("express");
const router = express.Router();

const generalController = require("../controllers/generalController.js");

//defining the functions to be called when a specific route is requested. note: /api/general in app.use("/api/general", router) in server file is base url for any route in this file. meaning that the signup route below is actually /api/general/signup
router.post("/signup", generalController.signup);
router.post("/login", generalController.login);
router.post("/validateEmail", generalController.validateEmail);
router.post("/verify-email", generalController.email_verification);
router.get("/getHomeFeed", generalController.getHomeFeed);
module.exports = router;
