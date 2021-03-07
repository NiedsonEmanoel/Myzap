const express = require('express');
const app = express.Router();

app.use('/dialogflow', require('./webhooks/dialogflow'));

module.exports = app;