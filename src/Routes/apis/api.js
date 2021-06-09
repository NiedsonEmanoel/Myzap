const express = require('express');

const api = express.Router();
api.post('/chatbot', require('../../Controllers/botextenal.controler').processMessage)
api.use('/login', require('./rest/login.route'));
api.use('/', require('./rest/rest.route'));
api.use('/whatsapp', require('./venom/venom.route'));

module.exports = api;

