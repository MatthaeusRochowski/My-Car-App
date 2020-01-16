const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const User = require('../models/user');
const Car = require('../models/car');

const dbName = 'my-car-app'; //check name
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/${dbName}`);  


//USER Seed
let seedUser = 
  {
    "_id": "",
    "email": "muster@web.de",
    "username": "Max Mustermann",
    "password": "mustermuster"
  }

//CAR Seed
const car = 
  {
    "kennzeichen": "IN-A1234",   
    "hersteller": "Honda",
    "modell": "Civic",
    "hsn": "7100",
    "tsn": "ADO",
    "kraftstoff": "Benzin",
    "leistung_ps": 320,
    "erstzulassung_monat": 1,
    "erstzulassung_jahr": 2019,
    "kaufpreis": 29900,
    "kilometerstand_kauf": 9324,
    "kilometerstand_aktuell": 9399,
  
    "fahrtenbuch": [{
      "datum": 20200116,
      "strecke_km": 75,
      "startort": "Händler",
      "zielort": "Werkstatt",
      "kilometerstand_start": 9324,
      "kilometerstand_ende": 9399
    }],
  
    "tankbuch": [{
      "datum": 20200116,
      "kilometerstand": 9325,
      "liter": 35,
      "literpreis": 1.4,
      "betrag": 49
    }], 
  
    "werkstattbuch": [{
      "datum": 20201231,
      "kilometerstand": 9399,
      "reparaturposten": "Durchsicht",
      "betrag": 129.00,
      "rechnungs_url": ""
    }],
  
    "versicherungsbuch": [{
      "name": "R+V",
      "typ": "TK",
      "abschluss_jahr": 2020,
      "abschluss_kilometerstand": 9325,
      "geschaetzte_laufleistung": 10000,
      "versicherungskosten_jahr": 399.39,
      "schadensfreiheitsklasse": 20
    }],
  
    "steuerbuch": [{
      "typ": "kfz-steuer",
      "jahr": 2020,
      "betrag": 201.96
    }],
  
    "eigner_ref": ""
  }


User.findOne({ 'username': seedUser.username })
  .then(foundUser => {
    if (foundUser === null) {
      bcrypt
      .genSalt()
      .then(salt => bcrypt.hash(seedUser.password, salt))
      .then(hash => User.create({email: seedUser.email, password: hash, username: seedUser.username}))
      .then(newUser => {
        console.log('User "' + newUser.username + '" created in DB (' + newUser._id + ').');
        car.eigner_ref = newUser._id;
        Car.findOne({ 'kennzeichen': car.kennzeichen })
        .then(foundCar => {
          if (foundCar === null) {
            Car.create(car)
            .then(newCar => {
              console.log('Car ' + newCar.kennzeichen + ' created in DB (' + newCar._id + ').');
            });
          }
          else {
            console.log('Car: ' + car.kennzeichen + 'is already present in DB.');
          }
        })
      });
    }
    else {
      console.log('User: ' + seedUser.username + 'is already present in DB.');
    }
  });
