// Routes to protected car pages -> crud
const express = require("express");
const router = express.Router();
const Car = require("../models/car");
const mongoose = require("mongoose");
//const multer = require("multer");
const APIHandler = require("../APIhandler");
const outerAPIs = new APIHandler(); 

const uploadCloud = require("../config/cloudinary.js");
//const upload = multer({ dest: './public/upload/' });

/*  */
const loginCheck = () => {
  return (req, res, next) => (req.session.user ? next() : res.redirect("/"));
};

function costPerKm (car) {
  //START: BOOK ENTRIES ----------------------------------------------------
  //sum up costs and km (logbook) of all books
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
  //console.log(fahrtenbuchKm);
  for (let fuel of car.tankbuch) {
    if (!isNaN(fuel.betrag)) {
      tankbuchSum += fuel.betrag;
    }
  }
  //console.log(tankbuchSum);
  for (let service of car.werkstattbuch) {
    if (!isNaN(service.betrag)) {
      werkstattbuchSum += service.betrag;
    }
  }
  //console.log(werkstattbuchSum);
  for (let insure of car.versicherungsbuch) {
    if (!isNaN(insure.betrag)) {
      versicherungsbuchSum += insure.betrag;
    }
  }
  //console.log(versicherungsbuchSum);
  for (let tax of car.steuerbuch) {
    if (!isNaN(tax.betrag)) {
      steuerbuchSum += tax.betrag;
    }
  }
  console.log(steuerbuchSum); 
  //END: BOOK ENTRIES ----------------------------------------------------
  
  //START: VALUE LOSS ----------------------------------------------------
  //calcualte value loss per distance travelled in km and car ownership in years
  //value loss by km 15km / year: 1y = 25%, following years +5%, some increments in later years
  //alternatively by the age of the car: 1y = 30%, following years 5%  
  const valueLossThumbRuleKmArr = [0,25,30,35,40,45,50,55,60,67,74,81,89,90];
  const valueLossThumbRuleAgeArr = [0,30,35,40,45,50,55,60,65,70,75,80,85,90];
  const datum = new Date();
  const heute = datum.getFullYear();

  //ageFull = car age independent of ownership
  //ageOwned = car ownership years
  //incorrect data (negative values) is reverted to positive values
  let ageFull = Math.abs(heute - car.erstzulassung_jahr);
  //console.log("ageFullOrg: " + ageFull);
  let ageOwned = Math.abs(heute - car.kauf_jahr);
  //console.log("ageOwnedOrg: " + ageOwned);
 
  //factor determination: driven km versus value loss via reference arr (km)
  //positioned here as ageOwned is recalculated for some circumstances below
  let valueLossKmFactor = (15000*ageOwned)/fahrtenbuchKm;
  //console.log(fahrtenbuchKm + " " + (15000*ageOwned));

  let deltaAge = 0;
  //always ensures we keep the index within the boundaries of the smallest reference array
  //if ageFull is longer than value are in reference array -> reset ageFull to max reference array length
  if (((ageFull) > valueLossThumbRuleKmArr.length-1)||((ageFull) > valueLossThumbRuleAgeArr.length-1)){
    if (valueLossThumbRuleKmArr.length >= valueLossThumbRuleAgeArr.length){
      //console.log("arrLength: " + (valueLossThumbRuleAgeArr.length-1));
      deltaAge = (ageFull - (valueLossThumbRuleAgeArr.length-1)); //20 - 13 = 7   also
      //console.log("deltaAge: " + deltaAge);
      if (deltaAge >= ageOwned) { //7 >= 2   (1 >= 2)    7 >= 10
        ageOwned = 0; //0
      }
      else {
        ageOwned -= deltaAge; //1 10-7 = 3
      }
      ageFull = valueLossThumbRuleAgeArr.length-1;
    }
    else {
      deltaAge = (ageFull - (valueLossThumbRuleKmArr.length-1)); //20 - 13 = 7
      if (deltaAge >= ageOwned) { //7 >= 2   (1 >= 2)
        ageOwned = 0; //0
      }
      else {
        ageOwned -= deltaAge; //1
      }
      ageFull = valueLossThumbRuleKmArr.length-1;
    }
  }
  //if ageOwned is longer than value are in reference array -> reset both age values to max reference array length 
  else if (((ageOwned) > valueLossThumbRuleKmArr.length-1)||((ageOwned) > valueLossThumbRuleAgeArr.length-1)){
    ageOwned = 0;
  }
  //console.log("ageFullFinal: " + ageFull);
  //console.log("ageOwnedFinal: " + ageOwned);
  
  //determine value loss of car ownership or km distance driven by owner
  let deltaLossKm = Math.abs(valueLossThumbRuleKmArr[ageFull] - valueLossThumbRuleKmArr[ageFull - ageOwned])/valueLossKmFactor;
  //console.log("deltaLossKm: " + deltaLossKm);
  let deltaLossAge = Math.abs(valueLossThumbRuleAgeArr[ageFull] - valueLossThumbRuleAgeArr[ageFull - ageOwned]);
  //console.log("deltaLossAge: " + deltaLossAge);
  let wertverlust = 0;
  //console.log("deltaLossKm: " + deltaLossKm + " deltaLossAge: " + deltaLossAge);
  if (deltaLossKm >= deltaLossAge){
    wertverlust = Math.round(car.kaufpreis*deltaLossKm/10000)*100; //round to full 100€
  }
  else {
    wertverlust = Math.round(car.kaufpreis*deltaLossAge/10000)*100;
  }
  //console.log("kaufpreis: " + car.kaufpreis + " wertverlust: " + wertverlust + " deltaLossKm: " + deltaLossKm + " deltaLossAge: " + deltaLossAge);

  //sum-up all information about value loss
  wertverlust += (tankbuchSum+werkstattbuchSum+versicherungsbuchSum+steuerbuchSum);
  //END: VALUE LOSS ------------------------------------------------------

  if ((fahrtenbuchKm > 0)&&(wertverlust > 0)) {
    car.kilometerkosten = Math.round((wertverlust/fahrtenbuchKm)*100)/100;
  }
  else {
    car.kilometerkosten = 0;
  }
  return car;
};

router.get("/myaccount/car-details/:id", loginCheck(), (req, res, next) => {
  const loggedUser = req.session.user;
  Car.findById(req.params.id)
    .then(theCar => {
      theCar.save();
      res.render("car/car-details", { user: loggedUser, car: theCar });
    });
});

router.get("/myaccount", loginCheck(), (req, res, next) => {
  const loggedUser = req.session.user;
  Car.find({ eigner_ref: mongoose.Types.ObjectId(loggedUser._id) })
    .populate("eigner_ref")
    .then(myCars => {
      for (let car of myCars) {
        car = costPerKm(car);
        car.save();
      }
      res.render("auth/myaccount", { user: loggedUser, car: myCars });
    })
    .catch(err => next(err));
});

router.get("/home-main", loginCheck(), (req, res) => {
  const loggedUser = req.session.user;
  const fuelAPIKey = process.env.FUEL_API_KEY;
  res.render("auth/home-main", { user: loggedUser, fuelAPIKey: fuelAPIKey });
});

router.get("/car-add", loginCheck(), (req, res) => {
  const loggedUser = req.session.user;
  res.render("car/car-add", { user: loggedUser });
});

router.post("/car-add", [uploadCloud.single("autobild"), loginCheck()], (req, res, next) => {
    const loggedUser = req.session.user;
    //console.log(loggedUser);
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
      kauf_jahr,
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
      kauf_jahr,
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
router.post("/edit/:carId", loginCheck(), (req, res, next) => {
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
    kilometerstand_aktuell
  };

  Car.findByIdAndUpdate(carId, updatedCarDetails)
    .then(() => {
      res.redirect(`/myaccount/car-details/${carId}`);
    })
    .catch(err => {
      next(err);
    });
});

//Change car picture
router.post(
  "/newpicture/:carId",
  [uploadCloud.single("autobild"), loginCheck()],
  (req, res, next) => {
    const carId = req.params.carId;
    console.log("inside newpicture route");

    const updatedCarDetails = {
      bild: req.file.url
    };

    console.log("Mein Autobild ", updatedCarDetails);
    
    Car.findByIdAndUpdate(carId, updatedCarDetails)
      .then(() => {
        res.redirect(`/myaccount/car-details/${carId}`);
      })
      .catch(err => {
        next(err);
      });
  }
);

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

router.get("/myaccount/fuelstations", loginCheck(), /*async*/ (req, res, next) => {
  const loggedUser = req.session.user;
  const plz = req.query.plz;
  let geoResult = {};
  const fuelAPIKey = process.env.FUEL_API_KEY;
  let fuelStationResult = {};

  //Test mode true: no fuel API is called as the APIkey could be banned; false fuel API is called
  let testSwitch = true;

  outerAPIs.getGeoCoords(plz)
  .then(coords => {
    geoResult = coords;
    if (!testSwitch) { 
      outerAPIs.getFuelStations(geoResult.latt, geoResult.longt, fuelAPIKey)
      .then(fuelstations => {
        fuelStationResult = fuelstations;
        res.render("auth/home-main", { user: loggedUser, fuelAPIKey: fuelAPIKey, plz: plz, longitude: geoResult.longt, latitude: geoResult.latt, fuelStationResult: fuelStationResult });
      })
    }
    else {
      //taking test data for fuel stations (not risking API key)
      console.log('taking test data for fuel stations');
      fuelStationResult = {ok: true,license: "CC BY 4.0 - https://creativecommons.tankerkoenig.de",data: "MTS-K",status: "ok",stations: [{id: "9630e035-bfa7-4abc-aec6-d9042eb43a66",name: "Esso Tankstelle",brand: "ESSO",street: "MUENCHENER STR. 203",place: "NEUBURG",lat: 48.724312,lng: 11.207088,dist: 1.2,diesel: 1.259,e5: 1.409,e10: 1.429,isOpen: true,houseNumber: "",postCode: 86633},{id: "51d4b48b-a095-1aa0-e100-80009459e03a",name: "JET NEUBURG INGOLSTAEDTER STR. 30",brand: "JET",street: "INGOLSTAEDTER STR. 30",place: "NEUBURG",lat: 48.7428,lng: 11.183,dist: 1.5,diesel: 1.249,e5: 1.399,e10: 1.389,isOpen: true,houseNumber: "",postCode: 86633},{id: "97dece63-5d5e-45a7-bed6-805c00536429",name: "Pinoil",brand: "Pinoil",street: "Ingolstädter Straße",place: "Neuburg",lat: 48.74275,lng: 11.1824274,dist: 1.6,diesel: 1.289,e5: 1.439,e10: 1.429,isOpen: true,houseNumber: "31",postCode: 86633},{id: "4028ea62-94b9-4621-a983-78af9e927991",name: "BayWa Tankstelle Neuburg an der Donau",brand: "BayWa",street: "Augsburger Str.",place: "Neuburg an der Donau",lat: 48.732132,lng: 11.176332,dist: 1.7,diesel: 1.249,e5: 1.399,e10: 1.399,isOpen: true,houseNumber: "132",postCode: 86633},{id: "a76320c8-64a1-4b4a-8be8-ff90e56a30da",name: "NEUBURG/DONAU - AUGSBURGER STR.",brand: "Agip",street: "Augsburger Strasse",place: "Neuburg / Donau",lat: 48.72443,lng: 11.17728,dist: 1.9,diesel: 1.259,e5: 1.409,e10: 1.399,isOpen: true,houseNumber: "133",postCode: 86633},{id: "f56af7b0-c79c-45a2-a876-8fcfc33293c7",name: "Pinoil",brand: "Pinoil",street: "Donauwörther Straße",place: "Neuburg",lat: 48.73356,lng: 11.1671114,dist: 2.3,diesel: 1.289,e5: 1.439,e10: 1.429,isOpen: true,houseNumber: "62",postCode: 86633},{id: "4147006d-1bbd-4b8e-8749-5a6777fc043c",name: "Aral Tankstelle",brand: "ARAL",street: "Am Südpark",place: "Neuburg",lat: 48.72019,lng: 11.172039,dist: 2.5,diesel: 1.299,e5: 1.439,e10: 1.429,isOpen: true,houseNumber: "2",postCode: 86633},{id: "00061195-0001-4444-8888-acdc00000001",name: "Wittmann Oil",brand: "Wittmann Oil",street: "Sehensander Weg",place: "Neuburg",lat: 48.722869873047,lng: 11.168399810791,dist: 2.5,diesel: 1.249,e5: null,e10: null,isOpen: true,houseNumber: "25",postCode: 86633}]};
      res.render("auth/home-main", { user: loggedUser, fuelAPIKey: fuelAPIKey, plz: plz, longitude: geoResult.longt, latitude: geoResult.latt, fuelStationResult: fuelStationResult });
    }
  })
  .catch(error => {
    next(error);
  });
});

module.exports = router;
