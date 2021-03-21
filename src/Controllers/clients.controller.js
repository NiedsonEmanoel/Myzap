const Clients = require('../Models/client.model');
const path = require('path');
const fs = require('fs');
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

            let Client = await Clients.find({ inAttendace }).sort({updatedAt: 1});
            

            res.status(200).send({
                "Client": Client,
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

    async switchAttendance(user) {
        try {
            let { _id, fullName, profileUrl, chatId, inAttendace, firstAttendace } = user;
            inAttendace = inAttendace === true ? false : true;
            data = { fullName, profileUrl, chatId, inAttendace, firstAttendace };
            let Client = await Clients.findOneAndUpdate({ _id }, data, { new: true });
            return inAttendace;
        } catch (e) {
            console.error(e)
        }
    },

    async switchFirst(user) {
        try {
            let { _id, fullName, profileUrl, chatId, inAttendace, firstAttendace } = user;
            firstAttendace = firstAttendace === true ? false : true;
            data = { fullName, profileUrl, chatId, inAttendace, firstAttendace };
            let Client = await Clients.findOneAndUpdate({ _id }, data, { new: true });
            return firstAttendace;
        } catch (e) {
            console.error(e)
        }
    }
}
