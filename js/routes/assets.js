const express = require('express');
const router = express.Router();
const fs = require('fs');

const dirName = __dirname.replace('\\js\\routes', '\\js\\view\\assets');

router.get("/qrcode.png", (req, res) => {
    fs.readFile(dirName+'/qrcode.png', (err, data)=>{
        if(err){
            fs.readFile(dirName+'/out.png', (err, data)=>{
                if(err){
                    res.json('Unavaliable');
                }else{
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

router.get('/favicon.ico', (req, res)=>{
    fs.readFile(dirName+'/fav.ico', (err, data)=>{
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(data);
    });
});
  module.exports = router;

