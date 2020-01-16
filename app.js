require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const bcrypt = require("bcryptjs");

//Node-Basic-Authentication & Sessions
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

mongoose
  .connect("mongodb://localhost/my-car-app", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

//add dummy car to DB
//const Car = require('./models/car');
//let seedCar = require('./bin/car.json');
//Car.findOne({ "kennzeichen": seedCar.kennzeichen })
//  .then(foundCar => {
//    if (foundCar === null) {
//      Car.create(seedCar);
//    }
//  })

//load bin/car-seed.js seeds file

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// Express-Session for creating session model in database and save sessions
app.use(
  session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 600000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

// Register Partials
hbs.registerPartials(__dirname + '/views/partials');

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const index = require("./routes/index");
app.use("/", index);
const auth = require("./routes/auth");
app.use("/", auth);
const car = require("./routes/car");
app.use("/car", car);
const logbook = require("./routes/logbook");
app.use("/car/logbook", logbook);
const service = require("./routes/service");
app.use("/car/service", service);
const insurance = require("./routes/insurance");
app.use("/car/insurance", insurance);

module.exports = app;
