const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const carSchema = new Schema({
  kennzeichen:            { type: String }, //IN12345   
  hersteller:             { type: String }, //Honda
  modell:                 { type: String }, //Civic 1.8
  hsn:                    { type: String }, //evtl Number   //Herstellerschlüsselnummer (2131, full 4 digits)
  tsn:                    { type: String }, //Typschlüsselnummer (AAB, first 3 digits)
  kraftstoff:             { type: String }, //Benzin
  leistung_ps:            { type: Number }, //140
  kaufpreis:              { type: Number }, //15000
  kilometerstand_kauf:    { type: Number }, //0
  kilometerstand_aktuell: { type: Number }, //12000

  eigner_ref:        { type: Schema.Types.ObjectId, ref: 'User' }, //check with anastasia
  logbuch_ref:      [{ type: Schema.Types.ObjectId, ref: 'Logbuch' }],
  werkstatt_ref:    [{ type: Schema.Types.ObjectId, ref: 'Werkstatt' }],
  versicherung_ref: [{ type: Schema.Types.ObjectId, ref: 'Versicherung' }]
  })

  const Car = mongoose.model("Car", carSchema);

  module.exports = Car;
