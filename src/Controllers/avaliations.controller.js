const AvaliationsModel = require('../Models/stars.model');
const moment = require('moment')
module.exports = {
    async createAvaliation(Name, Avaliation) {
        if (Avaliation >= 10) {
            Avaliation = 10
        }

        if (Avaliation <= 0) {
            Avaliation = 0
        }

        let data = { Name, Avaliation };

        let av = await AvaliationsModel.create(data);
        return;
    },

    async index(req, res, next) {
        try {
            let Avaliations = await AvaliationsModel.find().lean();
            res.status(200).send({ Avaliations })
        } catch (e) {
            next(e)
        }
    },

    async medialByDay(req, res, next) {
        try {
            let days = parseInt(req.query.days);
            if (!days) {
                days = 7;
            }

            let response = []

            for (let i = days; i != 0; i--) {
                let dateLimit = moment().subtract(i, 'days');
                let Avaliations = await AvaliationsModel.find().lean();
                let avaliationsFromThisDay = [];

                let len = 0;
                let soma = 0


                for (let key in Avaliations) {
                    let CreatedAT = moment(Avaliations[key].createdAt);
                    if (CreatedAT.diff(dateLimit, 'days') == 0) {
                        len++;
            
                        soma = soma + Avaliations[key].Avaliation
                    }
                }
                let total = len == 0 ? 1 : len;
                response.push({
                    "Media": soma / total,
                    "Data": new Date(dateLimit).toLocaleDateString('pt-BR')
                })

            }
            res.send(response)
        } catch (e) {
            next(e)
        }
    },

    async indexAv(req, res, next) {
        try {
            let dateNow = parseInt(`${new Date().getTime()}`)

            let Avaliations = await AvaliationsModel.find().lean();

            let dias = parseInt(req.query.days);
            if (!dias) {
                dias = -1
            }

            let len = 0;
            let Soma = 0;

            for (let key in Avaliations) {
                if (dias == -1) {
                    Soma = Soma + Avaliations[key].Avaliation;
                    len = Avaliations.length
                } else {
                    let createdAT = parseInt(`${new Date(Avaliations[key].createdAt).getTime()}`);
                    if (((dateNow - createdAT) <= dias * 86400000)) {
                        Soma = Soma + Avaliations[key].Avaliation;
                        len++;
                    }
                }
            }

            let tamanho = len == 0 ? 1 : len;

            let Media = Soma / tamanho;

            res.status(200).send({
                Media,
                "Length": len,
                "Days": dias,
                "Message": "Success"
            })

        } catch (e) {
            next(e)
        }
    },

    async createByRoute(req, res, next) {
        try {
            let { Name, Avaliation } = req.body;

            if (Avaliation >= 10) {
                Avaliation = 10
            }

            if (Avaliation <= 0) {
                Avaliation = 0
            }

            let data = { Name, Avaliation };

            let av = await AvaliationsModel.create(data, (err, ds) => {
                if (err) {
                    next(err)
                }
                res.status(200).send({ "Data": ds });
            });
        } catch (e) {
            next(e)
        }
    }
}