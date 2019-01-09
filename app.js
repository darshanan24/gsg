const express = require("express");
const app = express();
//const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//routing to different apis
const userRoutes = require("./api/routes/users");
//database connections
const config = require('./config/database');
mongoose.connect(config.database,{useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

let db = mongoose.connection;

// Check connection
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function (err) {
    console.log(err);
});

//to avoid depricated warning
mongoose.Promise = global.Promise;
// can Remove this app.use(morgan("dev")) before releasing to production 
//app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false })); // extended is false, coz since we are not using complicated urls. If i do, then performance may not be optimum.
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "POST,  DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


// Routes which should handle requests
app.use("/user", userRoutes);  //base path for users
// applicable to all apis
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

// applicable to all apis
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;