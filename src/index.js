"use strict";

if (!process.env.MODE) {
    console.clear();
    console.warn('- Iniciando em desenvolvimento')

    require('dotenv').config();
} else {
    console.clear();
    console.warn('- Iniciando em produção')
}

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const Routes = require('./Routes');
const cors = require('cors');
const WhatsAppClient = require('./Controllers/multisession.controller')
const MessageClient = require('./Controllers/messages.controller');
const MailerClass = require('./Controllers/Classes/Mailer');

const app = express();
const serverRest = require('http').createServer(app);
const io = require('socket.io')(serverRest);

const Mailer = new MailerClass(
    process.env.USER_MAIL,
    process.env.PASSWORD_MAIL,
    process.env.SERVICE_MAIL
);

const { Limiter } = require('./Functions');

const { MongoDB } = require('./Databases');

const WhatsApp = require('./Controllers/multisession.controller');

(async () => {
    await MongoDB.Connect();
    await WhatsApp.createInternal();
    await WhatsApp.initilizeInternal();
})();

(() => {
    serverRest.listen(process.env.PORT || 3000, () => { });
    console.info(`- Servidor HTTP rodando em: http://localhost:${process.env.PORT || 3000}/`);

    app.use(cors({
        origin: '*',
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        methods: 'PUT, POST, PATCH, DELETE, GET'
    }));

    app.use(Limiter);

    app.use(morgan('tiny'));

    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(express.json({ limit: '50mb' }));
    app.use(cookieParser());

    app.use(Routes);
})();

io/*.use(function (socket, next) {
    const jwt = require("jsonwebtoken");
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.SECRET, function (err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
        });
    }
    else {
        next(new Error('Authentication error'));
    }
})*/.on('connection', function (client) {
    console.log(`- Socket connected: ${client.id}`);

    client.on('sendMessage', async function (message) {
        let { worker, numbers, messages } = message;
        WhatsAppClient.sendMessageBySocket(worker, numbers, messages)
    });

    client.on('requestMessages', async (e) => {
        const chatId = e.chatId
        let Messages = await MessageClient.messagesBySocket(chatId);
        client.emit('receiveMessages', Messages)
    })

    client.on('sendFile', async function (message) {
        let { base64, type, numbers, ext, name } = message;
        WhatsAppClient.sendFile64BySocket(base64, type, numbers, ext, name)
    })

    client.on('requestAttendance', async(e) => {
        const clientsHelper = require('./Controllers/clients.controller')
        let Attendance = await clientsHelper.getAttendanceBySocket()
        client.emit('receiveAttendance', Attendance)
    })
});

exports.sendEmail = (options) => {
    Mailer.sendEmail(options, (err, info) => {
        if (err) {
            console.log('Erro no envio do email.');
        }
    })
}

exports.emit = (event, data) => {
    return (io.emit(event, data));
}
