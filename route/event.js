const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../Middleware/requireLogin");
const Event = mongoose.model("Event");
const Schedule = mongoose.model("Schedule");
const User = mongoose.model("User");

router.get("/allevent", requireLogin, (req, res) => {
  Event.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((events) => {
      const Finaldata = [];

      events &&
        events.map((v) => {
          let beginingTime = v.StartTime.split(":");
          let StartHour = parseInt(beginingTime[0]);
          let StartMinute = parseInt(beginingTime[1]);
          let endingTime = v.EndTime.split(":");
          let EndHour = parseInt(endingTime[0]);
          let EndMinute = parseInt(endingTime[1]);
          let title = v.EventName;
          const arr = [];

          v.DayOfWeek.map((a) => {
            let month = a.month;
            let day = a.date1;
            let year = new Date().getFullYear();

            Finaldata.push({
              title,
              year,
              month,
              day,
              StartHour,
              StartMinute,
              EndHour,
              EndMinute,
            });
          });
        });

      res.status(200).send({ events, Finaldata });
    })
    .catch((err) => console.log(err));
});

router.post("/createevent", requireLogin, (req, res) => {
  const { eventName, eventDesc, startTime, endTime, days } = req.body;

  if (!eventName || !eventDesc || !startTime || !endTime || !days) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  const dayList = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const MonthList = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const DateArray = days.map((a) => {
    return dayList.indexOf(a);
  });

  const DateFinder = (date, DateArray) => {
    const ret = new Date(date || new Date());
    const dateList = DateArray.map((val) => {
      const ret = new Date(date || new Date());
      ret.setDate(ret.getDate() + ((val - 1 - ret.getDay() + 7) % 7) + 1);
      return ret.getDate();
    });

    let nextNintyDays = [];
    dateList.map((v) => {
      let newdate = new Date(2021, 5, v);
      let date = newdate.getDate();
      let i = parseInt(date);

      while (i < 90 + parseInt(date)) {
        a = i;
        if (i % parseInt(a) == 0) {
          nextNintyDays.push(i);
          i = i + 7;
        }
        if (i > 90 + parseInt(date)) {
          break;
        }
      }
    });
    const newd = nextNintyDays.map((date) => {
      let month = new Date(2021, 5, date).getMonth();
      let date1 = new Date(2021, 5, date).getDate();
      let Finaldate = { month, date1 };
      return Finaldate;
    });

    return newd;
  };
  const date = new Date();
  const dayss = DateFinder(date, DateArray);

  req.user.password = undefined;
  const event = new Event({
    EventName: eventName,
    EventDisc: eventDesc,
    StartTime: startTime,
    EndTime: endTime,
    DayOfWeek: dayss,
    postedBy: req.user._id,
  });
  event
    .save()
    .then((result) => res.json({ event: "Event Successfully Created" }))
    .catch((err) => console.log(err));
});
module.exports = router;
