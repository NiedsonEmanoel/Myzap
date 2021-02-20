require('dotenv').config();
const dflowInterface = require('./js/dialogflow');
const fs = require('fs');
const functions = require('./js/util');
let bot = new dflowInterface(process.env.GCP_PROJECT_NAME, process.env.JSON_LOCATION, process.env.LANGUAGE_CODE);

async function s(){
    let a = await bot.sendTextResponseAudio('OI');
    if(a.queryResult.fulfillmentText){
        let fileName = functions.writeName('5587996755665', undefined, false).replace('.false', '.mp3');
        fs.writeFile(__dirname+'/'+fileName, a.outputAudio, ()=>{});
    }
}

s();