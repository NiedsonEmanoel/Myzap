"use strict";
const fs = require('fs');
const dflowInterface = require('./dialogflow');
const functions = require('./util');
let bot = new dflowInterface(process.env.GCP_PROJECT_NAME, process.env.JSON_LOCATION, process.env.LANGUAGE_CODE);

module.exports = function Start(client) {
    client.onMessage(async(message)=>{
        if(message.isGroupMsg === false){
            if(message.type === 'chat'){
                let response = await bot.sendText(message.body);
                    if(response.fulfillmentText){
                        await client.sendText(message.from, response.fulfillmentText);
                        console.log('\nMensagem recebida:\nNúmero: '+message.from+'\n Mensagem: '+message.body+'\nResposta: '+response.fulfillmentText);
                    }else{
                        await client.sendText(message.from, functions.fallbackResponses());
                        console.log('\nMensagem recebida:\nNúmero: '+message.from+'\n Mensagem: '+message.body+'\nResposta: Fallback');
                    }
            }else if(message.hasMedia === true && message.type === 'audio' || message.type === 'ptt'){
                console.log('\nÁudio recebido:');
                const buffer = await client.decryptFile(message);
                let file = functions.writeName(message.from, message.mimetype);
                let dir = __dirname+'/routes/temp/'+file;
                fs.writeFile(dir, buffer, 'base64', ()=>{});
                let response = await bot.sendAudio(dir, true);
                if(response.fulfillmentText){
                    client.sendText(message.from, response.fulfillmentText);
                }else{
                    client.sendText(message.from, functions.fallbackResponses());
                }
            }
        }       
    });
}