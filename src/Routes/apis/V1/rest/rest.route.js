const express = require('express');
const Router = express.Router();
const { JwtVerify } = require('../../../../Middlewares')

Router.use('/workers', JwtVerify, require('./workers.route'));
Router.use('/messages', JwtVerify, require('./messages.route'));
Router.use('/clients', JwtVerify, require('./clients.route'));
Router.use('/credentials', JwtVerify, require('./credentials.route'));

module.exports = Router;
