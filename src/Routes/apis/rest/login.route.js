const express = require('express');
const Router = express.Router();
const Workers = require('../../../Controllers/worker.controller');

Router.post('/create.recovery', Workers.createTokenToRecover);
Router.post('/change.recovery', Workers.changePasswordByToken);
Router.post('/', Workers.login);
Router.get('/checktoken/:token', Workers.checkToken);
Router.get('/destroytoken/:token', Workers.destroyToken);

module.exports = Router;

