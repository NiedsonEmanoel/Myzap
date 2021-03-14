const Clients = require('../Models/client.model');

module.exports = {
    async index(req, res) {
        let Client = await Clients.find();
        res.status(200).send({
            "Clients": Client,
            "message": success
        });
    },

    async findInternal(chatId) {
        let User = await Clients.findOne({ chatId });
        try{
            let s = User.fullName;
            return true;
        }catch{
            return false;
        }
    },

    async create(req, res) {
        const { fullName, profileUrl, chatId } = req.body;
        let data = [];

        let client = await Clients.findOne({ chatId });

        if (!client) {
            data = { fullName, profileUrl, chatId };
            user = await Clients.create(data);
            return res.status(200).send({
                "Client": user,
                "message": "success"
            })
        } else {
            return res.status(400).send({ "message": "Cliente já existe" })
        }
    },

    async createInternal(fullName, profileUrl, chatId) {
        let data = { fullName, profileUrl, chatId };
        user = await Clients.create(data);
        return;
    }
}
