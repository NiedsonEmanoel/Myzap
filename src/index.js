"use strict";

if (!process.env.MODE) {
    console.clear();
    console.warn('- Iniciando em desenvolvimento')

    require('dotenv').config();
}else{
    console.clear();
    console.warn('- Iniciando em produção')
}

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const Routes = require('./Routes');
const cors = require('cors');
const MailerClass = require('./Controllers/Classes/Mailer');

const Mailer = new MailerClass(
    process.env.USER_MAIL,
    process.env.PASSWORD_MAIL,
    process.env.SERVICE_MAIL
);

const { Limiter } = require('./Functions');

const app = express();

const { MongoDB } = require('./Databases');

const WhatsApp = require('./Controllers/multisession.controller');

let serverRest;

(async function () {
    await MongoDB.Connect();
    await WhatsApp.createInternal();
    await WhatsApp.initilizeInternal();
}());

let io;
(function () {
    serverRest = require('http').createServer(app);
    io = require('socket.io')(serverRest);
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
}());

io.on('connection', socket => {
    console.log(`- Socket connected: ${socket.id}`);
});

exports.sendEmail = function (options) {
    Mailer.sendEmail(options, (err, info) => {
        if (err) {
            console.log('Erro no envio do email.');
        }
    })
}

exports.emit = function (event, data) {
    return (io.emit(event, data));
}
