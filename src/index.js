"use strict";
require('dotenv').config();
const Venom = require('./Controllers/Venom');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');

//Instância do Venom-Dflow
const WhatsApp = new Venom();

//App da API do WhatsApp
const app = express();

WhatsApp.initVenom().then(() => {
    //Iniciar com HTTPS ou não.
    switch (process.env.useHTTPS) {
        case '1':
            let certificate = fs.readFileSync(process.env.CERT_CRT);
            let privatekey = fs.readFileSync(process.env.CERT_KEY);
            var server = require('https').createServer({ key: privatekey, cert: certificate }, app);
            server.listen(process.env.wpPORT, () => { });
            break;
        default:
            app.listen(process.env.wpPORT, () => { });
    }
    //Seta limitador em 25 solicitações em 10 segundos.
    let limiter = new RateLimit({
        windowMs: 10 * 1000, // 10 seconds
        max: 25
    });

    //Proteção de DDOS
    app.use(limiter);

    //Logger
    app.use(morgan());

    //Parsers 
    app.use(bodyParser.urlencoded({ limit: '50mb' }));
    app.use(bodyParser.json({ limit: '50mb' }));
}).catch((error) => {
    console.error(error);
});