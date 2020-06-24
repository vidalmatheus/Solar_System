const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('./'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.listen(port, () => console.log(`Listening on port ${port}`));