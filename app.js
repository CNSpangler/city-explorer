const express = require('express');
// const request = require('superagent');
const cors = require('cors');
const data = require('./geo.js');
const weather = require('./darksky.js');
const app = express();

app.use(cors());
app.get('/', (req, res) => res.send('Welcome to City Explorer!'));

let lat;
let lng;

// app.get('define the path', (req is what the user requests, res is what we send back))
app.get('/location', (req, res) => {
    const location = request.query.search;
    const cityData = data.results[0];

    lat = cityData.geometry.location.lat,
    lng = cityData.geometry.location.lng

    res.json({
        formatted_query: cityData.formatted_address,
        latitude: cityData.geometry.location.lat,
        longitude: cityData.geometry.location.lng
    });
});

const getWeatherData = (lat, lng) => {
    return weather.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000),
        }
    })
};

app.get('/weather', (req, res) => {
    const portlandWeather = getWeatherData(lat, lng);
    res.json(portlandWeather);
});

app.get('*', (req, res) => {
    res.json({
        error: '404 page not found'
    });
});

module.exports = {
    app: app,
};