"use strict";
const path = require('path');
const pathEnv = path.resolve(__dirname, '.env');

//.env
require('dotenv').config({path: pathEnv});

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
}());

WhatsApp.initVenom().then(() => {
    venomApi.use(venomAuth);

    venomApi.get('/', async (req, res) => {
        let Chats = await WhatsApp.Client.getAllChatsNewMsg();
        let chats = [];

        for (let key in Chats) {
            if (Chats[key].id.server == 'c.us') {
                chats.push(Chats[key]);
            }
        }

        res.status(200).send({
            chats,
            "message": "success"
        });
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
        let numbers = new String(req.body.numbers);
        let messages = new String(req.body.message);

        numbers = numbers.replace(/\s/g, '');

        let arrNumbers = numbers.split(',');
        let arrMessages = messages.split('/:end:/');

        for (let key in arrNumbers) {
            for (let keyM in arrMessages) {
                await WhatsApp.Client.sendText(arrNumbers[key] + '@c.us', arrMessages[keyM]);
            }
        }

        /*{
            "numbers":"558754756985, 5598652135",
            "message": "Eae gente, tudo bem com vocês?/:end:/Hoje é isso./:end:/Tudo Beleza."
        }*/

        res.status(200).send({
            "messages": arrMessages,
            "to": arrNumbers,
            "message": "success"
        });
    });

    venomApi.post('/doc', async(req, res) => {
        //WhatsApp.Client.sendFileFromBase64(to, base64, filename, message);
        let numbers = new String(req.body.numbers);
        numbers = numbers.replace(/\s/g, '');

        let arrNumbers = numbers.split(',');
        let base64 = req.body.base64;
        let name = req.body.filename;
        let messages = req.body.message

        for(let key in arrNumbers){
            await WhatsApp.Client.sendFileFromBase64(arrNumbers[key]+'@c.us', base64, name, messages);
        }

        res.status(200).send({
            name,
            messages,
            'to': arrNumbers,
            "message":"success"
        });

    });

}).catch((error) => {
    console.error(error);
});