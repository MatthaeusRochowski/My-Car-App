const express = require('express');
const mongoose = require("mongoose");
const router  = express.Router();
const Car = require('../models/car');

//contains routes for add, edit & delete
//show is done along with car-details

/*  */
const loginCheck = () => {
  return (req, res, next) => 
    (req.session.user ? next () : res.redirect('/'));
};

/* prefixed with /myaccount/logbook in app.js*/
//Add Logbook Entry
router.get('/add/:carId', loginCheck(), (req, res, next) => {
  const carId = req.params.carId;
  const loggedUser = req.session.user;
  const datum = new Date();
  const heute = datum.getFullYear()+"-" + (datum.getMonth()+ 1)+"-" + datum.getDate();
  
  Car.findById({ _id: mongoose.Types.ObjectId(carId) })
  .then(foundCar => {
    let kilometerstand_start = foundCar.kilometerstand_aktuell;
    res.render('car/log-add', { user: loggedUser, carId: carId, heute: heute, kilometerstand_start: kilometerstand_start} );
  });
});

/* prefixed with /myaccount/logbook in app.js*/
router.post('/add/:carId', loginCheck(), (req, res, next) => {
  const carId = req.params.carId;
  const loggedUser = req.session.user;

  const { datum, startort, zielort, kilometerstand_start, kilometerstand_ende } = req.body;
  const strecke = kilometerstand_ende - kilometerstand_start;
  
  const newLogbookEntry = {
    datum: datum,
    startort: startort,
    zielort: zielort,
    kilometerstand_start: kilometerstand_start,
    kilometerstand_ende: kilometerstand_ende,
    strecke_km: strecke
  };

  Car.findById({ _id: mongoose.Types.ObjectId(carId) })
    .then(foundCar => {
      if (foundCar !== null) {
        foundCar.fahrtenbuch.unshift(newLogbookEntry);
        foundCar.kilometerstand_aktuell = newLogbookEntry.kilometerstand_ende;
        foundCar.save();
        res.redirect(`/myaccount/car-details/${foundCar._id}`);
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;