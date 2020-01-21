// Routes to protected car pages -> crud
const express = require("express");
const router = express.Router();
const Car = require("../models/car");
const mongoose = require("mongoose");
//const multer = require("multer");

const uploadCloud = require("../config/cloudinary.js");
//const upload = multer({ dest: './public/upload/' });

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
      //calc cost per km of each car display it and save it to the database
      //value loss of the car is yet not taken into consideration
      for (let car of myCars) {
        let fahrtenbuchKm = 0;
        let tankbuchSum = 0;
        let werkstattbuchSum = 0;
        let versicherungsbuchSum = 0;
        let steuerbuchSum = 0;

        for (let trip of car.fahrtenbuch) {
          if (!isNaN(trip.strecke_km)) {
            fahrtenbuchKm += trip.strecke_km;
          }
        }
        for (let fuel of car.tankbuch) {
          if (!isNaN(fuel.betrag)) {
            tankbuchSum += fuel.betrag;
          }
        }
        for (let service of car.werkstattbuch) {
          if (!isNaN(service.betrag)) {
            werkstattbuchSum += service.betrag;
          }
        }
        for (let insure of car.versicherungsbuch) {
          if (!isNaN(insure.betrag)) {
            versicherungsbuchSum += insure.betrag;
          }
        }
        for (let tax of car.steuerbuch) {
          if (!isNaN(tax.betrag)) {
            steuerbuchSum += tax.betrag;
          }
        }
        //console.log(fahrtenbuchKm);
        //console.log(tankbuchSum);
        //console.log(werkstattbuchSum);
        //console.log(versicherungsbuchSum);
        //console.log(steuerbuchSum);
        //console.log((tankbuchSum+werkstattbuchSum+versicherungsbuchSum+steuerbuchSum)/fahrtenbuchKm);
        if (
          fahrtenbuchKm > 0 &&
          tankbuchSum +
            werkstattbuchSum +
            versicherungsbuchSum +
            steuerbuchSum >
            0
        ) {
          car.kilometerkosten =
            Math.round(
              ((tankbuchSum +
                werkstattbuchSum +
                versicherungsbuchSum +
                steuerbuchSum) /
                fahrtenbuchKm) *
                100
            ) / 100;
        } else {
          car.kilometerkosten = 0;
        }
        car.save();
      }
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

router.post(
  "/car-add",
  [uploadCloud.single("autobild"), loginCheck()],
  (req, res, next) => {
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
    let bild = "/images/DefaultPlatzhalter.png";

    if (req.file) bild = req.file.url;

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
      eigner_ref,
      bild
    })
      .then(() => {
        res.redirect("/myaccount");
      })
      .catch(err => {
        next(err);
      });
  }
);

//Edit Car Details
/* prefixed with /myaccount in app.js*/
router.post("/edit/:carId", [uploadCloud.single("autobild"), loginCheck()], (req, res, next) => {
  const carId = req.params.carId;

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
    kilometerstand_kauf,
    kilometerstand_aktuell
  } = req.body;

  let bild;
  if (req.file) bild = req.file.url;
  console.log('neues Autobild 1', bild);

  const updatedCarDetails = {
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
    bild
  };

  Car.findByIdAndUpdate(carId, updatedCarDetails)
    .then(() => {
      console.log('neues Autobild ', bild);
      res.redirect(`/myaccount/car-details/${carId}`);
    })
    .catch(err => {
      next(err);
    });
});

// Delete a car from database
router.post("/remove/:carId", loginCheck(), (req, res, next) => {
  const loggedUser = req.session.user;
  const carId = req.params.carId;
  console.log(carId);
  Car.findByIdAndRemove({ _id: mongoose.Types.ObjectId(carId) })
    .then(() => {
      Car.find({ eigner_ref: mongoose.Types.ObjectId(loggedUser._id) })
        .populate("eigner_ref")
        .then(myCars => {
          res.render("auth/myaccount", { user: loggedUser, car: myCars });
        });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
