const express = require('express');
const request = require('superagent');
const data = require('./geo.js');
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

app.get('*', (req, res) => {
    res.json({
        error: '404 page not found'
    });
});

app.listen(3000, () => { console.log('running . . .'); })