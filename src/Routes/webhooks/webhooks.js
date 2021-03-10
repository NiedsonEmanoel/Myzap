const express = require('express');
const Router = express.Router();

Router.post('/dialogflow', require('./dialogflow'));

module.exports = Router;
