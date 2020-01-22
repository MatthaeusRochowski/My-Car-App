const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
  kennzeichen: { type: String, unique: true }, //IN12345
  hersteller: { type: String }, //Honda
  modell: { type: String }, //Civic 1.8
  hsn: { type: String, minLength: 4, maxLength: 4 }, //Herstellerschlüsselnummer (2131, full 4 digits) (check for number in form)
  tsn: { type: String, minLength: 3, maxLength: 9 }, //Typschlüsselnummer (AAB, first 3 digits)
  kraftstoff: { type: String  }, //Benzin
  leistung_ps: { type: Number }, //140
  erstzulassung_monat: { type: Number }, //1 (Januar)
  erstzulassung_jahr: { type: Number }, //2020
  kauf_jahr: { type: Number }, //2020
  kaufpreis: { type: Number }, //15000
  kilometerstand_kauf: { type: Number }, //0
  kilometerstand_aktuell: { type: Number }, //12000 (updated by most recent kilometerstand_ende)
  bild:                   { type: String }, //http://cloudinary....
  kilometerkosten:        { type: Number }, //experimental

  fahrtenbuch: [
    {
      datum: { type: String }, //2020-12-31
      strecke_km: { type: Number }, //50 (will be calculated kilometerstandende - kilometerstand_start)
      startort: { type: String }, //zuhause
      zielort: { type: String }, //arbeit
      kilometerstand_start: { type: Number }, //12000 (defaulted to kilometerstand_aktuell)
      kilometerstand_ende: { type: Number } //12050
    }
  ],

  tankbuch: [
    {
      datum: { type: String }, //2020-12-31
      kilometerstand: { type: Number }, //12025
      liter: { type: Number }, //35
      literpreis: { type: Number }, //1.4
      betrag: { type: Number } //49 (liter * literpreis)
    }
  ],

  werkstattbuch: [
    {
      datum: { type: String }, //2020-12-31
      kilometerstand: { type: Number }, //12040
      reparaturposten: { type: String }, //Keilriemen
      betrag: { type: Number }, //230
      rechnungs_url: { type: String } //http://cloundinary/user/....
    }
  ],

  versicherungsbuch: [
    {
      name: { type: String }, //HanseMerkur
      typ: { type: String }, //VK, TK, HF
      jahr: { type: Number }, //2020 (initial insurance abschluss_monat = erstzulassung_monat)
      abschluss_kilometerstand: { type: Number }, //12000
      geschaetzte_laufleistung: { type: Number }, //10000
      betrag: { type: Number }, //600
      schadensfreiheitsklasse: { type: Number } //18 (belongs to user and insurer)
    }
  ],

  steuerbuch: [
    {
      typ: { type: String }, //kfz-steuer
      jahr: { type: Number }, //2020
      betrag: { type: Number } //50.00
    }
  ],

  eigner_ref: { type: Schema.Types.ObjectId, ref: "User" }
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
