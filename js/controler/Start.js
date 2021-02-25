"use strict";
const fs = require('fs');
const dflowInterface = require('../model/dialogflow');
const functions = require('../model/util');
const mime = require('mime');
const preferences = require('../model/preferences');

module.exports = function Start(client) {
    let last_msg = '';
    client.onMessage(async (message) => {
        if (last_msg === message.id) {
            last_msg = '';
            console.log('Duplicata evitada');
            return;
        }
        last_msg = message.id;
        
        let bot = new dflowInterface(process.env.GCP_PROJECT_NAME, process.env.JSON_LOCATION, process.env.LANGUAGE_CODE, message.from);
        client.sendSeen(message.from);
        let intent;

        for (let contact in preferences.ignoreContact) {
            if (preferences.ignoreContact[contact].number == message.from) {
                for (let contactFirst in preferences.firstIgnore) {
                    if (preferences.firstIgnore[contactFirst].number == message.from) {
                        client.sendText(message.from, `${message.sender.shortName}, estamos com todos os atendentes ocupados nesse momento, mas logo logo iremos lhe atender!`);
                        client.sendText(message.from, 'Enquanto isso, conte-me mais sobre o que você deseja.');
                        preferences.remFirstIgnore(message.from);
                    }
                }
                return;
            }
        }

        if (message.isGroupMsg === false) {
            if (message.type === 'chat') {
                let response = await bot.sendText(message.body);
                if (response.fulfillmentText) {
                    await client.sendText(message.from, response.fulfillmentText);
                    intent = response.intent.displayName;
                    console.log('\nMensagem recebida:\n Número: ' + message.from + '\n Mensagem: ' + message.body + '\n Resposta: ' + response.fulfillmentText);
                } else {
                    await client.sendText(message.from, functions.fallbackResponses());
                    console.log('\nMensagem recebida:\n Número: ' + message.from + '\n Mensagem: ' + message.body + '\n Resposta: Fallback');
                }
            } else if (message.hasMedia === true && message.type === 'audio' || message.type === 'ptt') {
                console.log('\nÁudio recebido:');

                const buffer = await client.decryptFile(message);
                let file = functions.writeName(message.from, message.mimetype);
                let dir = __dirname + '/temp/' + file;

                fs.writeFile(dir, buffer, 'base64', () => {});
                let response = await bot.sendAudio(dir, true);

                try {
                    if (response.queryResult.fulfillmentText) {
                        intent = response.queryResult.intent.displayName;
                        let filen = functions.writeMP3(message.from);
                        let dirn = __dirname + '/temp/' + filen;
                        fs.writeFileSync(dirn, response.outputAudio, () => { });

                        try {
                            let base64File = fs.readFileSync(dirn, { encoding: 'base64' });
                            const filemime = mime.getType(dirn);
                            base64File = `data:${filemime};base64,${base64File}`;

                            await client.sendText(message.from, response.queryResult.fulfillmentText);
                            await client.sendFileFromBase64(message.from, base64File, 'Resposta'); // o ideal era utilizar o sendPttFromBase64 - atualmente não funciona -

                            fs.unlink(dirn, () => { console.log('cache limpo') });
                        } catch (e) {
                            console.log(e);
                        }
                    }
                } catch {
                    await client.sendText(message.from, functions.fallbackResponses());
                }
            }
        }
        if (intent == process.env.INTENT_SAC) {
            preferences.addIgnore(message.from, message.sender.name, message.sender.profilePicThumbObj.img);
            console.log('Adicionado a fila de espera.')
        }

    });
}