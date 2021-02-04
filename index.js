const GCP_PROJECT_NAME = 'secret-chat-71aeb'; // NOME DO PROJETO
const JSON_LOCATION = './niedson.json'; // LOCAL DO SEU JSON

const venom = require('venom-bot');
const dialogflow = require('@google-cloud/dialogflow');
const fs = require('fs');
const express = require('express');
let app = express();

const sessionClient = new dialogflow.SessionsClient({keyFilename: JSON_LOCATION}); 

app.listen(80,()=>{});

app.get("/qrcode", (req, res, next) => {
  fs.readFile("qr/out.png", (err, data) => {
    if(err) {
      fs.readFile("assets/out.png", (err, data) => {
        if(err){
          res.json("Unavaliable");
        }
        else{
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(data);
      }  
      });
    }else{
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.end(data);
    }
  });
});

app.get("/", (req, res, next) => {
  res.sendFile(__dirname +"/index.html", ()=>{});
});

async function detectIntent(
    projectId,
    sessionId,
    query,
    contexts,
    languageCode
  ) {
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode,
        },
      },
    };
  
    if (contexts && contexts.length > 0) {
      request.queryParams = {
        contexts: contexts,
      };
    }
  
    const responses = await sessionClient.detectIntent(request);
    return responses[0];
}
async function executeQueries(projectId, sessionId, queries, languageCode) {
    let context;
    let intentResponse;
    for (const query of queries) {
        try {
            intentResponse = await detectIntent(
                projectId,
                sessionId,
                query,
                context,
                languageCode
            );
            console.log('\nDIALOGFLOW\nNúmero: '+sessionId+
              '\nMensagem recebida: '+query+
              "\nIntent: "+intentResponse.queryResult.intent.displayName+
              "\nResposta: "+intentResponse.queryResult.fulfillmentText
            );
            return intentResponse.queryResult;
        } catch (error) {
            console.log(error);
        }
    }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

venom
  .create(
    'session',
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
        'qr/out.png',
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
    console.clear();
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  console.log("Myzap-Flow");
  fs.unlink('qr/out.png', ()=>{return});

  app.get("/mensagem", async (req, res, next) =>{
    try {
      await sleep(500);
      await client.sendText(req.query.numero+'@c.us', req.query.message); // host/mensagem?message=MENSAGEM&numero=555555
      let status;
      if((req.query.numero == undefined)||(req.query.message == undefined)){
        if ((req.query.numero == undefined)&&(req.query.message == undefined)) {
          status = {
            "ERROR":'NENHUM CAMPO INFORMADO.'
          };
        }
        else if(req.query.numero == undefined) {
          status = {
            "ERROR":'NUMERO DESCONHECIDO OU NÃO INFORMADO.'
          };
        }else {
          status = {
            "ERROR":'MENSAGEM NÃO INFORMADA.'
          };
        }
      }else{status = 'SUCCESS';}
      let callback = {
        send : {
        "numero":req.query.numero === undefined?"NULL":req.query.numero,
        "mensagem":req.query.message === undefined?"NULL":req.query.message,
        "status":status
        }
      }
      console.log("");
      console.log('API - ENVIAR MENSAGEM');
      console.log(JSON.stringify(callback.send));
      res.json(callback.send);
    } catch(erro) {
      res.json(JSON.stringify(erro));
    }
  });

    client.onMessage(async message => {
    fs.unlink('qr/out.png', ()=>{});
      if(message.isGroupMsg == false){
          let dialogFlowRequest = await executeQueries(GCP_PROJECT_NAME, message.from, [message.body], 'pt-BR');
          let intent = dialogFlowRequest.intent.displayName;
          await client.sendText(message.from, dialogFlowRequest.fulfillmentText);
      }
    }
  );
}