const asyncHandler = require("express-async-handler");
const { db } = require("../config/db_create");

const editInfo = asyncHandler((req, res) => {
  // Handle the request to edit student information
  const sql =
    "UPDATE students SET name = ?, email = ?, password_hash = ? WHERE User_id = ?";
  const hashedPassword = sha1(req.body.password);
  const values = [req.body.name, req.body.email, hashedPassword, req.body.id];
  db.query(sql, values, function (err, result) {
    if (err) {
      throw err;
    }
    res.send("Student information updated successfully");
  });
});

const cvAboutMe = asyncHandler((req, res) => {
  // Handle the request to retrieve the student's CV and About Me content
  const sql = "SELECT cv, about_me FROM Student WHERE User_id = ?";
  const values = [req.query.id];
  db.query(sql, values, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

const getMySocities = asyncHandler((req, res) => {
  // Handle the request to retrieve the student's society information
  const sql =
    "SELECT society_name, position FROM society_membership WHERE member_id = ?";
  const values = [req.query.id];
  db.query(sql, values, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

const getMyApplications = asyncHandler((req, res) => {
  // Handle the request to retrieve the student's society application information
  const sql =
    "SELECT society_name, position FROM society_membership WHERE member_id = ? and joined = false"; //use joined = false to get applications from society_membership
  const values = [req.query.id];
  db.query(sql, values, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

const interact_post = asyncHandler(async (req, res) => {
  let { post_id, user_id, liked, comment } = req.body;
  console.log(post_id, user_id, liked, comment);
  //get user name from user id
  const name_sql = `SELECT name FROM User WHERE User_id = ?`;
  const [user, _] = await db.promise().query(name_sql, [user_id]);
  console.log(user);
  const name = user[0].name;
  comment = name + ": " + comment;

  const sql = `INSERT INTO Interactions (post_id, user_id, liked, comment) 
             VALUES (?, ?, ?, ?)`;

  const values = [post_id, user_id, liked, comment];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to interact with the post" });
    }
    console.log(`Interaction with post ID ${post_id} created`);
    return res.status(201).json({ message: "Post interaction created" });
  });
});

const bookEvent = asyncHandler(async (req, res) => {
  const { user_id, post_id } = req.body;
  console.log(req.body);

  // Check if the user has already booked the event
  const unconfirmedBookingSQL = `
    SELECT COUNT(*) as unconfirmed_count
    FROM Bookings
    WHERE user_id = ? AND confirmed = 0
  `;
  const [unconfirmedResult] = await db
    .promise()
    .query(unconfirmedBookingSQL, [user_id]);
  const unconfirmedCount = unconfirmedResult[0].unconfirmed_count;

  if (unconfirmedCount >= 1) {
    //prevents users from booking more than one event at a time
    return res.status(400).json({ message: "Too many unconfirmed bookings" });
  }

  // Book the event
  const bookingSQL = `
    INSERT INTO Bookings (user_id, post_id, confirmed)
    VALUES (?, ?, 0)
  `;
  await db.promise().query(bookingSQL, [user_id, post_id]);

  res.status(201).json({ message: "Event booked successfully" });
});

const applyForSociety = asyncHandler(async (req, res) => {
  const { user_id, society_id } = req.body;

  const checkMembershipSQL = `
    SELECT COUNT(*) as membership_count
    FROM Society_membership
    WHERE Society_id = ? AND member_id = ?
  `;
  const [membershipResult] = await db
    .promise()
    .query(checkMembershipSQL, [society_id, user_id]);
  const membershipCount = membershipResult[0].membership_count;

  if (membershipCount > 0) {
    return res
      .status(400)
      .json({ message: "You have already applied for this society." });
  }

  const applySQL = `
    INSERT INTO Society_membership (Society_id, member_id, joined)
    VALUES (?, ?, 0)
  `;
  await db.promise().query(applySQL, [society_id, user_id]);

  res
    .status(201)
    .json({ message: "Society application submitted successfully" });
});

const attend_Event = asyncHandler(async (req, res) => {
  const { event_id, user_id } = req.body;
  const sql = "INSERT INTO Event_attendance (event_id, user_id) VALUES (?, ?)";
  const values = [event_id, user_id];

  db.query(sql, values, function (err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error attending event" });
    }
    res.status(201).json({ message: "Event attended" });
  });
});

module.exports = {
  editInfo,
  cvAboutMe,
  getMySocities,
  getMyApplications,
  interact_post,
  bookEvent,
  applyForSociety,
  attend_Event,
};
