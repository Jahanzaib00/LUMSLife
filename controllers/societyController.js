const asyncHandler = require("express-async-handler");
const { db } = require("../config/db_create");

const create_post = asyncHandler(async (req, res) => {
  const {
    title,
    dateTime,
    postCategory,
    eventDescription,
    eventLocation,
    user_id,
  } = req.body;

  const sql = `INSERT INTO Posts (title, date_time, category, description, location, user_id) 
             VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
    title,
    dateTime,
    postCategory,
    eventDescription,
    eventLocation,
    user_id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to create post" });
    }
    console.log(`Post with ID ${result.insertId} created`);
    return res.status(201).json({ message: "Post created" });
  });
});

const getEventInfo = asyncHandler((req, res) => {
  // Handle the request to retrieve event information
  const sql = "SELECT name, description, date FROM Events WHERE events_id = ?";
  const values = [req.query.event_id];
  db.query(sql, values, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

const getEventAttendance = asyncHandler((req, res) => {
  const sql =
    "SELECT u.name, u.email FROM Event_attendance ea JOIN User u ON ea.user_id = u.User_id WHERE ea.event_id = ?";
  const values = [req.query.event_id];
  db.query(sql, values, function (err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

const confirm_booking = asyncHandler(async (req, res) => {
  const { booking_id } = req.body;

  const sql = `
    UPDATE Bookings
    SET confirmed = 1
    WHERE id = ?
  `;
  await db.promise().query(sql, [booking_id]);

  res.status(200).json({ message: "Booking confirmed" });
});

const view_bookings = asyncHandler(async (req, res) => {
  const { event_id } = req.query;

  const sql = `
    SELECT u.User_id, u.name, u.email, b.confirmed
    FROM Bookings b
    JOIN User u ON b.user_id = u.User_id
    WHERE b.event_id = ?
  `;
  const [bookings] = await db.promise().query(sql, [event_id]);

  res.status(200).json({ bookings });
});

module.exports = {
  create_post,
  getEventAttendance,
  getEventInfo,
  confirm_booking,
  view_bookings,
};
