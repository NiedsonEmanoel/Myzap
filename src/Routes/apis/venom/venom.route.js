const express = require('express');
const Venom = require('../../../Controllers/multisession.controller');
const venomAuth = require('../../../Middlewares/venomAuth');
const Router = express.Router();
const trustID = require('../../../Middlewares/idPasser');

Router.get('/qrcode', trustID, Venom.qrCode); // /qrcode?id=1

Router.get('/sessions', venomAuth, Venom.getMax); // []
Router.get('/sessions.details/:id', venomAuth, Venom.verifySession);// sessions.details/1
Router.post('/sessions', venomAuth, trustID, Venom.initializeSession); // /sessions?id=1
Router.delete('/sessions', venomAuth, trustID, Venom.closeSession); // /sessions?id=1

Router.get('/chats', venomAuth, trustID, Venom.receberChatsNovos);// /?id=1
Router.get('/chats/:number', venomAuth, trustID, Venom.todosAsMensagensDoNumero); // /558796574896id=1&includeMe=true

Router.get('/valid/:number', venomAuth, trustID, Venom.verificarNumero); // /558796574896?id=1

Router.get('/device', venomAuth, trustID, Venom.inputDeviceInfo) // /device?id=1
Router.get('/device.battery', venomAuth, Venom.nivelBateria); //  /device/battery?id=1

Router.post('/message', venomAuth, trustID, Venom.enviarMensagens); // /mensagem?id=1 \body {"numbers": "558796574896, 558796574896", "messages": "Oi/:end:/Teste"}
Router.post('/message.doc', venomAuth, trustID, Venom.enviarArquivoBase64); // /mensagem.doc?id=1 \body {"numbers": "558796574896, 558796574896", "base64": "foo bar", "name":"name.ext", "message": "caption"}

module.exports = Router;
