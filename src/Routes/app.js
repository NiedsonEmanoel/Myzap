const express = require('express');
const app = express.Router();

app.use('/webhook', require('./webhooks/webhooks'));
app.use('/api', require('./apis/api'));

module.exports = app;