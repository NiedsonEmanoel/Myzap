const Workers = require('../Models/worker.model');
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

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
    },

    async login(req, res) {
        const { email, senha } = req.body;
        Usuario.findOne({ email_usuario: email }, function (err, user) {
            if (err) {
                console.log(err);
                res.status(200).json({ erro: "Erro no servidor. Por favor, tente novamente" });
            } else if (!user) {
                res.status(200).json({ status: 2, error: 'E-mail não encontrado no banco de dados' });
            } else {
                user.isCorrectPassword(senha, async function (err, same) {
                    if (err) {
                        res.status(200).json({ error: "Erro no servidor. Por favor, tente novamente" });
                    } else if (!same) {
                        res.status(200).json({ status: 2, error: "A senha não confere" });
                    } else {
                        const payload = { email };
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '24h'
                        })
                        res.cookie('token', token, { httpOnly: true });
                        res.status(200).json({ status: 1, auth: true, token: token, id_client: user._id, user_name: user.nome_usuario, user_type: user.tipo_usuario });
                    }
                })

            }
        })
    },

    async checkToken(req, res) {
        const token = req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'] || req.headers.authorization;
        if (!token) {
            res.json({ status: 401, msg: 'Não autorizado: Token inexistente!' });
        } else {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({ status: 401, msg: 'Não autorizado: Token inválido!' });
                } else {
                    res.json({ status: 200 })
                }
            })
        }
    },

    async destroyToken(req, res) {
        const token = req.headers.token;
        if (token) {
            res.cookie('token', null, { httpOnly: true });
        } else {
            res.status(401).send("Logout não autorizado!")
        }
        res.send("Sessão finalizada com sucesso!");
    }
}
