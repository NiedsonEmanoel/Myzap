"use strict";
require('dotenv').config();
const Venom = require('./Controllers/Venom');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const limiter = require('./Models/limiter');
const cors = require('./Models/cors');

//Instância do Venom-Dflow
const WhatsApp = new Venom();

//Apps do Express
const venomApi = express();
const restApi = express();

//Cors
venomApi.use(cors);
restApi.use(cors);

//Proteção de DDOS
venomApi.use(limiter);
restApi.use(limiter);

//Logger
venomApi.use(morgan());
restApi.use(morgan());

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
                venomApi.listen(process.env.wpPORT, () => { });
                restApi.listen(process.env.PORT, () => { });

                console.info(`Servidor HTTP da API do WhatsApp rodando em: http://localhost:${process.env.wpPORT}/`);
                console.info(`Servidor HTTP da RestAPI rodando em: http://localhost:${process.env.PORT}/`);
                break;
            }

            var serverVenom = require('https').createServer({ key: privatekey, cert: certificate }, venomApi);
            var serverRest = require('https').createServer({ key: privatekey, cert: certificate }, restApi);

            serverVenom.listen(process.env.wpPORT, () => { });
            serverRest.listen(process.env.PORT, () => { });

            console.info(`Servidor HTTPS da API do WhatsApp rodando em: https://localhost:${process.env.wpPORT}/`);
            console.info(`Servidor HTTPS da RestAPI rodando em: https://localhost:${process.env.PORT}/`);
            break;
        default:
            venomApi.listen(process.env.wpPORT, () => { });
            restApi.listen(process.env.PORT, () => { });

            console.info(`Servidor HTTP da API do WhatsApp rodando em: http://localhost:${process.env.wpPORT}/`);
            console.info(`Servidor HTTP da RestAPI rodando em: http://localhost:${process.env.PORT}/`);
    }
}());

WhatsApp.initVenom().then(() => {
    //Parsers 
    venomApi.use(bodyParser.urlencoded({ limit: '50mb' }));
    venomApi.use(bodyParser.json({ limit: '50mb' }));

    venomApi.get('/', async (req, res) => {
        let chats = await WhatsApp.Client.getAllChatsNewMsg();
        res.status(200).send({ chats });
    });

    venomApi.get('/:chatNumber', async (req, res) => {

    });
}).catch((error) => {
    console.error(error);
});