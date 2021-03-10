const express = require('express');
const app = express.Router();

app.post('/dialogflow', require('./webhooks/dialogflow'));

module.exports = app;