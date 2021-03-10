const express = require('express');
const Venom = require('../../../Controllers/venom.controller');
const Router = express.Router();

Router.get('/', Venom.receberChatsNovos);
Router.get('/valid', Venom.verificarNumero);

Router.get('/device', Venom.inputDeviceInfo)
Router.get('/device/battery', Venom.nivelBateria);
Router.get('/qrcode', Venom.qrCode);

Router.post('/mensagem', Venom.enviarMensagens);
Router.post('/mensagem.doc', Venom.enviarArquivoBase64);

module.exports = Router;
