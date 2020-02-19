import require from 'superagent';
const express = require('express');

const app = express();

app.get('/location/otherstuff', (req, res) => {
    res.json({
        key: 'value'
    });
});

app.get('*', (req, res) => {
    res.json({
        ohno: '404'
    });
});

app.listen(3000, () => { console.log('running . . .'); });