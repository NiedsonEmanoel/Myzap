const express = require('express');
const preferences = require('../model/preferences');
const Router = express.Router(); 

Router.get('/', (req, res)=>{
    res.status(200).send(preferences.ignoreContact);
});

Router.post('/', (req, res)=>{ //Adicionar
    preferences.addIgnore(req.body.numero+'@c.us');
    res.status(201).send({
        "mensagem": "Adicionado a lista de ignorados com sucesso",
        "client":req.body.numero
    });    
});

Router.delete('/:number', (req, res)=>{
    if(preferences.ignoreContact.includes(req.params.number)){
        preferences.remIgnore(req.params.number+'@c.us');
        res.status(200).send({
            "mensagem": "Apagado com sucesso",
            "numero":req.params.number
        });
    }else{
        res.status(400).send({
            "mensagem": "Numero não existente"
        });
    }
});

module.exports = Router;