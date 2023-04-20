const { createConnection } = require("mysql2");
const sha1 = require("sha1");
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const { db } = require("../config/db_create");
const dotenv = require("dotenv").config({ path: "../../.env" });

const validateConnection = () => {
  let connection = createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: false,
  });

  connection.connect((err) => {
    if (err) {
      console.log("Connection Failed");
    } else {
      console.log("Connected");
    }
  });
  return connection;
};

const validateEmail = asyncHandler(async (req, response) => {
  let email = req.body.email;

  let connection = validateConnection();

  let emailValidation = `SELECT * FROM User WHERE email = ?`;
  let values = [email];

  connection.query(emailValidation, values, (err, res) => {
    if (err) {
      let returnMessage = {
        isSuccessful: false,
        errorMessage: "Validation request could not be processed",
      };
      response.send(returnMessage);
      connection.end();
    } else {
      if (res.length != 0) {
        let returnMessage = {
          isSuccessful: false,
          errorMessage: "Email already in use",
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
    }
  });
});

const signup = asyncHandler(async (req, response) => {
  let email = req.body.email;
  let password = sha1(req.body.password);
  let accountType = req.body.accountType;
  let name = req.body.name;

  let connection = validateConnection();

  let emailValidation = `SELECT * FROM User WHERE email = ?`;
  let values = [email];

  connection.query(emailValidation, values, async (err, res) => {
    if (err) {
      let returnMessage = {
        isSuccessful: false,
        errorMessage: "Signup request could not be processed",
      };
      response.send(returnMessage);
      connection.end();
    } else {
      if (res.length != 0) {
        let returnMessage = {
          isSuccessful: false,
          errorMessage: "Email already in use",
        };
        response.send(returnMessage);
        connection.end();
      } else {
        let insertQuery = `INSERT INTO user (User_type, name, email, password_hash) VALUES (?)`;
        let values = [accountType, name, email, password];
        connection.query(insertQuery, [values], async (err, res) => {
          if (err) {
            let returnMessage = {
              isSuccessful: false,
              errorMessage: "Signup request couldn't be processed",
            };
            response.send(returnMessage);
            connection.end();

            console.log(err);
          } else {
            console.log("User inserted");
            console.log(accountType);
            //get user id from newly inserted user
            let User_id = res.insertId;
            console.log(User_id);

            if (accountType === "admin") {
              await connection
                .promise()
                .query(
                  `INSERT INTO admin (User_id , Admin_id) VALUES (? , ?)`,
                  [User_id, User_id]
                );
              console.log("Admin inserted");
            } else if (accountType === "student") {
              await connection
                .promise()
                .query(
                  `INSERT INTO student (User_id , Student_id) VALUES (? , ?)`,
                  [User_id, User_id]
                );
              console.log("Student inserted");
            } else if (accountType === "society") {
              await connection
                .promise()
                .query(
                  `INSERT INTO Society_member (User_id , Member_id) VALUES (? , ?)`,
                  [User_id, User_id]
                );
              console.log("Member inserted");
            }

            let returnMessage = {
              isSuccessful: true,
              accountID: User_id,
            };
            response.send(returnMessage);
            connection.end();
          }
        });
      }
    }
  });
});

const login = asyncHandler(async (req, response) => {
  let email = req.body.email;
  let password = sha1(req.body.password);
  let accountType = req.body.accountType;

  let connection = validateConnection();

  let selectQuery = `SELECT * FROM User WHERE email = ?`;
  let values = [email, password];

  connection.query(selectQuery, values, (err, res) => {
    if (err) {
      let returnMessage = {
        isSuccessful: false,
        errorMessage: "Login request could not be processed",
      };
      response.send(returnMessage);

      console.log(err);
    } else {
      if (res.length == 0) {
        let returnMessage = {
          isSuccessful: false,
          errorMessage: "Email does not exist",
        };

        response.send(returnMessage);
        connection.end();
      } else {
        console.log(res);
        if (res[0].password_hash != password) {
          let returnMessage = {
            isSuccessful: false,
            errorMessage: "Password is incorrect",
          };

          response.send(returnMessage);
          connection.end();
        } else if (res[0].User_type != accountType) {
          let returnMessage = {
            isSuccessful: false,
            errorMessage: "Account Type doesn't match",
          };

          response.send(returnMessage);
          connection.end();
        } else {
          let returnMessage = {
            isSuccessful: true,
            accountID: res[0].User_id,
            accountType: res[0].User_type,
            accountName: res[0].name,
          };

          response.send(returnMessage);
          connection.end();
        }
      }
    }
  });
  connection.end();
});

const email_verification = asyncHandler(async (req, res) => {
  let user_email = req.body.email;
  let otp = req.body.otp;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jahanzaibkhursheed579@gmail.com",
      pass: "lnfckphbccfllqkq",
    },
  });

  // send verification email
  let mailOptions = {
    from: "LUMS Life",
    to: user_email,
    subject: "OTP for Email Verification",
    html: `OTP: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

const getHomeFeed = asyncHandler(async (req, res) => {
  try {
    // Get all posts with the count of likes and comments
    const postsQuery = `
    SELECT p.posts_id, p.title, p.category, p.description, p.user_id, p.date_time, p.location,
      SUM(CASE WHEN i.liked = true THEN 1 ELSE 0 END) as likes_count,
      COUNT(i.comment) as comments_count
    FROM Posts p
    LEFT JOIN Interactions i ON p.posts_id = i.post_id
    JOIN User u ON p.user_id = u.User_id
    GROUP BY p.posts_id, u.name
    ORDER BY p.posts_id DESC
    `;
    const [posts, _] = await db.promise().query(postsQuery);

    // Get all comments for each post

    const commentsQuery = ` 
      SELECT i.post_id, i.comment, i.user_id, u.name as author
      FROM Interactions i
      JOIN User u ON i.user_id = u.User_id
      WHERE i.comment IS NOT NULL
    `;
    const [comments, __] = await db.promise().query(commentsQuery);

    const postsWithComments = posts.map((post) => {
      const postComments = comments.filter((c) => c.post_id === post.posts_id);
      return { ...post, comments: postComments };
    });

    res.send(postsWithComments);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving home feed");
  }
});

module.exports = {
  signup,
  login,
  validateEmail,
  email_verification,
  getHomeFeed,
};
