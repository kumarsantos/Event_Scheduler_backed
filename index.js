const express = require("express");
const connectDB = require("./Connection");
const dotEnv = require('dotenv');
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotEnv.config();

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
