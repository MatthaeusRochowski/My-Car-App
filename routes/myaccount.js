// Routes to protected car pages -> crud
const express = require('express');
const router  = express.Router();
const Car = require('../models/car');


/*  */
const loginCheck = () => {
  return (req, res, next) => 
    (req.session.user ? next () : res.redirect('/'));
};

router.get('/myaccount', loginCheck(), (req, res) => {
  const loggedUser = req.session.user;
  res.render('auth/myaccount', { user: loggedUser});
});

router.get('/home-main', loginCheck(), (req,res) => {
  const loggedUser = req.session.user;
  res.render('auth/home-main', {user: loggedUser});
});


router.get('/car-add', loginCheck(), (req,res) => {
  const loggedUser = req.session.user;
  res.render('car/car-add', {user: loggedUser});
});

router.post('/car-add', loginCheck(), (req, res, next) => {
  const loggedUser = req.session.user;
  //console.log(loggedUser);
  const eigner_ref = loggedUser._id;
  const {kennzeichen, hersteller, modell, hsn, tsn, 
    kraftstoff, leistung_ps, erstzulassung_monat, 
    erstzulassung_jahr, kaufpreis, kilometerstand_kauf} = req.body;

  Car.create({kennzeichen, hersteller, modell, hsn, tsn, 
    kraftstoff, leistung_ps, erstzulassung_monat, 
    erstzulassung_jahr, kaufpreis, kilometerstand_kauf, eigner_ref}).then(() => {
      res.render('auth/myaccount', {user: loggedUser});
    })
      .catch(err => {
        next(err);
      });
});


module.exports = router;