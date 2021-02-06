const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get("/qrcode.png", (req, res, next) => {
    fs.readFile("assets/qr-out.png", (err, data) => {
      if(err) {
        fs.readFile("assets/out.png", (err, data) => {
          if(err){
            res.json("Unavaliable");
          }
          else{
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

  router.get("/nmweb.png", (req, res) => {
    fs.readFile("assets/nmweb.png", (err, data) => {
      if(err) {}  
      else{
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(data);
      }
    });
  });

module.exports = router;