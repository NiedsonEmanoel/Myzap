const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.sendFile(__dirname+'/public/index.html', ()=>{})
});

router.get('/dialogflow', (req, res)=>{
    res.sendFile(__dirname+'/public/webhook.html');
});

router.use('/dialogflow', require('./dialogflowWebhook'));
router.use('/mensagem', require('./messages-get'));
router.use('/assets', require('./assets'));
module.exports = router;