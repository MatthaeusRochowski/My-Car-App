const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const carSchema = new Schema({
  kennzeichen:            { type: String, unique: true }, //IN12345   
  hersteller:             { type: String, enum: ['9ff','Abarth','AC','ACM','Acura','Aixam','Alpha Romeo','Alpina','Alpine','Amphicar','Ariel Motor','Artega','Aspid','Aston Martin','Audi','Austin','Autobianchi','Auverland','Baic','Bedford','Bellier','Bentley','BMW','Bolloré','Borgward','Brilliance','Bugatti','Buick','BYD','Cadillac','Caravans-Wohnm','Casalini','Caterham','Changhe','Chatenet','Chery','Chevrolet','Chrysler','Citroen','CityEL','CMC','Corvette','Cupra','Dacia','Daewoo','DAF','Daihatsu','Daimler','Dangel','De la Chapelle','De Tomaso','Derways','DFSK','Dodge','Donkerfoort','DR Motor','DS Automobiles','Dutton','e.GO','Estrima','Ferrari','Fiat','FISKER','Ford','Gac Gonow','Galloper','GAZ','Geely','GEM','GEMBALLA','Gillet','Giotti Victoria','GMC','Goupil','Great Wall','Grecav','Haima','Hamann','Haval','Honda','HUMMER','Hurtan','Hyundai','Infinity','Innocenti','Iso Rivolta','Isuzu','Iveco','IZH','Jaguar','Jeep','Karabag','Kia','Koenigsegg','KTM','Lada','Lamborghini','Lancia','Land Rover','LDV','Lexus','Lifan','Ligier','Lincoln','Lotus','Mahindra','MAN','Mansory','Martin Motors','Maserati','Maxus','Maybach','Mazda','McLaren','Melex','Mercedes-Benz','MG','Microcar','Miniauto','MINI','Mitsubishi','Mitsuoka','Morgan','Moskvich','MP Lafer','MPM Motors','Nissan','Oldsmobile','Oldtimer','Opel','Pagani','Panther Westwinds','Peugeot','PGO','Piaggio','Plymouth','Polestar','Pontiac','Porsche','Proton','Puch','Qoros','Rivale','RAM','Regis','Reliant','Renault','Rolls-Royce','Rover','Ruf','Saab','Santaner','Savel','SEAT','Shuanghuan','Skoda','smart','SpeedArt','Spyker','SsandYoug','StreetScooter','Subaru','Suzuki','TagAZ','Talbot','Tasso','Tata','Tazzari EV','TECHART','Tesla','Town Life','Toyota','Trabant','Trailer-Anhänger','Triumph','Trucks-Lkw','TWR','UAZ','Vanderhall','VAZ','VEM','Volkswagen','Volvo','Wallys','Wartburg','Westfield','Wiesmann','Zastava','ZAZ','Zhidou','Zotye','Other']}, //Honda
  modell:                 { type: String }, //Civic 1.8
  hsn:                    { type: String, minLength: 4, maxLength: 4 }, //Herstellerschlüsselnummer (2131, full 4 digits) (check for number in form)
  tsn:                    { type: String, minLength: 3, maxLength: 9 }, //Typschlüsselnummer (AAB, first 3 digits)
  kraftstoff:             { type: String, enum: ['Benzin', 'Diesel', 'Gas', 'Strom', 'Other'] }, //Benzin
  leistung_ps:            { type: Number }, //140
  erstzulassung_monat:    { type: Number }, //1 (Januar)
  erstzulassung_jahr:     { type: Number, min: 1900 }, //2020
  kaufpreis:              { type: Number }, //15000
  kilometerstand_kauf:    { type: Number, min: 0 }, //0
  kilometerstand_aktuell: { type: Number }, //12000 (updated by most recent kilometerstand_ende)

  fahrtenbuch: [{
    datum:                { type: Number }, //20201231
    strecke_km:           { type: Number }, //50 (will be calculated kilometerstandende - kilometerstand_start)
    startort:             { type: String }, //zuhause
    zielort:              { type: String }, //arbeit
    kilometerstand_start: { type: Number }, //12000 (defaulted to kilometerstand_aktuell)
    kilometerstand_ende:  { type: Number }  //12050
  }],

  tankbuch: [{
    datum:          { type: Number }, //20201231
    kilometerstand: { type: Number }, //12025
    liter:          { type: Number }, //35
    literpreis:     { type: Number }, //1.4
    betrag:         { type: Number }  //49 (liter * literpreis)
  }], 

  werkstattbuch: [{
    datum:           { type: Number }, //20201231
    kilometerstand:  { type: Number }, //12040
    reparaturposten: { type: String }, //Keilriemen
    betrag:          { type: Number }, //230
    rechnungs_url:   { type: String }  //http://cloundinary/user/....
  }],

  versicherungsbuch: [{
    name:                     { type: String }, //HanseMerkur
    typ:                      { type: String, enum: ['VK','TK','HF'] }, //VK, TK, HF
    abschluss_jahr:           { type: Number }, //2020 (initial insurance abschluss_monat = erstzulassung_monat)
    abschluss_kilometerstand: { type: Number }, //12000
    geschaetzte_laufleistung: { type: Number }, //10000
    betrag:                   { type: Number }, //600
    schadensfreiheitsklasse:  { type: Number }  //18 (belongs to user and insurer)
  }],

  steuerbuch: [{
    typ:    { type: String }, //kfz-steuer
    jahr:   { type: Number, min: 1900 }, //2020
    betrag: { type: Number }  //50.00
  }],

  eigner_ref: { type: Schema.Types.ObjectId, ref: 'User' }
})

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
