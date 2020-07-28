const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const errorHandler = require("./handlers/error");

const contact = require("./routes/contact");
app.use("/api", contact);

app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`ghost contact running on port: ${process.env.PORT}`)
);
