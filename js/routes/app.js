const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.sendFile(__dirname.replace('\\js\\routes', '\\js\\view')+'/public/index.html', ()=>{})
});

router.use('/dialogflow', require('./dialogflowWebhook'));
router.use('/mensagem', require('./messages-get'));
router.use('/assets', require('./assets'));
module.exports = router;