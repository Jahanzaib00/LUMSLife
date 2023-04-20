const express = require("express");
const { json, urlencoded } = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: "../.env" });
const generalRouter = require("./routes/generalRoutes.js");
const studentRouter = require("./routes/studentRoutes.js");
const societyRouter = require("./routes/societyRoutes.js");
const adminRouter = require("./routes/adminRoutes.js");

// creating the server
const app = express();

// enabling cors to allow for communication between different servers
app.use(cors());

// parsing incoming JSON requests and placing parsed data within req.body
app.use(json());
app.use(urlencoded({ extended: true }));

// printing any requests made to the server
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(express.static(path.join(__dirname, "./frontend/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./frontend/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

// routing requests to the server using the router specified in routes/routes.js
app.use("/api/general", generalRouter);
app.use("/api/society", societyRouter);
app.use("/api/student", studentRouter);
app.use("/api/admin", adminRouter);

// listening for any requests made to the server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
