const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController.js");
router.get("/profile/editInfo", studentController.editInfo);
router.get("/profile/cv-about-me", studentController.cvAboutMe);
router.get("/profile/mySocities", studentController.getMySocities);
router.get("/profile/myApplications", studentController.getMyApplications);
router.post("/interact_post", studentController.interact_post);
router.post("/bookEvent", studentController.bookEvent);
router.post("/applyForSociety", studentController.applyForSociety);
router.post("/attendEvent", studentController.attend_Event);
module.exports = router;
