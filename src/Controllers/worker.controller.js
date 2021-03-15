const Workers = require('../Models/worker.model');

module.exports = {
    async index(req, res, next) {
        try {
            let Worker = await Workers.find();
            res.status(200).send({
                "Workers": Worker,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async details(req, res, next) {
        try {
            const { _id } = req.params;

            if (!_id) {
                const error = new Error('_ID not specified');
                error.status = 400;
                next(error);
            }

            let Worker = await Workers.find({ _id });

            res.status(200).send({
                "Worker": Worker,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const { nome_usuario, email_usuario, tipo_usuario, senha_usuario, foto_perfil } = req.body;
            let data = [];

            let Worker = await Workers.findOne({ email_usuario });

            try {
                let s = Worker.fullName;
                return res.status(400).send({ "message": "Worker already been registered." });
            } catch {
                data = { nome_usuario, email_usuario, tipo_usuario, senha_usuario, foto_perfil };
                Worker = await Workers.create(data);
                return res.status(200).send({
                    "Worker": Worker,
                    "message": "success"
                });
            }
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const { _id } = req.params;
            if (!_id) {
                const error = new Error('_ID not specified');
                error.status = 400;
                next(error);
            }

            let Worker = await Workers.findByIdAndDelete({ _id });
            return res.status(200).send({
                Worker,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const { _id } = req.params;
            const { nome_usuario, email_usuario, tipo_usuario, senha_usuario, foto_perfil } = req.body;

            if (!_id) {
                const error = new Error('_ID not specified');
                error.status = 400;
                next(error);
            }

            data = { nome_usuario, email_usuario, tipo_usuario, senha_usuario, foto_perfil };

            const Worker = await Workers.findOneAndUpdate({ _id }, data, { new: true });

            res.status(200).send({
                Worker,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    }
}
