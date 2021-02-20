const express = require("express");
const router = express.Router();
router.use(express.urlencoded());
router.use(express.json());

router.post("/", (request, response) => {
    let intentName = request.body.queryResult.intent.displayName;
    // Teste Webhook
    if (intentName == "teste") {
        response.json({ fulfillmentText: `Webhook Funcionando!!!` });
    }
    // Soma
    else if (intentName == "soma") {
        let n1 = request.body.queryResult.parameters["num1"];
        let n2 = request.body.queryResult.parameters["num2"];
        response.json({
            fulfillmentText: `Isso aqui é um Teste de soma: ${n1 + n2}`,
        });
    }
    // Calculo Kelvin
    else if (intentName == "kelvin") {
        let kelvin = request.body.queryResult.parameters["number"] + 275.15;
        response.json({
            fulfillmentText: `A conversão de Celsius para Kelvin é: ${kelvin}`,
        });
    }
});

module.exports = router;
