const Clients = require('../Models/client.model');
const messageHelper = require('../Models/messages.model')
const path = require('path');
const io = require('../index');
const fs = require('fs');
//const interControl = require('./multisession.controller')
module.exports = {

    async SwitchFist(req, res) {
        async function switchAttendance(user, worker) {
            let { _id, fullName, profileUrl, chatId, inAttendace, firstAttendace } = user;

            firstAttendace = false;

            data = { fullName, profileUrl, chatId, inAttendace, firstAttendace };

            let Client = await Clients.findByIdAndUpdate({ _id }, data, { new: true });

            return inAttendace;
        }

        const { _id } = req.query;
        console.log(_id)
        const worker = req.body.worker;
        const user = await Clients.findOne({ _id }).lean();

        await switchAttendance(user, worker);
        io.emit('userChanged');
        return res.status(200).send({
            "message": "ok"
        });
    },

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

    async getAttendace(req, res, next) {
        try {
            let inAttendace = true;

            let Client = await Clients.find({ inAttendace }).sort({ updatedAt: 1 });

            let ClientsObject = [];
            for (let key in Client) {
                let chatId = Client[key].chatId;

                let lastMessage = await messageHelper.findOne({ chatId }).sort({ createdAt: -1 });

                let obj = Client[key].toObject();

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
                fs.mkdir(path.resolve('./', 'Uploads') + '/' + chatId, { recursive: true }, () => { });
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


    async delete(req, res, next) {
        try {
            const { _id } = req.params;
            if (!_id) {
                const error = new Error('_ID not specified');
                error.status = 400;
                next(error);
            }

            let Client = await Clients.findByIdAndDelete({ _id });
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

            if (!_id) {
                const error = new Error('_ID not specified');
                error.status = 400;
                next(error);
            }

            data = { fullName, profileUrl, chatId };

            const Client = await Clients.findOneAndUpdate({ _id }, data, { new: true });

            res.status(200).send({
                Client,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async switchAt(req, res) {

        async function switchAttendance(user) {
            let { _id, fullName, profileUrl, chatId, inAttendace, firstAttendace } = user;
            inAttendace = inAttendace === true ? false : true;
            data = { fullName, profileUrl, chatId, inAttendace, firstAttendace };
            let Client = await Clients.findByIdAndUpdate({ _id }, data);
            return inAttendace;
        }
        const { _id } = req.params;
        const user = await Clients.findOne({ _id }).lean();
        await switchAttendance(user);
        io.emit('userChanged');
        return res.status(200).send({
            "message": "ok"
        });
    },

    async switchFirst(user) {
        try {
            let { _id, fullName, profileUrl, chatId, inAttendace, firstAttendace } = user;
            inAttendace = true;
            firstAttendace = true;
            data = { fullName, profileUrl, chatId, inAttendace, firstAttendace };
            let Client = await Clients.findOneAndUpdate({ _id }, data, { new: false });
            io.emit('userChanged');
            return firstAttendace;
        } catch (e) {
            console.error(e)
        }
    }
}
