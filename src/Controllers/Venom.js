const venom = require('venom-bot');
const dialogflow = require('./Dialogflow');
const path = require('path');
const tempDB = require('../Databases/tempData');
const list = require('../Models/Utils/generateList');
const auxFunctions = require('../Models/functions');
const fs = require('fs');

module.exports = class {
    #qrCODE
    #onStartCallback
    #onStatusSessionCallback
    #onMessageCallback
    #myself
    #onStateChange

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
        this.Client = await venom.create('MyZAP', (Base64QR => {
            this.#qrCODE = Base64QR;
        }), this.#onStatusSessionCallback, { disableWelcome: true, autoClose: 0, updatesLog: false, disableSpins: true }).catch(e => {
            console.error('Erro ao iniciar o venom ' + e);
            process.exit(1);
        });
        const device = await this.Client.getHostDevice();

        this.#myself = {
            "number": device.wid._serialized,
            "name": device.pushname,
            "phone": device.phone.device_model,
            "waVersion": device.phone.wa_version
        }

        let modelMessage = require('../Models/initialMessage');

        await this.Client.sendText(this.#myself.number, modelMessage(this.#myself)[0]).then(console.log('- [INITIAL_MESSAGE][0]: Sent'));
        await this.Client.sendText(this.#myself.number, modelMessage(this.#myself)[1]).then(console.log('- [INITIAL_MESSAGE][1]: Sent'));
        await this.Client.sendText(this.#myself.number, modelMessage(this.#myself)[2]).then(() => {
            console.info('- [INITIAL_MESSAGE][2]: Sent');

            console.info('- [SYSTEM]: STARTING');

            this.onStart(this.Client);

            console.info('- [SYSTEM]: ACTIVE');

            this.Client.onAnyMessage(async (message) => await this.execMessages(message));
        }).catch(e => {
            console.log('Error ' + e);
        });


    }

    async execMessages(message) {
        console.info('\nMensagem recebida!');
        let intent;
        try {
            let bot = new dialogflow(process.env.GCP_PROJECT_NAME, process.env.JSON_LOCATION, process.env.LANGUAGE_CODE, message.from);

            //Abortadores 

            //Aborta se a mensagem vier de um grupo
            if (message.isGroupMsg === true) { console.log('Mensagem abortada\n'); return; }

            //Aborta se a mensagem vier do próprio número
            if (message.from == this.#myself.number) {
                if(message.body === '/lista'){
                    this.Client.sendText(message.from, list());
                }
                return;
            }

            //Aborta se vier de um cliente em atendimento
            if(tempDB.containsByNumber(message.from)){
                tempDB.addMessage(message.from, message.body);
                if(tempDB.isFirst(message.from)){
                    await this.Client.reply(message.from, 'Estamos com todos os atendentes ocupados nesse momento caro cliente!\n\nMarcamos seu atendimento como urgente e repassamos para os nossos atendentes as suas mensagens, se você tiver mais algo a dizer pode nos continuar enviando o que deseja.', message.id.toString());
                    return;
                }
                return;
            }

            if (message.type === 'chat') {
                console.info('Type: Text');

                //Faz a request para o dialogFlow
                let response = await bot.sendText(message.body);

                //Obteve resposta do DialogFlow?
                if (response.fulfillmentText) {
                    //Devolve a resposta do DialogFlow
                    await this.Client.reply(message.from, response.fulfillmentText, message.id.toString());

                    //Pega o nome da intent
                    intent = response.intent.displayName;
                    console.info('Número: ' + message.from + '\nMensagem: ' + message.body + '\nResposta: ' + response.fulfillmentText);
                } else {
                    //Da uma resposta de não entendi, nenhum match feito.
                    /** */
                    await this.Client.reply(message.from, auxFunctions.Fallback(), message.id.toString());
                    console.info('Número: ' + message.from + '\nMensagem: ' + message.body + '\nResposta: Fallback');
                }
            } else if (message.hasMedia === true && message.type === 'audio' || message.type === 'ptt') {
                //Descriptografa o áudio
                const Buffer = await this.Client.decryptFile(message);

                //Da um nome para o audio recebido com base no horário
                let nameAudio = auxFunctions.WriteFileMime(message.from, message.mimetype);

                //Path do arquivo /src/Controlers/Temp/nomeaudio .ogg || .oga
                let dir = path.join(__dirname, '/Temp', nameAudio);

                //Escrita síncrona :(
                fs.writeFileSync(dir, Buffer, 'base64', () => { });

                //Envia o áudio para o dialogFlow e apaga ao fim.
                let response = await bot.detectAudio(dir, true);

                try {
                    //O dialogFlow respondeu alguma coisa?
                    if (response.queryResult.fulfillmentText) {
                        //Pega o nome da intent
                        intent = response.queryResult.intent.displayName;

                        //Da um nome para o audio de resposta do DialogFlow .mp3
                        let nameAudioResponse = auxFunctions.WriteFileEXT(message.from, 'mp3');

                        //Path do arquivo /src/controllers/temp/nome.mp3
                        let dirResponse = path.join(__dirname, '/Temp', nameAudioResponse);

                        //Escrita síncrona :(
                        fs.writeFileSync(dirResponse, response.outputAudio, () => { });

                        //Resposta com texto padrão.
                        await this.Client.reply(message.from, response.queryResult.fulfillmentText, message.id.toString());

                        //Enviar o audio do DialogFlow para o WhatsApp
                        this.Client.sendVoice(message.from, dirResponse).then(() => {
                            console.info('Mensagem enviada');
                        }).catch((e) => {
                            console.error('Problemas no áudio');
                        }).finally(() => {
                            //Apagar no final
                            fs.unlink(dirResponse, () => { console.info('Cache limpo') });
                        });
                    }
                } catch (e) {
                    //DialogFlow não entendeu o áudio e não respondeu nada, retorna 'não entendi' manualmente.
                    await this.Client.reply(message.from, auxFunctions.Fallback(), message.id.toString());
                    console.info('Fallback');
                }
            }
            //É a intent de atendimento ao cliente?
            if (intent === process.env.INTENT_SAC) {
                console.log('Intent mapeada');
                //Adiciona no array temporário --
                tempDB.addAttendace(message.sender.pushname, message.from, message.sender.profilePicThumbObj.eurl);
                //Avisa ao dispositivo -- versão standalone próprio número.
                this.Client.sendText(this.#myself.number, `Um novo cliente pediu atendimento, para ver a lista de atendimento digite */lista*`);
            }
        } catch (e) {
            console.error('Error ' + e);
        }
    }
}