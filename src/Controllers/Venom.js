const venom = require('venom-bot');
const dialogflow = require('./Dialogflow');
const path = require('path');
const auxFunctions = require('../Models/functions');
const fs = require('fs');

module.exports = class {
    #qrCODE
    #onStartCallback
    #onStatusSessionCallback
    #onMessageCallback
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

    async initVenom(sessionName, configs) {
        this.Client = await venom.create('MyZAP', (Base64QR => {
            this.#qrCODE = Base64QR;
        }), this.#onStatusSessionCallback, { disableWelcome: true, autoClose: 0, updatesLog: false }).catch(e => {
            console.error('Erro ao iniciar o venom ' + e);
            process.exit(1);
        });

        this.onStart(this.Client);
        this.Client.onMessage(async (message) => await this.execMessages(message));
    }

    async execMessages(message) {
        console.info('\nMensagem recebida!');
        let intent;
        try {
            let bot = new dialogflow(process.env.GCP_PROJECT_NAME, process.env.JSON_LOCATION, process.env.LANGUAGE_CODE, message.from);

            //Aborta se a mensagem vier de um grupo
            if (message.isGroupMsg === true) { console.log('Mensagem abortada\n'); return; }

            if (message.type === 'chat') {
                console.info('Type: Text');

                //Faz a request para o dialogFlow
                let response = await bot.sendText(message.body);

                //Obteve resposta do DialogFlow?
                if (response.fulfillmentText) {
                    //Devolve a resposta do DialogFlow
                    await this.Client.sendText(message.from, response.fulfillmentText);

                    //Pega o nome da intent
                    intent = response.intent.displayName;
                    console.info('Número: ' + message.from + '\nMensagem: ' + message.body + '\nResposta: ' + response.fulfillmentText);
                } else {
                    //Da uma resposta de não entendi, nenhum match feito.
                    await this.Client.sendText(message.from, auxFunctions.Fallback());
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
                        await this.Client.sendText(message.from, response.queryResult.fulfillmentText);

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
                    this.Client.sendText(message.from, auxFunctions.Fallback());
                    console.info('Fallback');
                }
            }
        } catch (e) {
            console.error('Error ' + e);
        }
    }
}