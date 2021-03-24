const express = require('express');
const api = express.Router();
const jwtPasser = require('../../Middlewares/verify')

api.use('/login', require('./rest/login.route'));
api.use('/', jwtPasser, require('./rest/rest.route'));
api.use('/whatsapp', require('./venom/venom.route'));

module.exports = api;

