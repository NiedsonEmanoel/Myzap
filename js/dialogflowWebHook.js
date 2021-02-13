const express = require('express');
const router = express.Router();
router.use(express.urlencoded());
router.use(express.json());

router.post("/", (request, response)=>{
  console.log(request.body);
  var intentName = request.body.queryResult.intent.displayName;
  if (intentName == "Soma") {
    var soma = request.body.queryResult.parameters['num1'] +
    request.body.queryResult.parameters['num2'];
    response.json({ "fulfillmentText" : "Isso aqui é um Teste" + "\n" + "O resultado é: " + soma});
  }
});
module.exports = router;