const venom = require('venom-bot');
const fs = require('fs');
const dFlow = require('./dialogflow-rq');

venom
  .create(
    'sessionName',
    (base64Qr, asciiQR, attempts, urlCode) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      require('fs').writeFile(
        'img/out.png',
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    undefined,
    { logQR: false }
  )
  .then((client) => {
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });


function start(client) {
  client.onMessage(async (message) => {
    if (message.isGroupMsg == false) {
      var machineLearningRequest = await dFlow.sendDialogFlow(message.body);
      /*Mapeiamento por Intent: Evita ter que criar IF's para situações como Oi, oi, OI, Oie e suas variações*/
      if (machineLearningRequest.IntentName == 'oi') {
        console.log(message.from);
        await client.sendText(message.from, machineLearningRequest.Response).then((result) => {
          console.log('Result: ', result); //return object success
        });
      }

      else if (machineLearningRequest.IntentName == 'Interação') {
        console.log(message.from);
        await client.sendText(message.from, machineLearningRequest.Response).then((result) => {
          console.log('Result: ', result); //return object success
        });
      }

      else { // não entendi - fallback
        await client.sendText(message.from, machineLearningRequest.Response).then((result) => {
          console.log('Result: ', result); //return object success
        });
      }

    }
  });
}