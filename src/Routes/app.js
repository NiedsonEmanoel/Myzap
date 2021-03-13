const express = require('express');
const path = require('path');
const baseDir = path.resolve('./', 'Views', 'build');
const app = express.Router();

app.use('/webhook', require('./webhooks/webhooks'));
app.use('/api', require('./apis/api'));

app.use(express.static(`${baseDir}`));
app.get('/*', (req, res) => res.sendFile('index.html', { root: baseDir }))

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        "error": {
            message: error.message
        }
    });
});

module.exports = app;