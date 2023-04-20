const asyncHandler = require("express-async-handler");
const { db } = require("../config/db_create");

const removeSocietyAccount = asyncHandler((req, response) => {
  let Society_id = req.body.Society_id;

  let connection = validateConnection();

  let deleteAccount = `DELETE FROM societyTable WHERE Society_id = ?`;
  let values = [Society_id];

  connection.query(deleteAccount, values, (err, res) => {
    if (err) {
      let returnMessage = {
        isSuccessful: false,
        errorMessage: "Could not delete account",
      };
      response.send(returnMessage);
      connection.end();
    } else {
      let returnMessage = {
        isSuccessful: true,
      };
      response.send(returnMessage);
      connection.end();
    }
  });
});

const removeStudentAccount = asyncHandler((req, response) => {
  let Student_id = req.body.Student_id;

  let connection = validateConnection();

  let deleteAccount = `DELETE FROM studentTable WHERE Student_id = ?`;
  let values = [Student_id];

  connection.query(deleteAccount, values, (err, res) => {
    if (err) {
      let returnMessage = {
        isSuccessful: false,
        errorMessage: "Could not delete account",
      };
      response.send(returnMessage);
      connection.end();
    } else {
      let returnMessage = {
        isSuccessful: true,
      };
      response.send(returnMessage);
      connection.end();
    }
  });
});

module.exports = {
  removeSocietyAccount,
  removeStudentAccount,
};
