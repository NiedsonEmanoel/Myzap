const dialogflow = require('./Classes/Dialogflow')
const path = require('path')
module.exports = {
    async processMessage(req, res, next) {
        try{
            let {idJson, idSession, Message} = req.body;
            if(!idJson){
                idJson = 0
            }
            const bot = new dialogflow(path.resolve(__dirname, `../tokens/dialogflow${idJson}.json`), 'pt-BR', idSession)
            const response = await bot.sendText(Message)
            res.status(200).send(response)
        }catch(e){
            next(e)
        }
    }
}