"use strict";

//Path .env
const path = require('path');
const fs = require('fs');
const pathEnv = path.resolve(__dirname, '.env');

//.env
require('dotenv').config({ path: pathEnv });

//Libs
const express = require('express');
const morgan = require('morgan');

//App - route
let app = require('./Routes/app');

//Functions
const functions = require('./Functions/functions');

//Apps do Express
const restApi = express();

//MongoDB
const mongoose = require('./Databases/mongoHelper');
mongoose.connect();

//Init Venom
const WhatsApp = require('./Controllers/multisession.controller');

(async function () {
    await WhatsApp.createInternal();
    await WhatsApp.initilizeInternal();
}());

//Iniciar servidor da API
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
                restApi.listen(process.env.PORT, () => { });

                console.info(`Servidor HTTP rodando em: http://localhost:${process.env.PORT}/`);
                break;
            }

            var serverRest = require('https').createServer({ key: privatekey, cert: certificate }, restApi);

            serverRest.listen(process.env.PORT, () => { });

            console.info(`Servidor HTTPS rodando em: https://localhost:${process.env.PORT}/`);
            break;
        default:

            restApi.listen(process.env.PORT, () => { });
            console.info(`Servidor HTTP rodando em: http://localhost:${process.env.PORT}/`);
    }

    //Cors
    restApi.use(functions.Cors);

    //Proteção de DDOS
    restApi.use(functions.Limiter);

    //Logger
    restApi.use(morgan('tiny'));

    //Parser
    restApi.use(express.urlencoded({ limit: '20mb', extended: true }));
    restApi.use(express.json({ limit: '20mb' }));

    //Routes
    restApi.use(app);
}());