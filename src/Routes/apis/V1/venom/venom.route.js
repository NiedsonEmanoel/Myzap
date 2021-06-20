const express = require('express');
const Venom = require('../../../../Controllers/multisession.controller');
const Router = express.Router();

const {JwtVerify, SessionValid, SessionVerify} = require('../../../../Middlewares')

Router.get('/qrcode', JwtVerify, SessionVerify, Venom.qrCode); // /qrcode?id=1

Router.get('/sessions', JwtVerify, Venom.getMax); // []
Router.get('/sessions.details/:id', JwtVerify, Venom.verifySession);// sessions.details/1
Router.post('/sessions', JwtVerify, SessionValid, Venom.initializeSession); // /sessions?id=1
Router.delete('/sessions', JwtVerify, SessionValid, Venom.closeSession); // /sessions?id=1

Router.delete('/chats/:chatId', Venom.deleteChatMessages); // /chats/558796845?id=1

Router.get('/chats', JwtVerify, SessionVerify, Venom.receberChatsNovos);// /?id=1
Router.get('/chats/:number', JwtVerify, SessionVerify, Venom.todosAsMensagensDoNumero); // /558796574896id=1&includeMe=true

Router.get('/valid/:number', JwtVerify, SessionVerify, Venom.verificarNumero); // /558796574896?id=1

Router.get('/device', JwtVerify, SessionVerify, Venom.inputDeviceInfo) // /device?id=1
Router.get('/device.battery', JwtVerify, Venom.nivelBateria); //  /device/battery?id=1

Router.post('/message', JwtVerify, SessionVerify, Venom.enviarMensagens); // /mensagem?id=1 \body {"numbers": "558796574896, 558796574896", "messages": "Oi/:end:/Teste"}
Router.post('/message.doc', JwtVerify, SessionVerify, Venom.enviarArquivoBase64); // /mensagem.doc?id=1 \body {"numbers": "558796574896, 558796574896", "base64": "foo bar", "name":"name.ext", "message": "caption"}

module.exports = Router;
