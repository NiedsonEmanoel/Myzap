const express = require('express');
const Router = express.Router();

const { DialogflowTokenVerify } = require('../../Middlewares')

Router.post('/dialogflow', DialogflowTokenVerify, require('./dialogflow'));

module.exports = Router;
