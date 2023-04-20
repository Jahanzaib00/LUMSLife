const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config({ path: "../../.env" });
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let db = mysql.createConnection({
  database: process.env.DATABASE,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

const userTable =
  "CREATE TABLE IF NOT EXISTS " +
  process.env.DATABASE +
  ".User (User_id int NOT NULL AUTO_INCREMENT, User_type varchar(255), name varchar(255), email varchar(255), password_hash varchar(255), PRIMARY KEY (User_id))";
const studentTable =
  "CREATE TABLE IF NOT EXISTS " +
  process.env.DATABASE +
  ".Student (Student_id int NOT NULL AUTO_INCREMENT, User_id int NOT NULL, cv varchar(255) , about_me varchar(255) , PRIMARY KEY (Student_id), FOREIGN KEY (User_id) REFERENCES User(User_id))";
const societyMemberTable =
  "CREATE TABLE IF NOT EXISTS " +
  process.env.DATABASE +
  ".Society_member (member_id int NOT NULL AUTO_INCREMENT, User_id int NOT NULL, membership int, PRIMARY KEY (member_id), FOREIGN KEY (User_id) REFERENCES User(User_id))";
const adminTable =
  "CREATE TABLE IF NOT EXISTS " +
  process.env.DATABASE +
  ".Admin (Admin_id int NOT NULL AUTO_INCREMENT, User_id int NOT NULL, PRIMARY KEY (Admin_id), FOREIGN KEY (User_id) REFERENCES User(User_id))";
const societyTable =
  "CREATE TABLE IF NOT EXISTS " +
  process.env.DATABASE +
  ".Society (Society_id int NOT NULL AUTO_INCREMENT, society_name varchar(255), membership int, posts_id int, PRIMARY KEY (Society_id), FOREIGN KEY (posts_id) REFERENCES Posts(posts_id))";
const postsTable =
  "CREATE TABLE IF NOT EXISTS " +
  process.env.DATABASE +
  ".Posts (posts_id int NOT NULL AUTO_INCREMENT, title varchar(255), date_time DATETIME, category varchar(255), description TEXT, location varchar(255), User_id int, PRIMARY KEY (posts_id), FOREIGN KEY (user_id) REFERENCES User(User_id))";
const societyMembershipTable =
  "CREATE TABLE IF NOT EXISTS " +
  process.env.DATABASE +
  ".Society_membership (Society_id int NOT NULL, member_id int NOT NULL , society_name varchar(255) ,  position varchar(255) , joined bool, PRIMARY KEY (Society_id, member_id), FOREIGN KEY (Society_id) REFERENCES Society(Society_id), FOREIGN KEY (member_id) REFERENCES Society_member(member_id))";
const interactionsTable =
  "CREATE TABLE IF NOT EXISTS " +
  process.env.DATABASE +
  ".Interactions (post_id int NOT NULL, comment varchar(255), user_id int NOT NULL, liked bool, PRIMARY KEY (post_id, user_id), FOREIGN KEY (post_id) REFERENCES Posts(posts_id), FOREIGN KEY (user_id) REFERENCES User(User_id))";
const eventsTable =
  "CREATE TABLE IF NOT EXISTS " +
  process.env.DATABASE +
  ".Events (events_id int NOT NULL AUTO_INCREMENT, name varchar(255), description varchar(255), society_id int, date date, PRIMARY KEY (events_id), FOREIGN KEY (society_id) REFERENCES Society(Society_id))";
const eventAttendanceTable =
  "CREATE TABLE IF NOT EXISTS " +
  process.env.DATABASE +
  ".Event_attendance (event_id int NOT NULL, user_id int NOT NULL, PRIMARY KEY (event_id, user_id), FOREIGN KEY (event_id) REFERENCES Events(events_id), FOREIGN KEY (user_id) REFERENCES User(User_id))";
const bookingsTable =
  "CREATE TABLE IF NOT EXISTS " +
  process.env.DATABASE +
  ".Bookings (booking_id int NOT NULL AUTO_INCREMENT, post_id int NOT NULL, user_id int NOT NULL, confirmed bool, PRIMARY KEY (booking_id), FOREIGN KEY (post_id) REFERENCES Posts(posts_id), FOREIGN KEY (user_id) REFERENCES User(User_id))";
function createTable(CreateQuerry) {
  db.query(CreateQuerry, (err, result) => {
    if (err) {
      console.log("Table creation failed");
      console.log(err);
    } else {
      console.log("Table created");
      //console.log(result);
    }
  });
}

db.connect((error) => {
  // console.log(connectionString);
  if (!error) {
    console.log("Connection has been established");
    db.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`,
      (err2, result) => {
        if (err2) {
          console.log(err2);
        } else {
          console.log("Database Created");

          createTable(userTable);
          createTable(studentTable);
          createTable(societyMemberTable);
          createTable(adminTable);
          createTable(postsTable);
          createTable(societyTable);
          createTable(societyMembershipTable);
          createTable(interactionsTable);
          createTable(eventsTable);
          createTable(eventAttendanceTable);
          createTable(bookingsTable);
        }
      }
    );
  } else {
    console.log("Connection failed in db");
    console.log(error);
  }
});
module.exports = {
  db,
};
