const express = require('express');
const request = require('superagent');
const data = require('./geo.js');
const weather = require('./darksky.js');
const app = express();

// app.get('define the path', (req is what the user requests, res is what we send back))
app.get('/location', (req, res) => {
    const cityData = data.results[0];

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
            time: Date(forecast.time),
        }
    })
}

app.get('/weather', (req, res) => {
    const portlandWeather = getWeatherData(/*lat, lng*/);
    res.json({
        portlandWeather
    });
})

app.get('*', (req, res) => {
    res.json({
        error: '404 page not found'
    });
});

app.listen(3000, () => { console.log('running . . .'); })