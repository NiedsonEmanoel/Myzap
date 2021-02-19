"use strict";
const fs = require('fs');
const dflowInterface = require('./dialogflow');
const functions = require('./util');
let bot = new dflowInterface(process.env.GCP_PROJECT_NAME, process.env.JSON_LOCATION, process.env.LANGUAGE_CODE);

module.exports = function Start(client) {
    /*let ignoreContact = [];
let firstIgnore = [];*/

/*if (ignoreContact.includes(message.from)) {
      if (firstIgnore.includes(message.from)) {
        client.sendText(message.from, `${message.sender.shortName}, estamos com todos os atendentes ocupados nesse momento, mas logo logo iremos lhe atender!\nEnquanto isso, conte-me mais sobre o que você deseja.`);
        for (numero in firstIgnore) {
          if (firstIgnore[numero] == message.from) {
            firstIgnore = firstIgnore.splice((numero + 1), 1);
          }
        }
      } else { return; }
    } else {*/
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