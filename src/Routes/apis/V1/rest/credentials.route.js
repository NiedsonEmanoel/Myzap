  
const express = require('express');
const Router = express.Router();
const idPasser = require('../../../../Middlewares/idPasser')
const Credentials = require('../../../../Controllers/credentials.controller');

Router.post('/', Credentials.createCredential);

module.exports = Router;