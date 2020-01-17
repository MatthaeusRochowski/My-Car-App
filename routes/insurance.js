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

/* prefixed with /myaccount/insurance in app.js*/
//Add Insurance - step 1
router.get('/add/:carId', loginCheck(), (req, res, next) => {
  const carId = req.params.carId;
  const loggedUser = req.session.user;
  res.render('car/insurance-add', { user: loggedUser, carId: carId } );
})

//Add Insurance - step 2
/* prefixed with /myaccount/insurance in app.js*/
router.post('/add/:carId', loginCheck(), (req, res, next) => {
  const carId = req.params.carId; //needed to add te insurance to the correct car
  const loggedUser = req.session.user;

  const name = req.body.name;
  const typ = req.body.typ;
  const jahr = req.body.jahr;
  const abschluss_kilometerstand = req.body.abschluss_kilometerstand;
  const geschaetzte_laufleistung = req.body.geschaetzte_laufleistung;
  const betrag = req.body.betrag;
  const schadensfreiheitsklasse = req.body.schadensfreiheitsklasse;
  
  //_id should be created & generated by mongoDB automatically
  const newInsurance = {
    name: name,
    typ: typ,
    jahr: jahr,
    abschluss_kilometerstand: abschluss_kilometerstand,
    geschaetzte_laufleistung: geschaetzte_laufleistung,
    betrag: betrag,
    schadensfreiheitsklasse: schadensfreiheitsklasse
  }

  Car.findById({ _id: mongoose.Types.ObjectId(carId) })
    .then(foundCar => {
      if (foundCar !== null) {
        foundCar.versicherungsbuch.unshift(newInsurance);
        foundCar.save();
        res.redirect(`/myaccount/car-details/${foundCar._id}`);
      }
    })
    .catch(err => {
      next(err);
    });
});

/* prefixed with /myaccount/insurance in app.js*/
//Edit Insurance - step 1
router.get('/edit', loginCheck(), (req, res, next) => {
  const carId = req.query.carId;
  const insuranceId = req.query.insuranceId
  const loggedUser = req.session.user;

  let insuranceForEdit = {};

  Car.findById({ '_id': mongoose.Types.ObjectId(carId) })
  .then(foundCar => {
    if (foundCar !== null) {
      for (let index in foundCar.versicherungsbuch) {
        if (foundCar.versicherungsbuch[index]._id.toString() === insuranceId.toString()) {
          insuranceForEdit = foundCar.versicherungsbuch[index];
        }
      }
      res.render('car/insurance-edit', { user: loggedUser, carId: carId, insurance: insuranceForEdit } );
    }
  })
  .catch(err => {
    next(err);
  });
})

//Edit Insurance - step 2
/* prefixed with /myaccount/insurance in app.js*/
router.post('/edit', loginCheck(), (req, res, next) => {
  const carId = req.query.carId; //needed to add te insurance to the correct car
  const insuranceId = req.query.insuranceId;

  const loggedUser = req.session.user;

  const name = req.body.name;
  const typ = req.body.typ;
  const jahr = req.body.jahr;
  const abschluss_kilometerstand = req.body.abschluss_kilometerstand;
  const geschaetzte_laufleistung = req.body.geschaetzte_laufleistung;
  const betrag = req.body.betrag;
  const schadensfreiheitsklasse = req.body.schadensfreiheitsklasse;
  
  //_id should be created & generated by mongoDB automatically
  const updatedInsurance = {
    name: name,
    typ: typ,
    jahr: jahr,
    abschluss_kilometerstand: abschluss_kilometerstand,
    geschaetzte_laufleistung: geschaetzte_laufleistung,
    betrag: betrag,
    schadensfreiheitsklasse: schadensfreiheitsklasse
  };

  Car.findById({ _id: mongoose.Types.ObjectId(carId) })
    .then(foundCar => {
      if (foundCar !== null) {
        for (let index in foundCar.versicherungsbuch) {
          if (foundCar.versicherungsbuch[index]._id.toString() === insuranceId.toString()) {
            foundCar.versicherungsbuch.splice(index,1,updatedInsurance);
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

//Delete Insurance
/* prefixed with /myaccount/insurance in app.js*/
router.get('/delete', loginCheck(), (req, res, next) => {
  const carId = req.query.carId; //needed to add te insurance to the correct car
  const insuranceId = req.query.insuranceId;

  const loggedUser = req.session.user;

  Car.findById({ _id: mongoose.Types.ObjectId(carId) })
    .then(foundCar => {
      if (foundCar !== null) {
        for (let index in foundCar.versicherungsbuch) {
          if (foundCar.versicherungsbuch[index]._id.toString() === insuranceId.toString()) {
            foundCar.versicherungsbuch.splice(index,1);
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
