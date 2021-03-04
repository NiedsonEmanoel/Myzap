"use strict";
//.env
require('dotenv').config();

//Libs
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

//App - route
let app = require('./Routes/app');

//Controlers
const Venom = require('./Controllers/Venom');

//Models
const limiter = require('./Models/limiter');
const cors = require('./Models/cors');

//Midlewares
const venomAuth = require('./Middlewares/venomAuth');

//Instância do Venom-Dflow
const WhatsApp = new Venom();

//Apps do Express
const venomApi = express();
const restApi = express();

//Routes
restApi.use(app);

//Cors
venomApi.use(cors);
restApi.use(cors);

//Proteção de DDOS
venomApi.use(limiter);
restApi.use(limiter);

//Logger
venomApi.use(morgan());
restApi.use(morgan());

//Parser
venomApi.use(bodyParser.urlencoded({ limit: '20mb' }));
venomApi.use(bodyParser.json({ limit: '20mb' }));
restApi.use(bodyParser.urlencoded());
restApi.use(bodyParser.json());

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
    console.log();
}());

WhatsApp.initVenom().then(() => {
    venomApi.use(venomAuth);

    venomApi.get('/', async (req, res) => {
        let Chats = await WhatsApp.Client.getAllChatsNewMsg();
        let chats = [];

        for(let key in Chats){
            if(Chats[key].id.server == 'c.us'){
                chats.push(Chats[key]);
            }
        }

        res.status(200).send({
            chats,
            "message": "success"
        });
    });

    venomApi.get('/:id', async (req, res) => {
        const Messages = await WhatsApp.Client.getAllChatsGroups(/*req.params.id + '@c.us'*/);
        res.status(200).send({
            Messages,
            "message": "success"
        })
    });

    venomApi.get('/valid', async (req, res) => {
        let number = req.query.number + '@c.us';
        const profile = await WhatsApp.Client.getNumberProfile(number);
        res.status(200).send({
            profile,
            "message": "success"
        });
    });

    venomApi.post('/', async (req, res) => {
        let userReq = req.body;

    });

}).catch((error) => {
    console.error(error);
});