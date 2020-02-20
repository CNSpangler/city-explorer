require('dotenv').config();
const express = require('express');
const cors = require('cors');
const request = require('superagent');
const app = express();

app.use(cors());
app.get('/', (req, res) => res.send('Welcome to City Explorer!'));

let lat;
let lng;

// app.get('define the path', (req is what the user requests, res is what we send back))
app.get('/location', async(req, res, next) => {
    // try...catch for error handling
    try {
        // location is the result of a user query
        const location = req.query.search;

        // sample url from API docs; make the key into template literal for key hidden in .env file so it doesn't go public; make location the template literal for location we defined above as search query
        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${location}&format=json`;

        // request the url from the API
        const cityData = await request.get(URL);
        // define first result as the first item in the API's data array--we use it below in res.json
        const firstResult = cityData.body[0];

        // update global state of lat and lng to make accessible outside the scope of this fetch
        lat = firstResult.lat,
        lng = firstResult.lon

        // define format of data to return to the user
        res.json({
            formatted_query: firstResult.display_name,
            latitude: lat,
            longitude: lng
        });
    } catch (err) {
        next(err);
    }
});

const getWeatherData = async(lat, lng) => {
    const URL = `https://api.darksky.net/forecast/key=${process.env.DARKSKY_API_KEY}/${lat},${lng}`
    console.log(URL);
    const weather = await request.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lng}`);
    
    return weather.body.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time),
        }
    })
};

app.get('/weather', async(req, res, next) => {
    try {
        const thisWeather = await getWeatherData(lat, lng);
        res.json(thisWeather);
    } catch (err) {
        next(err);
    }
});

const getYelpData = async(lat, lng) => {
    const yelp = await request
        .get(`https://api.yelp.com/v3/businesses/search?term=restaurants&location="${lat}","${lng}"`)
        .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);
    
    return yelp.body.businesses.map(restaurant => {
        console.log(restaurant.name);
        return {
            name: restaurant.name,
            image_url: restaurant.image_url,
            price: restaurant.price,
            rating: restaurant.rating,
            url: restaurant.url,
        }
    })
}

app.get('/yelp', async(req, res, next) => {
    try {
        res.json(await getYelpData(lat, lng));
    } catch (err) {
        next(err);
    }
});

const getEventData = async(lat, lng) => {
    const URL = `http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_API_KEY}&where=${lat},${lng}&within=25&page_size=20&page_number=1`;
    const eventData = await request.get(URL);
    const parsedEventData = JSON.parse(eventData.text);
    
    return parsedEventData.events.event.map(event => {
        return {
            link: event.url,
            name: event.title,
            event_date: event.start_time,
            venue: event.venue_name,
        }
    })
};

app.get('/events', async(req, res, next) => {
    try {
    const nearbyEvents = await getEventData(lat, lng);
        res.json(nearbyEvents);
    } catch (err) {
        next(err);
    }
});



const getTrailsData = async(lat, lng) => {
    const URL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lng}&maxDistance=25&key=${process.env.TRAILS_API_KEY}`;
    console.log(URL);
    const trails = await request.get(URL);
    console.log(trails);
    
    return trails.body.trails.map(trail => {
        return {
            name: trail.name,
            location: trail.location,
            length: trail['length'],
            stars: trail.stars,
            star_votes: trail.starVotes,
            summary: trail.summary,
            trail_url: trail.url,
            conditions: trail.conditionStatus,
            condition_date: trail.conditionDate.substring(0,9),
            condition_time: trail.conditionDate.substring(11,18),
        }
    })
};

app.get('/trails', async(req, res, next) => {
    try {
        const nearbyTrails = await getTrailsData(lat, lng);
        res.json(nearbyTrails);
    } catch (err) {
        next(err);
    }
});



app.get('*', (req, res) => {
    res.json({
        error: 'Something went wrong!',
        status: 500
    });
});

module.exports = {
    app: app,
};