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
            let certificate;
            let privatekey;
            try {
                certificate = fs.readFileSync(process.env.CERT_CRT);
                privatekey = fs.readFileSync(process.env.CERT_KEY);
            } catch (e) {
                console.error(e);
                app.listen(process.env.wpPORT, () => { });
                console.info(`Servidor HTTP da API do WhatsApp rodando em: http://localhost:${process.env.wpPORT}/`);
                break;
            }
            var server = require('https').createServer({ key: privatekey, cert: certificate }, app);
            server.listen(process.env.wpPORT, () => { });
            console.info(`Servidor HTTPS da API do WhatsApp rodando em: https://localhost:${process.env.wpPORT}/`);
            break;
        default:
            app.listen(process.env.wpPORT, () => { });
            console.info(`Servidor HTTP da API do WhatsApp rodando em: http://localhost:${process.env.wpPORT}/`);
    }

    //Seta limitador em 25 solicitações a cada 10 segundos.
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

    app.get('/', async(req, res) => {
        let chats = await WhatsApp.Client.loadAndGetAllMessagesInChat('5587996755665@c.us', true, false);//WhatsApp.Client.getAllChatsNewMsg();
        
        res.status(200).send({chats});
    })
}).catch((error) => {
    console.error(error);
});