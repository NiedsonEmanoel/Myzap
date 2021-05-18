const venom = require('venom-bot');
const wppconnect = require('@wppconnect-team/wppconnect')
const dialogflow = require('./Dialogflow');
const io = require('../../index');
const path = require('path');
const messageHelper = require('../messages.controller')
const clientHelper = require('../clients.controller');
const auxFunctions = require('../../Functions/index');
const fs = require('fs');

module.exports = class {
    #CREDENTIALS_DFLOW
    #LANGUAGE_CODE
    #IntenalAwaiting = []
    #index
    #alias
    #engine

    constructor(index, Credentials, LANGUAGE_CODE, alias) {
        this.#index = index;
        this.#CREDENTIALS_DFLOW = Credentials;
        this.#LANGUAGE_CODE = LANGUAGE_CODE;
        this.#alias = alias
        this.#engine = process.env.ENGINE == 'WPPCONNECT' ? wppconnect : venom;
    }

    setCredential(credential, alias) {
        this.#CREDENTIALS_DFLOW = credential;
        this.#alias = alias;
    }

    getAlias() {
        return this.#alias;
    }

    async initVenom() {
        if (process.env.ENGINE !== 'WPPCONNECT') {
            console.log('VENOM:')
            this.Client = await this.#engine.create('MyZAP ' + this.#index, (Base64QR => {
                let matches = Base64QR.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                let buffer = new Buffer.from(matches[2], 'base64');

                fs.writeFile(path.resolve(__dirname, '..', '..', 'Controllers', 'Classes', 'Temp', 'qrcode' + this.#index + '.png'), buffer, () => { });
            }), (statusSession, session) => {
                if (statusSession == 'qrReadSuccess') {
                    fs.unlink(path.resolve(__dirname, '..', '..', 'Controllers', 'Classes', 'Temp', 'qrcode' + this.#index + '.png'), () => { });
                }
                console.log(`- [instance: ${session}]: ${statusSession}`)
                io.emit('SessionStats', {
                    "Status": statusSession,
                    "Session": session
                })
            }, {
                autoClose: 1000 * 60 * 15, updatesLog: false, headless: true, disableWelcome: true, disableSpins: true, browserArgs: auxFunctions.Flags
            }).catch(e => {
                console.error('Erro ao iniciar sessão ' + e);
            });

            fs.unlink(path.resolve(__dirname, '..', '..', 'Controllers', 'Classes', 'Temp', 'qrcode' + this.#index + '.png'), () => { });

            setInterval(async () => {
                let battery = await this.Client.getBatteryLevel();
                if (battery <= 5) {
                    io.emit('newNotification', {
                        'type': "error",
                        'message': 'Bateria baixa, convém ligar o celular ao carregador.'
                    });
                    //  notifier.notify('Bateria baixa, convém ligar o celular da sessão: ' + this.#index + ' ao carregador.');
                }
            }, 1000 * 60 * 10);
            io.emit('sessionChanged', {});
            this.Client.onMessage(async (message) => await this.execMessages(message));
        } else {
            this.Client = await this.#engine.create({
                session: 'MyZAP ' + this.#index,
                statusFind: (status) => {
                    if (status == 'qrReadSuccess') {
                        fs.unlink(path.resolve(__dirname, '..', '..', 'Controllers', 'Classes', 'Temp', 'qrcode' + this.#index + '.png'), () => { });
                    }
                },
                catchQR: (Base64QR => {
                    let matches = Base64QR.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                    let buffer = new Buffer.from(matches[2], 'base64');
                    fs.writeFile(path.resolve(__dirname, '..', '..', 'Controllers', 'Classes', 'Temp', 'qrcode' + this.#index + '.png'), buffer, () => { });
                }),
                autoClose: 1000 * 60 * 15,
                updatesLog: true,
                headless: true,
                disableSpins: true,
                browserArgs: auxFunctions.Flags
            }).catch(e => {
                console.error('Erro ao iniciar sessão ' + e);
            });

            console.info('- [SYSTEM]: STARTING');

            fs.unlink(path.resolve(__dirname, '..', '..', 'Controllers', 'Classes', 'Temp', 'qrcode' + this.#index + '.png'), () => { });
            console.info('- [SYSTEM]: ACTIVE');

            setInterval(async () => {
                let battery = await this.Client.getBatteryLevel();
                if (battery <= 5) {
                    io.emit('newNotification', {
                        'type': "error",
                        'message': 'Bateria baixa, convém ligar o celular da sessão: ' + this.#index + ' ao carregador.'
                    });
                    //  notifier.notify('Bateria baixa, convém ligar o celular da sessão: ' + this.#index + ' ao carregador.');
                }
            }, 1000 * 60 * 10);
            io.emit('sessionChanged', {});
            this.Client.onMessage(async (message) => await this.execMessages(message));
        }

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
        if (message.from == 'status@broadcast') {
            return;
        }
        let intent;

        try {
            let bot = new dialogflow(this.#CREDENTIALS_DFLOW, this.#LANGUAGE_CODE, message.from);

            if(process.env.MODE == 'dev'){
                if(message.from !== '558796755665@c.us'){
                    if(message.from !== '558791478538@c.us'){
                        return;
                    }
                }
            }

            if (message.isGroupMsg === true) { console.log('\nMensagem abortada: GROUP_MESSAGE\n'); return; }
            const RequestMongo = await clientHelper.findInternal(message.from);

            if (!RequestMongo.Exists) {
                if (!this.#IntenalAwaiting.includes(message.from)) {
                    this.#IntenalAwaiting.push(message.from);
                    let messageOne = process.env.MESSAGE_ONE || "Olá %GREETING%, você ainda não está cadastrado em nosso sistema.";
                    messageOne = messageOne.replace('%GREETING%', auxFunctions.Greetings());
                    const messageTwo = process.env.MESSAGE_TWO || "Para podermos lhe atender com uma experiência completa, digite seu nome e sobrenome.";

                    await this.Client.reply(message.from, messageOne, message.id.toString());
                    await this.Client.sendText(message.from, messageTwo);
                    return;
                } else {
                    if (message.type === 'chat') {
                        let fullName = message.body;

                        await clientHelper.createInternal(fullName, message.sender.profilePicThumbObj.eurl, message.from).then(() => {
                            fs.mkdir(path.resolve(__dirname, '../../Uploads/') + '/' + message.from, { recursive: true }, () => { });
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

            if (message.type == 'payment') {
                if (message.subtype == 'send') {
                    let amount = parseFloat(message.paymentAmount1000 / 1000).toFixed(2);
                    let tempAmount = parseFloat(message.paymentAmount1000 / 1000); //ok
                    let note = message.paymentNoteMsg.body;
                    let currency = amount <= 1 ? 'REAL' : 'REAIS';
                    let author = User.fullName;
                    let chatId = message.from;
                    let s = User.WithDrawCash 
                    let saldo = (s+tempAmount); 
                    console.log(saldo)
                    await this.Client.reply(message.from, `PAGAMENTO VIA FACEBOOK PAY\n\nPAGADOR: ${new String(User.fullName).toUpperCase()}\nNÚMERO TELEFONE: ${User.chatId.replace('@c.us', '')}\nVALOR: ${amount.replace('.', ',')} ${currency}\n\nSALDO TOTAL: ${saldo.toFixed(2)}R$`, message.id.toString())

                    await messageHelper.createPayment(author, note, chatId, tempAmount, currency);
                    await clientHelper.updateWithdraw(User, saldo)
                    await this.Client.sendText(message.from, `Obrigado pelo pagamento!`);
                    return (io.emit('newMessage', { "from": message.from }));
                } else {
                    return
                }
            }

            let lastUpdateDate = parseInt(`${new Date(User.updatedAt).getTime()}`);
            let dateNow = parseInt(`${new Date().getTime()}`)

            if (((dateNow - lastUpdateDate) >= 2 * 86400000)) {
                console.log('\nAtualizando foto de perfil de ' + User.fullName)
                await clientHelper.updateProfilePicInternal(User, message.sender.profilePicThumbObj.eurl);
            }

            if (User.inGrant == true) {
                try {
                    let avaliation = parseInt(message.body)
                    if (avaliation != NaN) {
                        if (avaliation >= 10) {
                            avaliation = 10;
                        }
                        if (avaliation <= 0) {
                            avaliation = 0;
                        }
                        const AvController = require('../avaliations.controller');
                        await AvController.createAvaliation(User.fullName, avaliation);
                        await clientHelper.disableGrantMode(User);
                        await this.Client.sendText(message.from, 'Obrigado pelo contato!');
                        return;
                    } else {
                        await this.Client.sendText(message.from, 'Digite um número entre 0 e 10.');
                        return;
                    }
                }
                catch (e) {
                    await this.Client.sendText(message.from, 'Digite um número entre 0 e 10.');
                    return
                }
            }

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
                    let dirF = path.resolve(__dirname, '../../Uploads/') + '/' + message.from;
                    let fileName = auxFunctions.WriteFileMime(message.from, message.mimetype)
                    let link = `/files/${message.from}?file=${fileName}`;
                    let fileLinkDownload = `/files/${message.from}?file=${fileName}&download=true`;
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


            } else if (!((message.type === 'audio') || (message.type === 'ptt'))) {
                await this.Client.reply(message.from, auxFunctions.Fallback(), message.id.toString());
                return;
            } else {
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
                await clientHelper.switchFirst(User);
                io.emit('newAttendace', { "name": User.fullName, "chatId": message.from });
                io.emit('newNotification', {
                    'type': "info",
                    'message': 'Um novo cliente solicitou atendimento',
                });
            }
        } catch (e) {
            console.error('Error ' + e);
        }
    }
}
