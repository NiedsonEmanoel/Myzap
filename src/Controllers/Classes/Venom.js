const venom = require('venom-bot');
const dialogflow = require('./Dialogflow');
const io = require('../../index');
const path = require('path');
const messageHelper = require('../../Controllers/messages.controller')
const notifierHelper = require('../Classes/Notifier');
const notifier = new notifierHelper();
const clientHelper = require('../clients.controller');
const auxFunctions = require('../../Functions/functions');
const fs = require('fs');

module.exports = class {
    #GCP_PROJECT_NAME
    #JSON_LOCATION
    #LANGUAGE_CODE
    #IntenalAwaiting = []
    #index

    constructor(index, GCP_PROJECT_NAME, JSON_LOCATION, LANGUAGE_CODE) {
        this.#index = index;
        this.#GCP_PROJECT_NAME = GCP_PROJECT_NAME;
        this.#JSON_LOCATION = JSON_LOCATION;
        this.#LANGUAGE_CODE = LANGUAGE_CODE;
    }

    async initVenom() {
        this.Client = await venom.create('MyZAP ' + this.#index, (Base64QR => {
            let matches = Base64QR.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let buffer = new Buffer.from(matches[2], 'base64');
            fs.writeFile(path.resolve('./Controllers/Classes/Temp/qrcode' + this.#index + '.png'), buffer, () => { });
        }), (status) => {
            if (status == 'qrReadSuccess') {
                fs.unlink(path.resolve('./Controllers/Classes/Temp/qrcode' + this.#index + '.png'), () => { });
            }
        }, {
            disableWelcome: true, autoClose: 0, updatesLog: false, headless: true, disableSpins: true, browserArgs: [
                '--js-flags="--max_old_space_size=80" --disable-web-security',
                '--no-sandbox',
                '--disable-web-security',
                '--aggressive-cache-discard',
                '--disable-cache',
                '--disable-application-cache',
                '--disable-offline-load-stale-cache',
                '--disk-cache-size=0',
                '--disable-background-networking',
                '--disable-default-apps', '--disable-extensions',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-first-run',
                '--safebrowsing-disable-auto-update',
                '--ignore-certificate-errors',
                '--ignore-ssl-errors',
                '--ignore-certificate-errors-spki-list'
            ]
        }).catch(e => {
            console.error('Erro ao iniciar sessão ' + e);
        });

        console.info('- [SYSTEM]: STARTING');

        fs.unlink(path.resolve('./Controllers/Classes/Temp/qrcode' + this.#index + '.png'), () => { });
        console.info('- [SYSTEM]: ACTIVE');

        setInterval(async () => {
            let battery = await this.Client.getBatteryLevel();
            if (battery <= 5) {
                notifier.notify('Bateria baixa, convém ligar o celular da sessão: ' + this.#index + ' ao carregador.');
            }
        }, 1000 * 60 * 10);

        this.Client.onMessage(async (message) => await this.execMessages(message));

    }
    /*
        {
            "mediaUrl": "https://pbs.twimg.com/media/Dk4sOm5WwAMdibY.jpg",
            "mediaText": "kkkkkkkkkkkk",
            "mediaName": "foto"
        }
    */
    async processPayload(fulfillmentMessages, fullName, message) {
        for (let responses of fulfillmentMessages) {
            try {
                if (responses.text) {
                    let messageResponse = responses.text.text[0].replace('%USER-NAME%', fullName);
                    await this.Client.reply(message.from, messageResponse, message.id.toString());
                }

                if (responses.payload) {
                    if (responses.payload.fields.mediaUrl) {
                        let link = responses.payload.fields.mediaUrl.stringValue;
                        let name = responses.payload.fields.mediaName.stringValue ? responses.payload.fields.mediaName.stringValue : "file";
                        let text = responses.payload.fields.mediaText.stringValue ? responses.payload.fields.mediaText.stringValue : "";
                        try {
                            await this.Client.sendFile(message.from, link, name, text);
                        } catch (e) {
                            try {
                                await this.Client.sendVoice(message.from, link, name, text);
                            } catch (e) {
                                console.log(e);
                            }
                        }

                    }
                }

            } catch (e) {
                console.log(e);
            }
        }
    }

    async execMessages(message) {
        let intent;

        try {
            let bot = new dialogflow(this.#GCP_PROJECT_NAME, path.resolve(this.#JSON_LOCATION), this.#LANGUAGE_CODE, message.from);

            if (message.isGroupMsg === true) { console.log('\nMensagem abortada: GROUP_MESSAGE\n'); return; }

            const RequestMongo = await clientHelper.findInternal(message.from);

            if (!RequestMongo.Exists) {
                if (!this.#IntenalAwaiting.includes(message.from)) {
                    this.#IntenalAwaiting.push(message.from);
                    await this.Client.reply(message.from, `Olá ${auxFunctions.Greetings()}, você ainda não está cadastrado em nosso sistema.`, message.id.toString());
                    await this.Client.sendText(message.from, 'Para podermos lhe atender com uma experiência completa, digite seu nome e sobrenome.');
                    return;
                } else {
                    if (message.type === 'chat') {
                        let fullName = message.body;

                        await clientHelper.createInternal(fullName, message.sender.profilePicThumbObj.eurl, message.from).then(() => {
                            fs.mkdir(path.resolve('./', 'Uploads') + '/' + message.from, { recursive: true }, () => { });
                        });
                        let index = this.#IntenalAwaiting.indexOf(message.from) + 1;
                        this.#IntenalAwaiting = this.#IntenalAwaiting.splice(index, 1);

                        const response = await bot.sendText('Oi');

                        if (response.fulfillmentMessages) {
                            this.processPayload(response.fulfillmentMessages, fullName, message)
                        }

                        return;
                    } else {
                        await this.Client.sendText(message.from, 'Digite seu nome e sobrenome.');
                        return;
                    }
                }
            }

            let User = RequestMongo.User;

            if (User.inAttendace === true) {
                if (message.type == 'chat') {
                    let type = message.type;
                    let author = User.fullName;
                    let body = message.body;
                    let chatId = message.from;

                    await messageHelper.createText(type, author, body, chatId);
                } else {
                    let type = message.type;
                    let author = User.fullName;
                    let chatId = message.from;
                    let dirF = path.resolve('./', 'Uploads') + '/' + message.from;
                    let fileName = auxFunctions.WriteFileMime(message.from, message.mimetype)
                    let link = `http://${process.env.HOST}:${process.env.PORT}/files/${message.from}?file=${fileName}`;
                    let fileLinkDownload = `http://${process.env.HOST}:${process.env.PORT}/files/${message.from}?file=${fileName}&download=true`;
                    let dirN = dirF + '/' + fileName;

                    fs.mkdir(dirF, { recursive: true }, () => { });
                    const buffer = await this.Client.decryptFile(message);
                    fs.writeFile(dirN, buffer, () => { });

                    await messageHelper.createMedia(type, fileName, link, author, chatId, fileLinkDownload, false);
                }

                return (io.emit('newMessage', { "from": message.from }));

            }

            if ((message.type === 'chat') && (message.body.length > (process.env.CHAR_LIMIT_PER_MESSAGE ? process.env.CHAR_LIMIT_PER_MESSAGE : 256))) {
                this.Client.deleteMessage(message.from, message.id.toString(), false);
                console.info('\nMensagem abortada: TOO_LONG_MESSAGE\n');
                return this.Client.sendText(message.from, 'Desculpe, essa mensagem é muito longa!');
            }

            console.info(`\nMensagem recebida!\nType: ${message.type}\nSender: ${User.fullName}`);

            if (message.type === 'chat') {
                let response = await bot.sendText(message.body);

                if (response.fulfillmentText) {
                    this.processPayload(response.fulfillmentMessages, User.fullName, message);

                    intent = response.intent.displayName;
                } else {
                    await this.Client.reply(message.from, auxFunctions.Fallback(), message.id.toString());
                }

            } else if (message.hasMedia === true && message.type === 'audio' || message.type === 'ptt') {

                const Buffer = await this.Client.decryptFile(message);
                let nameAudio = auxFunctions.WriteFileMime(message.from, message.mimetype);
                let dir = path.join(__dirname, '/Temp', nameAudio);
                fs.writeFileSync(dir, Buffer, 'base64', () => { });
                let response = await bot.detectAudio(dir, true);

                try {
                    if (response.queryResult.fulfillmentText) {
                        this.processPayload(response.queryResult.fulfillmentMessages, User.fullName, message);
                        intent = response.queryResult.intent.displayName;
                    }

                } catch (e) {
                    await this.Client.reply(message.from, auxFunctions.Fallback(), message.id.toString());
                    console.info('Fallback');
                }
            }

            if (intent === process.env.INTENT_SAC) {

                console.log('Atendimento solicitado via chat');
                await clientHelper.switchFirst(User);
                io.emit('newAttendace', { "name": User.fullName, "chatId": message.from });
                notifier.notify('Um novo cliente pediu atendimento');

            }
        } catch (e) {
            console.error('Error ' + e);
        }
    }
}