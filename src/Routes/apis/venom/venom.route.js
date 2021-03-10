const express = require('express');
const Venom = require('../../../Controllers/venom.controller');
const venomAuth = require('../../../Middlewares/venomAuth');
const Router = express.Router();

Router.get('/qrcode', Venom.qrCode);

Router.use(venomAuth);

Router.get('/', Venom.receberChatsNovos);
Router.get('/valid', Venom.verificarNumero);

Router.get('/device', Venom.inputDeviceInfo)
Router.get('/device/battery', Venom.nivelBateria);

Router.post('/mensagem', Venom.enviarMensagens);
Router.post('/mensagem.doc', Venom.enviarArquivoBase64);

module.exports = Router;
