const express = require('express');
const Venom = require('../../../Controllers/multisession.controller');
const venomAuth = require('../../../Middlewares/venomAuth');
const Router = express.Router();
const trustID = require('../../../Middlewares/idPasser');

Router.put('/sessions', venomAuth, Venom.createSession); // body{""}
Router.get('/sessions', venomAuth, Venom.getMax); // []
Router.post('/sessions', trustID, venomAuth, Venom.initializeSession); // /sessions?id=1
Router.delete('/sessions', venomAuth, trustID, Venom.closeSession); // /sessions?id=1

Router.use(trustID);
Router.get('/qrcode', Venom.qrCode); // /qrcode?id=1

Router.use(venomAuth);
Router.get('/', Venom.receberChatsNovos);// /?id=1
Router.get('/:number', Venom.todosAsMensagensDoNumero); //558796574896?id=1
Router.get('/valid', Venom.verificarNumero); // /558796574896?id=1
Router.get('/device', Venom.inputDeviceInfo) // /device?id=1
Router.get('/device/battery', Venom.nivelBateria); //  /device/battery?id=1

Router.post('/mensagem', Venom.enviarMensagens); // /mensagem?id=1 \body {"numbers": "558796574896, 558796574896", "messages": "Oi/:end:/Teste"}
Router.post('/mensagem.doc', Venom.enviarArquivoBase64); // /mensagem.doc?id=1 \body {"numbers": "558796574896, 558796574896", "base64": "foo bar", "name":"name.ext", "message": "caption"}

module.exports = Router;
