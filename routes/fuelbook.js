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

/* prefixed with /myaccount/fuelbook in app.js*/
//Add fuelbook Entry
router.get('/add/:carId', loginCheck(), (req, res, next) => {
  const carId = req.params.carId;
  const loggedUser = req.session.user;
  const datum = new Date();
  const heute = datum.getFullYear()+"-" + (datum.getMonth()+ 1)+"-" + datum.getDate();
  
  Car.findById({ _id: mongoose.Types.ObjectId(carId) })
  .then(foundCar => {
    let kilometerstand = foundCar.fahrtenbuch[0].kilometerstand_start;
    res.render('car/fuel-add', { user: loggedUser, carId: carId, heute: heute, kilometerstand: kilometerstand} );
  });
});

/* prefixed with /myaccount/fuelbook in app.js*/
router.post('/add/:carId', loginCheck(), (req, res, next) => {
  const carId = req.params.carId;
  const loggedUser = req.session.user;

  const { datum, kilometerstand, liter, literpreis, betrag } = req.body;

  const newFuelbookEntry = {
    datum: datum,
    kilometerstand: kilometerstand,
    liter: liter,
    literpreis: literpreis,
    betrag: betrag,
  };

  Car.findById({ _id: mongoose.Types.ObjectId(carId) })
    .then(foundCar => {
      if (foundCar !== null) {
        foundCar.tankbuch.unshift(newFuelbookEntry);
        foundCar.save();
        res.redirect(`/myaccount/car-details/${foundCar._id}`);
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;