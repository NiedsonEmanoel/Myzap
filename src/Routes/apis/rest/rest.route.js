const express = require('express');
const Router = express.Router();

Router.use('/messages', require('./messages.route'));
//Router.use('/workers');
Router.use('/clients', require('./clients.route'));
//Router.use('/login');

module.exports = Router;
