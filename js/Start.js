"use strict";
const fs = require('fs');
const dflowInterface = require('./dialogflow');
const functions = require('./util');
const mime = require('mime');
let bot = new dflowInterface(process.env.GCP_PROJECT_NAME, process.env.JSON_LOCATION, process.env.LANGUAGE_CODE);

module.exports = function Start(client) {
    let ignoreContact = [];
    let firstIgnore = [];

    client.onMessage(async (message) => {
        client.sendSeen(message.from);
        if (ignoreContact.includes(message.from)) {
            if (firstIgnore.includes(message.from)) {
                client.sendText(message.from, `${message.sender.name}, estamos com todos os atendentes ocupados nesse momento, mas logo logo iremos lhe atender!\nEnquanto isso, conte-me mais sobre o que você deseja.`);
                for (numero in firstIgnore) {
                    if (firstIgnore[numero] == message.from) {
                        firstIgnore = firstIgnore.splice((numero + 1), 1);
                    }
                }
            } else { return; }
        } else {
            if (message.isGroupMsg === false) {
                if (message.type === 'chat') {
                    let response = await bot.sendText(message.body);
                    if (response.fulfillmentText) {
                        await client.sendText(message.from, response.fulfillmentText);
                        console.log('\nMensagem recebida:\nNúmero: ' + message.from + '\n Mensagem: ' + message.body + '\nResposta: ' + response.fulfillmentText);
                    } else {
                        await client.sendText(message.from, functions.fallbackResponses());
                        console.log('\nMensagem recebida:\nNúmero: ' + message.from + '\n Mensagem: ' + message.body + '\nResposta: Fallback');
                    }
                } else if (message.hasMedia === true && message.type === 'audio' || message.type === 'ptt') {
                    console.log('\nÁudio recebido:');

                    const buffer = await client.decryptFile(message);
                    let file = functions.writeName(message.from, message.mimetype);
                    let dir = __dirname + '/routes/temp/' + file;

                    fs.writeFile(dir, buffer, 'base64', () => { });
                    let response = await bot.sendAudio(dir, true);

                    try {
                        if (response.queryResult.fulfillmentText) {
                            let filen = functions.writeMP3(message.from);
                            let dirn = __dirname + '/routes/temp/' + filen;
                            fs.writeFileSync(dirn, response.outputAudio, () => { });

                            try {
                                let base64File = fs.readFileSync(dirn, { encoding: 'base64' });
                                const filemime = mime.getType(dirn);
                                base64File = `data:${filemime};base64,${base64File}`;

                                await client.sendText(message.from, response.queryResult.fulfillmentText);
                                await client.sendFileFromBase64(message.from, base64File, 'Resposta em áudio - '+message.sender.shortName);

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
        }
    });
}