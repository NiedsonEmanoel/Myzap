const express = require('express');
const router = express.Router();
const dirName = __dirname.replace(`\\js\\routes`, '\\js\\view\\public');

router.get('/', (req, res)=>{
    res.sendFile(dirName+'/mensagem.html');
});

router.get('/doc', (req, res)=>{
    res.sendFile(dirName+'/file-message.html');
})


console.log(z)
module.exports = router;