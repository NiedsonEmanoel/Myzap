const Workers = require('../Models/worker.model');
const jwt = require("jsonwebtoken");
const index = require('../index');
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

    async createTokenToRecover(req, res, next) {
        try {
            const { email_usuario } = req.body;

            Worker = await Workers.findOne({ email_usuario }, (err, user) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ "error": err });
                } else if (!user) {
                    res.status(201).json({ "message": "success" });
                } else {

                    const _id = {
                        "id": user._id
                    };

                    let httt = process.env.useHTTPS == '0' ? 'http://' : 'https://'

                    let port = process.env.PORT == '80' ? '' : process.env.PORT == '443' ? '' : `:${process.env.PORT}`;

                    let stringSite;

                    if (!process.env.PRODUCTION_LINK) {
                        stringSite = `${httt}${process.env.HOST}${port}`;
                    }else{
                        stringSite = process.env.PRODUCTION_LINK
                    }

                    const token = jwt.sign(_id, secret + 'recuperation', {
                        expiresIn: '300000'
                    });

                    index.sendEmail({
                        "from": process.env.USER_MAIL,
                        "to": email_usuario,
                        "subject": "Recuperação de senha - MYZAP",
                        "text": `Olá ${user.nome_usuario}, esse é um e-mail para recuperação de sua senha no MYZAP e válido por 5 minutos.\nPara prosseguir clique no link abaixo:\n\n${stringSite}/recovery.pass/${token}\nCaso você não tenha solicitado uma alteração de senha ignore esse e-mail.\n\nCopyright © Niedson Emanoel & Apoastro ${new Date().getFullYear()}`
                    });
                    res.status(200).json({ "message": "success" });
                }
            });

        } catch (e) {
            next(e)
        }
    },

    async changePasswordByToken(req, res, next) {
        try {
            const { token, password } = req.body;
            jwt.verify(token, secret + 'recuperation', async (err, decoded) => {
                if (err) {
                    next(err);
                }

                let Worker;

                try {
                    Worker = await Workers.findById({ _id: decoded.id }).lean();
                } catch (e) {
                    res.status(500).send({ "message": "outOfTime" });
                }


                if (!Worker) {
                    res.status(404).send({
                        "message": "userNotFound",
                        "status": 0
                    });
                }
                console.log(Worker.senha_usuario)
                Worker.senha_usuario = password;



                const response = await Workers.findByIdAndUpdate(decoded.id, Worker);

                res.status(200).send({
                    "message": "success",
                    "status": 1
                })

            })
        } catch (e) {
            next(e);
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

            let data = { nome_usuario, email_usuario, tipo_usuario, senha_usuario, foto_perfil };

            const Worker = await Workers.findByIdAndUpdate(_id, data);

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
        Workers.findOne({ email_usuario: email }, (err, user) => {
            if (err) {
                console.log(err);
                res.status(500).json({ "error": err });
            } else if (!user) {
                res.status(200).json({ status: 2, "error": 'Access denied' });
            } else {
                user.isCorrectPassword(senha, async (err, same) => {
                    if (err) {
                        res.status(500).json({ error: err });
                    } else if (!same) {
                        res.status(200).json({ status: 2, error: "Access denied" });
                    } else {
                        const payload = { email };
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '24h'
                        })
                        res.cookie('token', token);
                        res.status(200).json({ status: 1, auth: true, token: token, user: user });
                    }
                })
            }
        })
    },

    async checkToken(req, res) {
        const token = req.body.token || req.query.token || req.params.token || req.cookies.token || req.headers['x-access-token'] || req.headers.authorization;
        if (!token) {
            res.status(200).json({ status: 401, msg: 'Access denied' });
        } else {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    res.status(200).json({ status: 401, msg: 'Access denied' });
                } else {
                    res.status(200).json({ status: 200, decoded })
                }
            })
        }
    },

    async destroyToken(req, res) {
        const token = req.headers.token || req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'] || req.headers.authorization;
        if (token) {
            res.cookie('token', null);
        } else {
            res.status(200).send("Unauthorized logout!")
        }
        res.send("Session ended successfully!");
    }
}
