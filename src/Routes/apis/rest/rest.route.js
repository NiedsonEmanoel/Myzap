const express = require('express');
const Router = express.Router();
const jwtPasser = require('../../../Middlewares/verify')


Router.use('/messages', jwtPasser, require('./messages.route'));
Router.use('/workers', require('./workers.route'));
Router.use('/clients', jwtPasser, require('./clients.route'));

module.exports = Router;
