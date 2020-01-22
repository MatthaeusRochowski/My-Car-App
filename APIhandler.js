const axios = require("axios");

class APIHandler {
  constructor(){}
  getGeoCoords(locationZipCode){
      //Example: https://geocode.xyz/Hauptstr.,+57632+Berzhausen?json=1
      return axios.get("https://geocode.xyz/" + locationZipCode + "+DE?json=1")
      .then(response => response.data)
  }
  getFuelStations(latitude, longitude, fuelApiKey){
    //Example: https://creativecommons.tankerkoenig.de/json/list.php?lat=52.52099975265203&lng=13.43803882598877&rad=5&sort=dist&type=all&apikey=your-api-key
    return axios.get("https://creativecommons.tankerkoenig.de/json/list.php?lat=" + latitude + "&lng=" + longitude + "&rad=5&sort=dist&type=all&apikey=" + fuelApiKey)
    .then(response => response.data)
  }
}

module.exports = APIHandler;
