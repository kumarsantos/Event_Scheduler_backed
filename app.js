const express = require("express");
const mongoose = require("mongoose");
const { MONGODBURI } = require("./key");
const connectDB = require("./Connection");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

connectDB();

require("./model/user");
require("./model/event");
require("./model/schedules");

const PORT = 8000;

app.use(require("./route/auth"));
app.use(require("./route/event"));

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
