const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const { JSON_SECRET } = require("../key");
const requireLogin = require("../Middleware/requireLogin");

router.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(422).send({ error: "Please Enter All The Fields." });
  }
  User.findOne({ email: email }).then((saveduser) => {
    if (saveduser) {
      return res
        .status(422)
        .json({ error: "User already exist with this email" });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds).then((hashpassword) => {
      const user = new User({
        email: email,
        password: hashpassword,
        firstname: firstName,
        lastname: lastName,
      });

      user
        .save()
        .then((user) => {
          const token = jwt.sign({ _id: user._id }, JSON_SECRET);
          const loggeduser = {
            _id: user._id,
            email: user.email,
            username: user.name,
          };
          res.json({ token, loggeduser, message: "Successfully Register." });
        })
        .catch((err) => console.log(err));
    });
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please Enter all field" });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Invalid email or password" });
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: user._id }, JSON_SECRET);
          const loggeduser = {
            _id: user._id,
            email: user.email,
            username: user.name,
          };
          res.json({ token, loggeduser, message: "LoggedIn Successfully" });
        } else {
          res.json({ error: "Invalid email or Password" });
        }
      });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
