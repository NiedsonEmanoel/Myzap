"use strict";
const express = require('express');
const preferences = require('../model/preferences');
const Router = express.Router();

Router.get('/', (req, res) => {
    res.status(200).send(preferences.ignoreContact);
});

Router.get('/:id', (req, res) => {
    let id = req.params.id + '@c.us';
    for (ignoreKey in preferences.ignoreContact) {
        if (preferences.ignoreContact[ignoreKey].number == id) {
            res.status(200).send({
                "mensagem": "O numero está na lista de ignorados",
                "response": "true",
                "contact": preferences.ignoreContact[ignoreKey]
            });
        }
    }
    res.status(200).send({
        "mensagem": "O numero não está na lista de ignorados",
        "response": "false",
        "contact":"null"
    });
});

Router.get('/first/:id', (req, res) => {
    let id = req.params.id + '@c.us';
    console.log(id);

    let firtNumbers = [];

    if (preferences.firstIgnore.length) {
        for (let i = 0; i < preferences.firstIgnore.length; i++) {
            firtNumbers.push(preferences.firstIgnore[i].number);
        }

        if (firtNumbers.includes(id)) {
            res.status(200).send({
                "mensagem": "O numero ainda não entrou em contato após a solicitação de suporte.",
                "response": "true"
            });
        } else {
            res.status(200).send({
                "mensagem": "O numero já entrou em contato após a solicitação.",
                "response": "false"
            });
        }
    } else {
        res.status(400).send({
            "mensagem": "O firstIgnore está zerado",
            "response": "false"
        });
    }
});

Router.post('/', (req, res) => { //Adicionar
    const contact = {
        "number": req.body.numero + '@c.us',
        "name": req.body.nome,
        "photo": req.body.foto
    }

    preferences.addIgnore(req.body.numero + '@c.us', req.body.nome, req.body.foto);

    res.status(201).send({
        "mensagem": "Adicionado a lista de ignorados com sucesso",
        "sucess":"true",
        "client": contact
    });
});

Router.delete('/', (req, res) => {
    preferences.ignoreContact = [];
    preferences.firstIgnore = [];

    res.status(200).send({
        "mensagem": "Lista de contatos em atendimento zerada."
    });
});

Router.delete('/:numero', (req, res) => {
    for (let key in preferences.ignoreContact) {
        if (preferences.ignoreContact[key].number == req.params.numero + '@c.us') {
            preferences.remIgnore(req.params.numero + '@c.us');
            res.send({
                "mensagem":"Numero apagado com sucesso",
                "sucess":"true"
            });
        } else {
            res.status(400).send({
                "mensagem": "Numero não existente",
                "sucess":"false"
            });
        }
    }
});

module.exports = Router;