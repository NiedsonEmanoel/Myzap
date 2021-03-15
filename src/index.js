"use strict";
const path = require('path');
const pathEnv = path.resolve(__dirname, '.env');

//.env
require('dotenv').config({ path: pathEnv });

const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
let app = require('./Routes/app');
const functions = require('./Functions/functions');

const restApi = express();

const mongoose = require('./Databases/mongoHelper');

const WhatsApp = require('./Controllers/multisession.controller');


(async function () {
    await mongoose.connect();
    await WhatsApp.createInternal();
    await WhatsApp.initilizeInternal();
}());

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

    restApi.use(functions.Cors);

    restApi.use(functions.Limiter);

    restApi.use(morgan('tiny'));

    restApi.use(express.urlencoded({ limit: '20mb', extended: true }));
    restApi.use(express.json({ limit: '20mb' }));

    restApi.use(app);

}());