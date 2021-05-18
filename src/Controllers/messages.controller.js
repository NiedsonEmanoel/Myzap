const Messages = require('../Models/messages.model');
const io = require('../index')

module.exports = {
    async index(req, res, next) {
        try {
            let Message = await Messages.find();
            res.status(200).send({
                "Messages": Message,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async details(req, res, next) {
        try {
            let { chatId } = req.params;
            chatId = chatId.replace('@c.us', '');
            chatId = chatId + '@c.us';

            if (!chatId) {
                const error = new Error('_ID not specified');
                error.status = 400;
                next(error);
            }

            let Message = await Messages.find({ chatId }).sort({ createdAt: 1 });

            res.status(200).send({
                "Message": Message,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteManyMessages(req, res, next) {
        try {
            let { chatId } = req.params;
            chatId = chatId.replace('@c.us', '');
            chatId = chatId + '@c.us';

            if (!chatId) {
                const error = new Error('_ID not specified');
                error.status = 400;
                next(error);
            }

            await Messages.deleteMany({ chatId }, (err, data) => {
                if (err) {
                    next(err);
                }

                io.emit('newMessage', { "from": chatId });

                res.status(200).send({
                    data,
                    "message": "success"
                });
            });
        } catch (e) {
            next(e);
        }
    },

    async createText(type, author, body, chatId, isServer) {
        if (!isServer) {
            isServer = false;
        }
        let data = { type, author, body, chatId, isServer };
        let Message = await Messages.create(data);
        return;
    },

    async createPayment(author, body, chatId, amount, currency) {
        let type = 'payment';
        let isServer = false;
        let data = { type, author, body, chatId, amount, currency, isServer };
        let Message = await Messages.create(data);
        return;
    },

    async createMedia(type, fileName, fileLink, author, chatId, fileLinkDownload, isServer) {
        let body = type;
        let data = { type, author, fileName, fileLink, chatId, fileLinkDownload, body, isServer };
        Message = await Messages.create(data);
        return;
    }
}