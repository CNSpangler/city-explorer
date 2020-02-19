require('dotenv').confit()
const express = require('express');
const cors = require('cors');
const data = require('./geo.js');
const weather = require('./darksky.js');
const app = express();

app.use(cors());
app.get('/', (req, res) => res.send('Welcome to City Explorer!'));

let lat;
let lng;

// app.get('define the path', (req is what the user requests, res is what we send back))
app.get('/location', async(req, res) => {
    // try...catch for error handling
    try {
        // location is the result of a user query
        const location = request.query.search;

        // sample url from API docs; make the key into template literal for key hidden in .env file so it doesn't go public; make location the template literal for location we defined above as search query
        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${location}&format=json`;

        // request the url from the API
        const cityData = await request.get(URL);
        // define first result as the first item in the API's data array--we use it below in res.json
        const firstResult = cityData.body[0];

        // update global state of lat and lng to make accessible outside the scope of this fetch
        lat = firstResult.lat,
        lng = firstResult.lng

        res.json({
            formatted_query: firstResult.display_name,
            latitude: lat,
            longitude: lng
        });
    } catch (err) {
        next(err);
    }
});

// const getWeatherData = async(lat, lng) => {
//     try {
//         return weather.daily.data.map(forecast => {
//             return {
//                 forecast: forecast.summary,
//                 time: new Date(forecast.time * 1000),
//             }
//         })
//     } catch (err) {
//         next(err);
//     }
// };

// app.get('/weather', (req, res) => {
//     const portlandWeather = getWeatherData(lat, lng);
//     res.json(portlandWeather);
// });

app.get('*', (req, res) => {
    res.json({
        error: '404 page not found'
    });
});

module.exports = {
    app: app,
};