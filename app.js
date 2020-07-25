const express = require('express');
const app = express();
const port = 4000;

app.use(express.static('./'));

app.get('/hubble', (req, res) => {
    res.sendFile('hubble.html', { root: __dirname });
});

app.get('/cassini', (req, res) => {
    res.sendFile('cassini.html', { root: __dirname });
});

app.get('/iss', (req, res) => {
    res.sendFile('iss.html', { root: __dirname });
});

app.get('/newHorizons', (req, res) => {
    res.sendFile('newHorizons.html', { root: __dirname });
});

app.get('/voyager', (req, res) => {
    res.sendFile('voyager.html', { root: __dirname });
});

app.listen(port, () => console.log(`Listening on port http://localhost:${port}`));
