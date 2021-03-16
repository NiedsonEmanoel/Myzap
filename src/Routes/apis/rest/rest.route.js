const express = require('express');
const Router = express.Router();

Router.use('/messages', require('./messages.route'));
Router.use('/workers', require('./workers.route'));
Router.use('/clients', require('./clients.route'));
Router.use('/login', require('./login.route'));

module.exports = Router;
