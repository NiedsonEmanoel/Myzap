require('dotenv').config();
const Start = require('./js/controler/Start');
const venom = require('venom-bot');
const functions = require('./js/model/util');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');

let app = express();

switch (process.env.useHTTPS) {
  case '1':
    let certificate = fs.readFileSync(process.env.CERT_CRT);
    let privatekey = fs.readFileSync(process.env.CERT_KEY);
    var server = require('https').createServer({ key: privatekey, cert: certificate }, app);
    server.listen(process.env.PORT, () => { });
    break;
  default:
    app.listen(process.env.PORT, () => { });
}

let limiter = new RateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 25
});

app.use(limiter);
app.use(morgan());
app.use(bodyParser.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/', require('./js/routes/app'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).send({});
  }

  next();
});

venom.create(
  'MyZAP',
  (base64QR) => {
    let matches = base64QR.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer = new Buffer.from(matches[2], 'base64');
    fs.writeFile('./js/view/assets/qrcode.png', buffer, () => { });
  },
  undefined, {
  disableWelcome: true,
  useChrome: true,
  browserArgs: ['--no-sandbox'],
  autoClose: false
}
).then((client) => {
  console.clear();
  fs.unlink('./js/view/assets/qrcode.png', () => { return });
  client.sendFile()
  app.post("/mensagem", async (req, res) => {
    await functions.sleep(250);
    let valid = functions.isMsgValid(req.body.message, req.body.numero, req.body.password);
    if (req.body.form === 'yes') {
      if (valid === true) {
        console.log(req.body);
        client.sendText(req.body.numero + '@c.us', req.body.message).then(() => {
          res.sendFile(__dirname + '/js/view/public/mensagem-ok.html');
        }).catch(() => {
          res.sendFile(__dirname + '/js/view/public/mensagem-error.html');
        });
      } else {
        res.sendFile(__dirname + '/js/view/public/mensagem-error.html');
      }
    } else {
      if (valid === true) {
        client.sendText(req.body.numero + '@c.us', req.body.message).then((result) => {
          res.status(200).send({
            "numero": req.body.numero,
            "message": req.body.message,
            "status": "OK"
          });
        }).catch((err) => {
          res.status(401).send({
            "numero": req.body.numero,
            "message": req.body.message,
            "status": "Error"
          });
        });;    
      } else {
        res.status(500).send({
          "numero": req.body.numero,
          "message": req.body.message,
          "status": "Error"
        });
      }
    }
  });

  app.post("/mensagem/doc", async (req, res) => {
    console.log(req.body._64data)
    try {
      if ((req.body.numero == '') || (req.body.mensagem == '') || (req.body.senha != process.env.PASS_API) || (req.body._64data == '')) {
        res.sendFile(__dirname + '/js/view/public/mensagem-error.html');
      } else {
        await client.sendFileFromBase64(req.body.numero + '@c.us', req.body._64data, req.body.extension, req.body.mensagem);
        res.sendFile(__dirname + '/js/view/public/mensagem-ok.html');
      }
    } catch (erro) {
      res.sendFile(__dirname + '/js/view/public/mensagem-error.html');
    }
  });
  Start(client);
}).catch((e) => console.log('Error: ' + e));