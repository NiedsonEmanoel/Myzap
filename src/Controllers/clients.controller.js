const Clients = require('../Models/client.model');
const messageHelper = require('../Models/messages.model')
const path = require('path');
const io = require('../index');
const fs = require('fs');
//const interControl = require('./multisession.controller')
module.exports = {
    async index(req, res, next) {
        try {
            let Client = await Clients.find();
            res.status(200).send({
                "Clients": Client,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async SwitchFist(req, res) {
        const { _id } = req.query;
        const worker = req.body.worker;
        const name = req.body.name

        let userChanges = await Clients.findById({ _id }).lean();

        userChanges.firstAttendace = false;
        userChanges.WorkerAttendance = worker;
        userChanges.NameAttendance = name;
        userChanges.inGrant = false;

        let Client = Clients.findByIdAndUpdate(_id, userChanges, (err, data) => {
            if (err) {
                next(err);
            }

            io.emit('userChanged');

            return res.status(200).send({
                data,
                "message": "ok"
            });

        });

    },

    async togle(req, res, next) {

        const { _id, worker } = req.body;

        let clientChanges = await Clients.findById(_id).lean();

        clientChanges.WorkerAttendance = worker || 'no-one';
        clientChanges.inAttendace = !clientChanges.inAttendace;


        let finalClientes = await Clients.findByIdAndUpdate(_id, clientChanges, (err, data) => {
            if (err) {
                next(err)
            }

            io.emit('userChanged');

            return res.status(200).send({
                data,
                "message": "ok"
            });

        })
    },

    async details(req, res, next) {
        try {
            const { _id } = req.params;

            if (!_id) {
                const error = new Error('_ID not specified');
                error.status = 400;
                next(error);
            }

            let Client = await Clients.find({ _id });
            res.status(200).send({
                "Client": Client,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async getAttendanceBySocket() {
        let ClientsObject = [];
        try {
            let inAttendace = true;

            let Client = await Clients.find({ inAttendace }).sort({ updatedAt: 1 }).lean();

            for (let key in Client) {
                let chatId = Client[key].chatId;

                let lastMessage = await messageHelper.findOne({ chatId }).sort({ createdAt: -1 }).lean();

                let obj = Client[key];

                obj.lastMessage = lastMessage;

                ClientsObject.push(obj);
            }
            return ClientsObject

        } catch (error) {
            ClientsObject = []
            return ClientsObject
        }
    },

    async getAttendace(req, res, next) {
        try {
            let inAttendace = true;

            let Client = await Clients.find({ inAttendace }).sort({ updatedAt: 1 }).lean();

            let ClientsObject = [];
            for (let key in Client) {
                let chatId = Client[key].chatId;

                let lastMessage = await messageHelper.findOne({ chatId }).sort({ createdAt: -1 }).lean();

                let obj = Client[key];

                obj.lastMessage = lastMessage;

                ClientsObject.push(obj);
            }

            res.status(200).send({
                "Client": ClientsObject,

                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async findInternal(chatId) {
        let User = await Clients.findOne({ chatId });
        try {
            let s = User.fullName;
            let user = User;
            let retur = {
                "User": user,
                "Exists": true
            }
            return retur;
        } catch {
            let retur = {
                "User": "",
                "Exists": false
            }
            return retur;
        }
    },

    async create(req, res, next) {
        try {
            let { fullName, profileUrl, chatId } = req.body;

            if (chatId.length == 13) {
                let part1 = chatId.substr(0, 4);
                let part2 = chatId.substr(5, 12)
                chatId = `${part1}${part2}`
            }

            chatId = chatId + '@c.us';

            let data = [];

            let client = await Clients.findOne({ chatId });

            try {
                let s = client.fullName;
                return res.status(400).send({ "message": "Client already been registered." });
            } catch {
                data = { fullName, profileUrl, chatId };

                fs.mkdir(path.resolve(__dirname, '..', 'Uploads') + '/' + chatId, { recursive: true }, () => { });
                user = await Clients.create(data);
                io.emit('userChanged');
                return res.status(200).send({
                    "Client": user,
                    "message": "success"
                });
            }
        } catch (error) {
            next(error);
        }
    },

    async createInternal(fullName, profileUrl, chatId) {
        try {
            let data = { fullName, profileUrl, chatId };
            user = await Clients.create(data);
            return;
        } catch (error) {
            next(error);
        }
    },

    async updateProfilePicInternal(User, profileUrl) {
        User.profileUrl = profileUrl;
        let update = Clients.findByIdAndUpdate(User._id, User, (err, data) => {
            if (err) {
                console.log('Erro na atualização da foto');
            }
            else {
                return;
            }
        })
    },

    async disableGrantMode(User) {
        User.inGrant = false;
        let update = Clients.findByIdAndUpdate(User._id, User, (err, data) => {
            if (err) {
                console.log('Erro na retirada da avaliação');
            }
            else {
                return;
            }
        })
    },

    async updateWithdraw(User, amount) {
        User.WithDrawCash = amount;
        let update = Clients.findByIdAndUpdate(User._id, User, (err, data) => {
            if (err) {
                console.log('Erro na soma do saldo');
            }
            else {
                return;
            }
        })
    },


    async delete(req, res, next) {
        try {
            const { _id } = req.params;
            if (!_id) {
                const error = new Error('_ID not specified');
                error.status = 400;
                next(error);
            }

            let Client = await Clients.findById({ _id });
            if (Client.WithDrawCash != 0) {
                return res.status(500).send({ "message": "não é possivel apagar um client com saldo diferente de 0" });
            }
            io.emit('userChanged');
            return res.status(200).send({
                Client,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const { _id } = req.params;
            const { fullName, profileUrl, chatId } = req.body;
            let Client

            if (!_id) {
                const error = new Error('_ID not specified');
                error.status = 400;
                next(error);
            }

            let userBefore = await Clients.findById(_id).lean();
            userBefore.fullName = fullName;
            userBefore.profileUrl = profileUrl;
            userBefore.chatId = chatId;

            Client = await Clients.findByIdAndUpdate(_id, userBefore, (err, data) => {
                if (err) {
                    next(err)
                } else {
                    res.status(200).send({
                        data,
                        "message": "success"
                    });
                }
            });

        } catch (error) {
            next(error);
        }
    },

    async switchAt(req, res, next) {
        try {
            const { _id } = req.params;
            let userChanges = await Clients.findById({ _id }).lean();

            userChanges.inAttendace = false;
            userChanges.firstAttendace = true;
            userChanges.WorkerAttendance = 'no-one';
            userChanges.inGrant = true;

            let Client = Clients.findByIdAndUpdate(_id, userChanges, (err, data) => {
                if (err) {
                    next(err);
                }

                io.emit('userChanged');

                return res.status(200).send({
                    data,
                    "message": "ok"
                });
            })
        } catch (e) {
            next(e);
        }
    },

    async switchFirst(user) {
        try {
            let { _id, fullName, profileUrl, chatId, inAttendace, firstAttendace } = user;
            inAttendace = true;
            firstAttendace = true;
            data = { fullName, profileUrl, chatId, inAttendace, firstAttendace };
            let Client = await Clients.findByIdAndUpdate(_id, data);
            io.emit('userChanged');
            return firstAttendace;
        } catch (e) {
            console.error(e)
        }
    }
}
