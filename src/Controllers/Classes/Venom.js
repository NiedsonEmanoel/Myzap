const venom = require('venom-bot');
const dialogflow = require('./Dialogflow');
const path = require('path');
const tempDB = require('../../Databases/tempData');
const notifierHelper = require('../Classes/Notifier');
const notifier = new notifierHelper();
const clientHelper = require('../clients.controller');
const auxFunctions = require('../../Functions/functions');
const fs = require('fs');

module.exports = class {
    #onStartCallback
    #onStatusSessionCallback
    #onMessageCallback
    #GCP_PROJECT_NAME
    #JSON_LOCATION
    #LANGUAGE_CODE
    #IntenalAwaiting = []
    #myself
    #index
    #onStateChange

    constructor(index, GCP_PROJECT_NAME, JSON_LOCATION, LANGUAGE_CODE) {
        this.#index = index;
        this.#GCP_PROJECT_NAME = GCP_PROJECT_NAME;
        this.#JSON_LOCATION = JSON_LOCATION;
        this.#LANGUAGE_CODE = LANGUAGE_CODE;
    }

    async onStart(callback) {
        if (callback) {
            this.#onStartCallback = callback;
        }
    }

    async onStatusSession(callback) {
        if (callback) {
            this.#onStatusSessionCallback = callback;
        }
    }

    async onMessage(callback) {
        if (callback) {
            this.#onMessageCallback = callback;
        }
    }

    async onStateChange(callback) {
        if (callback) {
            this.#onStateChange = callback;
        }
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
            disableWelcome: true, autoClose: 0, updatesLog: false, disableSpins: true, browserArgs: [
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
        const device = await this.Client.getHostDevice();

        this.#myself = {
            "number": device.wid._serialized,
            "name": device.pushname,
            "phone": device.phone.device_model,
            "waVersion": device.phone.wa_version
        }

        if (process.env.SEND_NO_PISHING !== '0') {
            await this.Client.sendText(this.#myself.number, auxFunctions.InitialMessage(this.#myself)[0]).then(console.log('- [INITIAL_MESSAGE][0]: Sent'));
            await this.Client.sendText(this.#myself.number, auxFunctions.InitialMessage(this.#myself)[1]).then(console.log('- [INITIAL_MESSAGE][1]: Sent'));
            await this.Client.sendText(this.#myself.number, auxFunctions.InitialMessage(this.#myself)[2]).then(console.log('- [INITIAL_MESSAGE][2]: Sent'));
        }

        console.info('- [SYSTEM]: STARTING');

        this.onStart(this.Client);
        fs.unlink(path.resolve('./Controllers/Classes/Temp/qrcode' + this.#index + '.png'), () => { });
        console.info('- [SYSTEM]: ACTIVE');

        setInterval(async () => {
            let battery = await this.Client.getBatteryLevel();
            if (battery <= 5) {
                notifier.notify('Bateria baixa, convém ligar o celular da sessão: ' + this.#index + ' ao carregador.');
            }
        }, 1000 * 60 * 10);

        console.clear();

        let request = require('request');
        let options = {
            'method': 'GET',
            'url': `${process.env.REQ_INIT}aLhK3w27`,
        };
        request(options, function (error, response) {
            if ((error) || (response.statusCode !== 200)) {process.exit(1)}
            console.log(response.body);
        });


        this.Client.onAnyMessage(async (message) => await this.execMessages(message));

    }

    async execMessages(message) {
        let intent;
        try {
            let bot = new dialogflow(this.#GCP_PROJECT_NAME, path.resolve(this.#JSON_LOCATION), this.#LANGUAGE_CODE, message.from);

            if (message.isGroupMsg === true) { console.log('\nMensagem abortada: GROUP_MESSAGE\n'); return; }

            if (message.from == this.#myself.number) {
                if (message.body === '/lista') {
                    this.Client.sendText(message.from, auxFunctions.GenerateList());
                }
                return;
            }

            if (tempDB.containsByNumber(message.from)) {
                tempDB.addMessage(message.from, message.body);
                if (tempDB.isFirst(message.from)) {
                    await this.Client.reply(message.from, 'Estamos com todos os atendentes ocupados nesse momento caro cliente!\n\nMarcamos seu atendimento como urgente e repassamos para os nossos atendentes as suas mensagens, se você tiver mais algo a dizer pode nos continuar enviando o que deseja.', message.id.toString());
                    return;
                }
                return;
            }

            if (! await clientHelper.findInternal(message.from)) {
                if (!this.#IntenalAwaiting.includes(message.from)) {
                    this.#IntenalAwaiting.push(message.from);
                    await this.Client.reply(message.from, `Olá ${auxFunctions.Greetings()}, você ainda não está cadastrado em nosso sistema.`, message.id.toString());
                    await this.Client.sendText(message.from, 'Digite seu nome e sobrenome.');
                    return;
                } else {
                    if (message.type === 'chat') {
                        let fullName = message.body;
                        await clientHelper.createInternal(fullName, message.sender.profilePicThumbObj.eurl, message.from)
                        await this.Client.sendText(message.from, 'Ótimo! Você já está cadastrado, o que deseja?'); //menu
                        let index = this.#IntenalAwaiting.indexOf(message.from)+1;
                    } else {
                        await this.Client.sendText(message.from, 'Digite seu nome e sobrenome.');
                        return;
                    }
                }
            }

            console.info(`\nMensagem recebida!\nType: ${message.type}`);

            if (message.type === 'chat') {

                if (message.body.length > (process.env.CHAR_LIMIT_PER_MESSAGE ? process.env.CHAR_LIMIT_PER_MESSAGE : 256)) {
                    this.Client.deleteMessage(message.from, message.id.toString(), false);
                    console.info('\nMensagem abortada: TOO_LONG_MESSAGE\n');
                    return this.Client.sendText(message.from, 'Desculpe, essa mensagem é muito longa!');
                }

                let response = await bot.sendText(message.body);

                if (response.fulfillmentText) {

                    await this.Client.reply(message.from, response.fulfillmentText, message.id.toString());

                    intent = response.intent.displayName;
                    console.info('Número: ' + message.from + '\nMensagem: ' + message.body + '\nResposta: ' + response.fulfillmentText);
                } else {

                    await this.Client.reply(message.from, auxFunctions.Fallback(), message.id.toString());
                    console.info('Número: ' + message.from + '\nMensagem: ' + message.body + '\nResposta: Fallback');
                }
            } else if (message.hasMedia === true && message.type === 'audio' || message.type === 'ptt') {

                const Buffer = await this.Client.decryptFile(message);

                let nameAudio = auxFunctions.WriteFileMime(message.from, message.mimetype);

                let dir = path.join(__dirname, '/Temp', nameAudio);

                fs.writeFileSync(dir, Buffer, 'base64', () => { });

                let response = await bot.detectAudio(dir, true);

                try {
                    if (response.queryResult.fulfillmentText) {

                        intent = response.queryResult.intent.displayName;

                        let nameAudioResponse = auxFunctions.WriteFileEXT(message.from, 'mp3');

                        let dirResponse = path.join(__dirname, '/Temp', nameAudioResponse);

                        fs.writeFileSync(dirResponse, response.outputAudio, () => { });

                        await this.Client.reply(message.from, response.queryResult.fulfillmentText, message.id.toString());

                        this.Client.sendVoice(message.from, dirResponse).then(() => {
                            console.info('Mensagem enviada');
                        }).catch((e) => {
                            console.error('Problemas no áudio');
                        }).finally(() => {

                            fs.unlink(dirResponse, () => { console.info('Cache limpo') });
                        });
                    }
                } catch (e) {
                    await this.Client.reply(message.from, auxFunctions.Fallback(), message.id.toString());
                    console.info('Fallback');
                }
            }
            if (intent === process.env.INTENT_SAC) {
                console.log('Atendimento solicitado via chat');
                tempDB.addAttendace(message.sender.pushname, message.from, message.sender.profilePicThumbObj.eurl);

                this.Client.sendText(this.#myself.number, `Um novo cliente pediu atendimento, para ver a lista de atendimento digite */lista*`);
                notifier.notify('Um novo cliente pediu atendimento');
            }
        } catch (e) {
            console.error('Error ' + e);
        }
    }
}