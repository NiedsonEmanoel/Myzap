const express = require('express');
const path = require('path');
const baseDir = path.resolve('./', 'Views', 'build');
const app = express.Router();

app.use('/webhook', require('./webhooks/webhooks'));
app.use('/api', require('./apis/api'));

app.use(express.static(`${baseDir}`))
app.get('/*', (req, res) => res.sendFile('index.html', { root: baseDir }))

module.exports = app;