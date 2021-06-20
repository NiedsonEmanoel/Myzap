const express = require('express');
const Router = express.Router();
const Clients = require('../../../../Controllers/clients.controller');
const Avaliations = require('../../../../Controllers/avaliations.controller')

Router.get('/', Clients.index);
Router.get('/attendance', Clients.getAttendace);
Router.get('/details/:_id', Clients.details);

Router.get('/avaliations', Avaliations.indexAv);
Router.get('/avaliations.all', Avaliations.index);
Router.get('/avaliations.graph', Avaliations.medialByDay);
Router.post('/avaliations', Avaliations.createByRoute);

Router.post('/', Clients.create);
Router.put('/update/:_id', Clients.update)
Router.put('/:_id', Clients.switchAt);
Router.patch('/first', Clients.SwitchFist);

Router.patch('/', Clients.togle);

Router.delete('/:_id', Clients.delete)

module.exports = Router;