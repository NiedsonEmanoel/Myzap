const express = require('express');
const preferences = require('../model/preferences');
const Router = express.Router(); 

Router.get('/', (req, res)=>{
    res.status(200).send(preferences.ignoreContact);
});

Router.get('/:id', (req, res)=>{
    let id = req.params.id;
    if(preferences.ignoreContact.includes(id)){
        res.status(200).send({
            "mensagem":"O numero está na lista de ignorados",
            "response":"true"
        });
    }else{
        res.status(200).send({
            "mensagem":"O numero não está na lista de ignorados",
            "response":"false"
        });
    }
});

Router.get('/first', (req, res)=>{
    res.status(200).send(preferences.firstIgnore);
});

Router.get('/first/:id', (req, res)=>{
    if(preferences.firstIgnore.includes(id)){
        res.status(200).send({
            "mensagem":"O numero está na lista do primeiro contato",
            "response":"true"
        });
    }else{
        res.status(200).send({
            "mensagem":"O numero não está na lista do primeiro contato",
            "response":"false"
        });
    }
});

Router.post('/', (req, res)=>{ //Adicionar
    preferences.addIgnore(req.body.numero+'@c.us');
    res.status(201).send({
        "mensagem": "Adicionado a lista de ignorados com sucesso",
        "client":req.body.numero
    });    
});

Router.delete('/', (req, res)=>{
    preferences.ignoreContact = [];
    preferences.firstIgnore = [];

    res.status(200).send({
        "mensagem":"Lista de contatos em atendimento zerada."
    });
});

Router.delete('/:numero', (req, res)=>{
    if(preferences.ignoreContact.includes(req.params.number)){
        preferences.remIgnore(req.params.numero+'@c.us');
        res.status(200).send({
            "mensagem": "Apagado com sucesso",
            "numero":req.params.numero
        });
    }else{
        res.status(400).send({
            "mensagem": "Numero não existente"
        });
    }
});

module.exports = Router;