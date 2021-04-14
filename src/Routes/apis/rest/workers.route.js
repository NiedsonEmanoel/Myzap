const express = require('express');
const Router = express.Router();
const Workers = require('../../../Controllers/worker.controller');
const jwtPasser = require('../../../Middlewares/verify')

Router.get('/', jwtPasser, Workers.index);
Router.get('/details/:_id', jwtPasser, Workers.details);
Router.post('/', Workers.create);
Router.put('/:_id', jwtPasser, Workers.update);
Router.delete('/:_id', jwtPasser, Workers.delete)

module.exports = Router;