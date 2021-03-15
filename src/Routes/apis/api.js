const express = require('express');
const api = express.Router();

api.use('/', require('./rest/rest.route'));
api.use('/whatsapp', require('./venom/venom.route'));

module.exports = api;


/*

routes.post('/api/usuarios/login',Usuario.login);
routes.get('/api/usuarios/checktoken',Usuario.checkToken);
routes.get('/api/usuarios/destroytoken',Usuario.destroyToken);


*/
