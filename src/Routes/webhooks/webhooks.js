const express = require('express');
const Router = express.Router();

const { DialogflowTokenVerify } = require('../../Middlewares')

Router.post('/dialogflow', DialogflowTokenVerify, require('./dialogflow'));
Router.post('/chatbot', require('../../Controllers/botextenal.controler').processMessage)

module.exports = Router;
