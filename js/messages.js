const express = require('express');
const router = express.Router();
router.use(express.urlencoded());
router.use(express.json());

app.get("/mensagem", (req, res)=>{
    res.sendFile(__dirname +"/public/mensagem.html", ()=>{});
  })

  app.post("api/mensagem", async (req, res, next) =>{
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
module.exports = router;