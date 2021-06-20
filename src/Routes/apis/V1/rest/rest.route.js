const express = require('express');
const Router = express.Router();
const {JwtVerify} = require('../../../../Middlewares')

Router.use(JwtVerify)
Router.use('/workers', require('./workers.route'));
Router.use('/messages', require('./messages.route'));
Router.use('/clients', require('./clients.route'));
Router.use('/credentials', require('./credentials.route'));

module.exports = Router;
