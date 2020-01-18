// Routes to protected car pages -> crud
const express = require("express");
const router = express.Router();
const Car = require("../models/car");
const mongoose = require("mongoose");

/*  */
const loginCheck = () => {
  return (req, res, next) => (req.session.user ? next() : res.redirect("/"));
};

router.get("/myaccount/car-details/:id", loginCheck(), (req, res, next) => {
  const loggedUser = req.session.user;
  Car.findById(req.params.id).then(theCar => {
    //console.log(theCar);
    res.render("car/car-details", { user: loggedUser, car: theCar });
  });
});

router.get("/myaccount", loginCheck(), (req, res, next) => {
  const loggedUser = req.session.user;
  Car.find({ eigner_ref: mongoose.Types.ObjectId(loggedUser._id) })
    .populate("eigner_ref")
    .then(myCars => {
      //console.log(myCars);
      res.render("auth/myaccount", { user: loggedUser, car: myCars });
    })
    .catch(err => next(err));
});

router.get("/home-main", loginCheck(), (req, res) => {
  const loggedUser = req.session.user;
  res.render("auth/home-main", { user: loggedUser });
});

router.get("/car-add", loginCheck(), (req, res) => {
  const loggedUser = req.session.user;
  res.render("car/car-add", { user: loggedUser });
});

router.post("/car-add", loginCheck(), (req, res, next) => {
  const loggedUser = req.session.user;
  console.log(loggedUser);
  const eigner_ref = loggedUser._id;
  const {
    kennzeichen,
    hersteller,
    modell,
    hsn,
    tsn,
    kraftstoff,
    leistung_ps,
    erstzulassung_monat,
    erstzulassung_jahr,
    kaufpreis,
    kilometerstand_kauf
  } = req.body;
  const kilometerstand_aktuell = kilometerstand_kauf;

  Car.create({
    kennzeichen,
    hersteller,
    modell,
    hsn,
    tsn,
    kraftstoff,
    leistung_ps,
    erstzulassung_monat,
    erstzulassung_jahr,
    kaufpreis,
    kilometerstand_kauf,
    kilometerstand_aktuell,
    eigner_ref
  })
    .then(() => {
      res.render("auth/myaccount", { user: loggedUser });
    })
    .catch(err => {
      next(err);
    });
});

//Edit Car Details
/* prefixed with /myaccount in app.js*/
router.post("/edit/:carId", loginCheck(), (req, res, next) => {
  const carId = req.params.carId;

  const { kennzeichen, hersteller, modell, hsn, tsn, kraftstoff, 
    leistung_ps, erstzulassung_monat, erstzulassung_jahr, kaufpreis, 
    kilometerstand_kauf, kilometerstand_aktuell } = req.body;

  const updatedCarDetails = { kennzeichen, hersteller, modell, hsn, tsn, kraftstoff, 
    leistung_ps, erstzulassung_monat, erstzulassung_jahr, kaufpreis, 
    kilometerstand_kauf, kilometerstand_aktuell };

  Car.findByIdAndUpdate(carId, updatedCarDetails )
    .then(() => {
      res.redirect(`/myaccount/car-details/${carId}`);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
