const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController.js");

router.post("/removeStudentAccount", adminController.removeStudentAccount);
router.post("/removeSocietyAccount", adminController.removeSocietyAccount);
module.exports = router;
