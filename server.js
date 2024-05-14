var express = require('express');
var app = express();
var fs = require("fs");
const { get } = require('http');
const { send } = require('process');
//const fileName = './weather.json';
//const file = new Object();
var file = {};
file.forcast = {};
file.location = {}; 
file.warning = {};
var gridX = 0;
var gridY = 0;
var gridID = "AB";
var city = "";
const temp = [];
const timeName = [];
const dew = [];
const shortForcast = [];
const windspeed = [];
const windDirection = [];
const detailedForcast = [];
const humidity = [];
const probOfPer = [];
let zoneIDLink;
var zoneID = "zoneID";


app.get('/', function (req, res) {

   
   console.log(req.query.lat)
   console.log(req.query.lon);
   lat=req.query.lat;
   lon = req.query.lon;
   cordsToGrid();
   

   setTimeout(sendweather, 1000);
  

function sendweather() {
   console.log("sendingweather");
   //console.log('writing to ' + fileName);
   //file.gridX = gridX;
   file.forcast.timeName = timeName;
   file.forcast.temp = temp;
   file.forcast.dew = dew;
   file.forcast.humidity = humidity;
   file.forcast.windspeed = windspeed;
   file.forcast.windDirection = windDirection;
   file.forcast.shortForcast = shortForcast;
   file.forcast.detailedForcast = detailedForcast;
   file.forcast.probOfPer = probOfPer;
   file.location.city = city;
   res.end(JSON.stringify(file));
      console.log("done!");
      clearData();
   
   
}
})



var server = app.listen(5000, function () {
   console.log("Express App running at http://127.0.0.1:5000/");
   console.log("-----------------------------------------geniusServerside weather-----------------------------------------\n")
})



function clearData() {
   console.log("purgeing data...");
   lat = 0;
   lon = 0;
   gridX = 0;
   gridY = 0;
   gridID = 0;
   city = "";
   zoneID = "";
   zoneIDLink = "";
   console.log("done!");
   console.log("-----------------------------------------geniusServerside weather-----------------------------------------\n")
}

function cordsToGrid(){
   // finds the grid cords for US weather forcast

      const url = "https://api.weather.gov/points/"+lat+","+lon;
                       console.log("calculating location using"+url);
                       
                       fetch(url, {
                           headers: {
                               //'User-Agent': 'Mozilla/5.0',
                           },
                       })
                       
                       .then((response) => response.json())
                       
                       .then((data) => {
                        gridX = data.properties.gridX;
                        gridY = data.properties.gridY;
                        gridID = data.properties.gridId;
                        city = data.properties.relativeLocation.properties.city;
                        zoneIDlink = data.properties.forecastZone;
                          
                          getForcast();
                          getZoneID();
                       })
   
                       .catch((error) => {
                           console.error('Error:', error);
                       });
   
   console.log("done!")
}
function getForcast() {
   
   const url = "https://api.weather.gov/gridpoints/"+gridID+"/"+gridX+","+gridY+"/forecast?";
                       console.log("getting forcast using "+url);
                       
                       fetch(url, {
                           headers: {
                               //'User-Agent': 'Mozilla/5.0',
                           },
                       })
                       
                       .then((response) => response.json())
                       
                       .then((data) => {
                          for (let i = 0; i < 13; i++){
                             timeName[i] = data.properties.periods[i].name;
                             temp[i] = data.properties.periods[i].temperature;
                             dew[i] = data.properties.periods[i].dewpoint.value;
                             humidity[i] = data.properties.periods[i].relativeHumidity.value;
                             windspeed[i] = data.properties.periods[i].windSpeed;
                             windDirection[i] = data.properties.periods[i].windDirection;
                             shortForcast[i] = data.properties.periods[i].shortForecast;
                             detailedForcast[i] = data.properties.periods[i].detailedForecast;
                             probOfPer[i] = data.properties.periods[i].probabilityOfPrecipitation.value;
                             
                             
                             
                          }
                          
                       })
   
                       .catch((error) => {
                           console.error('Error:', error);
                       });
   console.log("done!")
}
function getWarnings() {
   
   const url = "https://api.weather.gov/alerts/active/zone/"+zoneID;
                       console.log("getting warnings useing "+url);
                       
                       fetch(url, {
                           headers: {
                               //'User-Agent': 'Mozilla/5.0',
                           },
                       })
                       
                       .then((response) => response.json())
                       
                       .then((data) => {
                         
                       })
   
                       .catch((error) => {
                           console.error('Error:', error);
                       });
   console.log("done!")
}
function getZoneID(){
   const url2 = zoneIDlink;
                       console.log("calculating zoneID using"+url2);
                       
                       fetch(url2, {
                           headers: {
                               //'User-Agent': 'Mozilla/5.0',
                           },
                       })
                       
                       .then((response) => response.json())
                       
                       .then((data) => {
                          zoneID = data.properties.id;

                          getForcast();
                       })
   
                       .catch((error) => {
                           console.error('Error:', error);
                       });
   getWarnings();
}