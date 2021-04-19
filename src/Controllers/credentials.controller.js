const Credentials = require('../Models/credentials.dflow.model');
const Engine = require('./multisession.controller');

module.exports = {
    async index(req, res, next) {
        try {
            let Credential = await Credentials.find();
            res.status(200).send({
                "Credentials": Credential,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async indexAlias(req, res, next) {
        try {
            let Credential = await Credentials.find();
            let alias = []

            for(let key in Credential){
                alias.push(Credential[key].alias);
            }

            res.status(200).send({
                "alias": alias,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async createCredential(req, res, next) {
        try {
            const alias = req.body.alias;


            const credential = {
                type,
                project_id,
                private_key_id,
                private_key,
                client_email,
                client_id,
                auth_uri,
                token_uri,
                auth_provider_x509_cert_url,
                client_x509_cert_url
            } = req.body.credential;
            let data = [];

            let Credential = (await Credentials.findOne({ alias }));

            try {
                let s = Credential.alias;
                return res.status(400).send({ "message": "Credential already been registered." });
            } catch (e) {
                data = { alias, credential };
                Credential = await Credentials.create(data);

                return res.status(200).send({
                    "Credential": Credential,
                    "message": "success"
                });
            }

        } catch (e) {
            next(e);
        }
    },

    async setCredential(req, res, next) {
        try {
            const { alias } = req.body;
            const id = req.query.id;
            const Credential = await (await Credentials.findOne({ alias })).credential;
            if (Credential) {
                Engine.setCredential(Credential, id, alias);
                return res.status(200).send({
                    "Credential": Credential,
                    "message": "success"
                });
            }else{
                return res.status(404).send({
                    "Credential": Credential,
                    "message": "success"
                });
            }
        } catch (e) {
            next(e);
        }
    },

    async deleteCredential(req, res, next) {
        try {
            const alias = req.body.alias;

            let Credential = (await Credentials.findOneAndDelete({ alias }));
            return res.status(200).send({
                "Credential": Credential,
                "message": "success"
            });

        } catch (e) {
            next(e);
        }
    }
}