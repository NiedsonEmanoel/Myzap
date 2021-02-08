const GCP_PROJECT_NAME = 'secret-chat-71aeb'; // NOME DO PROJETO
const JSON_LOCATION = './niedson.json'; // LOCAL DO SEU JSON
const PORT = 80;

const venom = require('venom-bot');
const dialogflow = require('@google-cloud/dialogflow');
const express = require('express');
let app = express();
const sessionClient = new dialogflow.SessionsClient({ keyFilename: JSON_LOCATION });
let ignoreContact = [];
let firstIgnore = [];

app.listen(PORT, () => { });
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use('/dialogflow', require('./js/dialogflowWebHook'));
app.use('/assets', require('./js/assets'))

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/public/index.html", ()=>{});
});

app.get("/mensagem/doc", (req, res)=>{
  res.sendFile(__dirname+"/public/file-message.html");
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
      console.log('\nDIALOGFLOW\nNúmero: ' + sessionId +
        '\nMensagem recebida: ' + query +
        "\nIntent: " + intentResponse.queryResult.intent.displayName +
        "\nResposta: " + intentResponse.queryResult.fulfillmentText
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
    setInterval(() => {
      if (ignoreContact.length !== 0) {
        ignoreContact.length = 0;
        console.log('IgnoreList clean');
      }
    }, 86400000); //24 Horas
    require('fs').unlink('assets/qr-out.png', () => { return });
    app.get("/mensagem", (req, res) => {
      res.sendFile(__dirname + "/public/mensagem.html", () => { });
    });

    app.post("/mensagem", async (req, res, next) => {
      try {
        await sleep(250);
        if ((req.body.numero == '') || (req.body.message == '') || (req.body.password != "10-20-30")) {
          res.sendFile(__dirname + '/public/mensagem-error.html');
        } else {
          await client.sendText(req.body.numero + '@c.us', req.body.message);
          res.sendFile(__dirname + '/public/mensagem-ok.html');
        }
      } catch (erro) {
        res.sendFile(__dirname + '/public/mensagem-error.html');
      }
    });

    app.post("/mensagem/doc", async (req, res, next) => {
      try {
        await sleep(250);
        if ((req.body.numero == '') || (req.body.mensagem == '') || (req.body.senha != "10-20-30") || (req.body._64data == '')) {
          res.sendFile(__dirname + '/public/mensagem-error.html');
        } else {
          await client.sendFileFromBase64(req.body.numero + '@c.us', req.body._64data, req.body.extension, req.body.mensagem);
          res.sendFile(__dirname + '/public/mensagem-ok.html');
        }
      } catch (erro) {
        res.sendFile(__dirname + '/public/mensagem-error.html');
      }
    });

    app.post("api/mensagem", async (req, res, next) => {
      try {
        await sleep(250);
        await client.sendText(req.body.numero + '@c.us', req.body.message); // host/mensagem?message=MENSAGEM&numero=555555
        let status, subStatus;
        if ((req.body.numero == '') || (req.body.message == '') || (req.body.password != "10-20-30")) {
          if (req.body.password != "10-20-30") {
            status = "ERROR";
            subStatus = "SENHA INVÁLIDA"
          }
          else if ((req.body.numero == '') && (req.body.message == '')) {
            status = "ERROR";
            subStatus = "NUMERO E MENSAGEM NÃO INFORMADOS"
          }
          else if (req.body.numero == '') {
            status = "ERROR";
            subStatus = "NUMERO NÃO INFORMADO"
          } else {
            status = "ERROR";
            subStatus = "MENSAGEM NÃO INFORMADA"
          }
        } else { status = 'SUCCESS'; subStatus = "MENSAGEM ENVIADA" }
        let callback = {
          send: {
            "request": status,
            "status": subStatus
          }
        }
        console.log("");
        console.log('API - ENVIAR MENSAGEM');
        console.log(JSON.stringify(callback.send));
        res.json(callback.send);
      } catch (erro) {
        res.json(JSON.stringify(erro));
      }
    });

    console.clear();
    console.log(require('./js/init'));
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  require('fs').unlink('assets/qr-out.png', ()=>{});

  client.onStateChange((state) => {
    console.log('State changed: ', state);
    if ('CONFLICT'.includes(state)) client.useHere();
    if ('UNPAIRED'.includes(state)) console.log('logout');
  });

  client.onIncomingCall(async (call) => {
    client.sendText(call.peerJid, "Desculpe :(\nEu ainda não atendo ligações...");
  });

  client.onMessage(async message => {
    if (ignoreContact.includes(message.from)) {
      if (firstIgnore.includes(message.from)) {
        client.sendText(message.from, `${message.sender.shortName}, estamos com todos os atendentes ocupados nesse momento, mas logo logo iremos lhe atender!\nEnquanto isso, conte-me mais sobre o que você deseja.`);
        for (numero in firstIgnore) {
          if (firstIgnore[numero] == message.from) {
            firstIgnore = firstIgnore.splice((numero + 1), 1);
          }
        }
      } else {return;}
    } else {
      if (message.isGroupMsg == false) {
        if (message.isMedia == false) {
          let dialogFlowRequest = await executeQueries(GCP_PROJECT_NAME, message.from, [message.body], 'pt-BR');
          let intent = dialogFlowRequest.intent.displayName;

          if (intent === 'AtendimentoHumano') {
            ignoreContact.push(message.from);
            firstIgnore.push(message.from);
            await client.sendText(message.from, dialogFlowRequest.fulfillmentText);
          } else {
            await client.sendText(message.from, dialogFlowRequest.fulfillmentText);
          }
        }
      }
    }
  }
  );
}