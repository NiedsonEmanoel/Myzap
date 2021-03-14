const Clients = require('../Models/client.model');

module.exports = {
    async index (req, res) {
        let Client = await Clients.find();
        res.status(200).send({
            "Clients": Client,
            "message": success
        });
    }, 
    async findInternal(chatId) {
        let User = await Clients.findOne({ chatId });
        if(!User){
            return false;
        }else{
            true;
        }
    }
}
