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

//Add logbook entry - step 1
/* prefixed with /myaccount/logbook in app.js*/
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

//Add logbook entry - step 2
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

//Edit logbook entry - step 1
/* prefixed with /myaccount/logbook in app.js*/
router.get('/edit', loginCheck(), (req, res, next) => {
  const carId = req.query.carId;
  const logbookId = req.query.logbookId;
  const loggedUser = req.session.user;

  console.log("carId: " + carId);
  console.log("logbookId: " + logbookId);

  let logbookForEdit = {};

  Car.findById({ '_id': mongoose.Types.ObjectId(carId) })
  .then(foundCar => {
    if (foundCar !== null) {
      for (let index in foundCar.fahrtenbuch) {
        if (foundCar.fahrtenbuch[index]._id.toString() === logbookId.toString()) {
          logbookForEdit = foundCar.fahrtenbuch[index];
        }
      }
      res.render('car/log-edit', { user: loggedUser, carId: carId, logbook: logbookForEdit } );
    }
  })
  .catch(err => {
    next(err);
  });
})

//Edit logbook entry - step 2
/* prefixed with /myaccount/logbook in app.js*/
router.post('/edit', loginCheck(), (req, res, next) => {
  const carId = req.query.carId; //needed to add the logbook entry to the correct car
  const logbookId = req.query.logbookId;

  const loggedUser = req.session.user;

  const { datum, startort, zielort, kilometerstand_start, kilometerstand_ende } = req.body;
  const strecke = kilometerstand_ende - kilometerstand_start;
  
  const updatedLogbookEntry = {
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
        for (let index in foundCar.fahrtenbuch) {
          if (foundCar.fahrtenbuch[index]._id.toString() === logbookId.toString()) {
            foundCar.fahrtenbuch.splice(index,1,updatedLogbookEntry);
            foundCar.save();
          }
        }
        res.redirect(`/myaccount/car-details/${foundCar._id}`)
      }
    })
    .catch(err => {
      next(err);
    });
});

//Delete logbook entry
/* prefixed with /myaccount/logbook in app.js*/
router.get('/delete', loginCheck(), (req, res, next) => {
  const carId = req.query.carId; //needed to add the logbook entry to the correct car
  const logbookId = req.query.logbookId;

  const loggedUser = req.session.user;

  Car.findById({ _id: mongoose.Types.ObjectId(carId) })
    .then(foundCar => {
      if (foundCar !== null) {
        for (let index in foundCar.fahrtenbuch) {
          if (foundCar.fahrtenbuch[index]._id.toString() === logbookId.toString()) {
            foundCar.fahrtenbuch.splice(index,1);
            foundCar.save();
          }
        }
        res.redirect(`/myaccount/car-details/${foundCar._id}`)
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
