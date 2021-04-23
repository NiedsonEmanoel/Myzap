"use strict";
const path = require('path');
const pathEnv = path.resolve(__dirname, '.env');

//.env
require('dotenv').config({ path: pathEnv });

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const fs = require('fs');
const Routes = require('./Routes');
const cors = require('cors');
const {Limiter} = require('./Functions');

const app = express();

const {MongoDB} = require('./Databases');

const {createInternal, initilizeInternal} = require('./Controllers/multisession.controller');

let serverRest;

(async function () {
    await MongoDB.Connect();
    await createInternal();
    await initilizeInternal();
}());

let io;
(function () {
    console.clear();
    switch (process.env.useHTTPS) {
        case '1':
            let certificate;
            let privatekey;

            try {
                certificate = fs.readFileSync(process.env.CERT_CRT);
                privatekey = fs.readFileSync(process.env.CERT_KEY);
            } catch (e) {
                console.error(e);
                serverRest = require('http').createServer(app);
                io = require('socket.io')(serverRest);
                serverRest.listen(process.env.PORT, process.env.HOST, () => { });

                console.info(`Servidor HTTP rodando em: http://${process.env.HOST}:${process.env.PORT}/`);
                break;
            }
            serverRest = require('https').createServer({ key: privatekey, cert: certificate, rejectUnauthorized: false }, app);
            io = require('socket.io')(serverRest);
            serverRest.listen(process.env.PORT, process.env.HOST, () => { });

            console.info(`Servidor HTTPS rodando em: https://${process.env.HOST}:${process.env.PORT}/`);
            break;

        default:
            serverRest = require('http').createServer(app);
            io = require('socket.io')(serverRest);
            serverRest.listen(process.env.PORT, process.env.HOST, () => { });
            console.info(`Servidor HTTP rodando em: http://${process.env.HOST}:${process.env.PORT}/`);
    }

    app.use(cors({
        origin: '*',
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        methods: 'PUT, POST, PATCH, DELETE, GET'
    }));

    app.use(Limiter);

    app.use(morgan('tiny'));

    app.use(express.urlencoded({ limit: '20mb', extended: true }));
    app.use(express.json({ limit: '20mb' }));
    app.use(cookieParser());

    app.use(Routes);
}());

io.on('connection', socket => {
    console.log(`Socket conectado ${socket.id}`);
});

exports.emit = function (event, data) {
    return(io.emit(event, data));
}
