const mongoose = require('mongoose');


const connectDB = () => {
    mongoose.connect(process.env.MONGODBURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
        if (err) throw err;
        console.log("connected to mongodb...!");
    });
}

module.exports = connectDB;