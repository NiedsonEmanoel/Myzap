const express = require('express');
const Router = express.Router();
const Clients = require('../../../Controllers/clients.controller');

Router.get('/', Clients.index);
Router.get('/details/:_id', Clients.details);

Router.post('/', Clients.create);

Router.put('/:_id', Clients.update);

Router.delete('/:_id', Clients.delete)

module.exports = Router;