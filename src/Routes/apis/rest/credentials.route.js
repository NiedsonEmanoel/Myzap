const express = require('express');
const Router = express.Router();
const idPasser = require('../../../Middlewares/idPasser')
const Credentials = require('../../../Controllers/credentials.controller');

Router.get('/', Credentials.index);
Router.get('/alias', Credentials.indexAlias);
Router.post('/', Credentials.createCredential);
Router.put('/', idPasser, Credentials.setCredential)
Router.delete('/', Credentials.deleteCredential);

module.exports = Router;