const GCP_PROJECT_NAME = 'secret-chat-71aeb'; // NOME DO PROJETO
const JSON_LOCATION = './niedson.json'; // LOCAL DO SEU JSON

const venom = require('venom-bot');
const dialogflow = require('@google-cloud/dialogflow');
const fs = require('fs');
const express = require('express');
let app = express();
const sessionClient = new dialogflow.SessionsClient({keyFilename: JSON_LOCATION}); 
const dialogflowWebHook = require('./js/dialogflowWebHook');

app.listen(80,()=>{});
app.use(express.urlencoded());
app.use(express.json());

app.use('/dialogflow', dialogflowWebHook);
app.get("/qrcode", (req, res, next) => {
  fs.readFile("assets/qr-out.png", (err, data) => {
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

app.get("/nmso.png", (req, res, next) => {
  fs.readFile("assets/nmweb.png", (err, data) => {
    if(err) {}  
    else{
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.end(data);
    }
  });
});

app.get("/", (req, res, next) => {
  res.sendFile(__dirname +"/public/index.html", ()=>{});
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
        'assets/qr-out.png',
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
  fs.unlink('assets/qr-out.png', ()=>{return});
  app.get("/mensagem", (req, res)=>{
    res.sendFile(__dirname +"/public/mensagem.html", ()=>{});
  })
  app.post("/mensagem", async (req, res, next) =>{
    try {
      await sleep(500);
      await client.sendText(req.body.numero+'@c.us', req.body.message); // host/mensagem?message=MENSAGEM&numero=555555
      let status, subStatus;
      if((req.body.numero == '')||(req.body.message == '')||(req.body.password != "10-20-30")){
        if(req.body.password != "10-20-30") {
          status = "ERROR";
          subStatus = "SENHA INVÁLIDA"
        }
        else if ((req.body.numero == '')&&(req.body.message == '')) {
          status = "ERROR";
          subStatus = "NUMERO E MENSAGEM NÃO INFORMADOS"
        }
        else if(req.body.numero == '') {
          status = "ERROR";
          subStatus = "NUMERO NÃO INFORMADO"
        }else {
          status = "ERROR";
          subStatus = "MENSAGEM NÃO INFORMADA"
        }
      }else{status = 'SUCCESS';subStatus = "MENSAGEM ENVIADA"}
      let callback = {
        send : {
        "request":status,
        "status":subStatus
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
    fs.unlink('assets/qr-out.png', ()=>{});
      if(message.isGroupMsg == false){
        console.log(message);
          let dialogFlowRequest = await executeQueries(GCP_PROJECT_NAME, message.from, [message.body], 'pt-BR');
          let intent = dialogFlowRequest.intent.displayName;
          await client.sendText(message.from, dialogFlowRequest.fulfillmentText);
      }
    }
  );
}