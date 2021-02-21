const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.sendFile(__dirname.replace('\\js\\routes', '\\js\\view')+'/public/index.html', ()=>{})
});

router.get('/dialogflow', (req, res)=>{
    res.sendFile(__dirname.replace('\\js\\routes', '\\js\\view')+'/public/webhook.html');
});

router.use('/dialogflow', require('../routes/dialogflowWebhook'));
router.use('/mensagem', require('../routes/messages-get'));
router.use('/assets', require('../routes/assets'));

module.exports = router;