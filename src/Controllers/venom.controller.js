const Venom = require('./Classes/Venom');
const WhatsApp = new Venom();

module.exports = {
    async Iniciar() {
        await WhatsApp.initVenom().then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    },

    async receberChatsNovos(req, res) {
        let Chats = await WhatsApp.Client.getAllChatsNewMsg();
        let chats = [];

        for (let key in Chats) {
            if (Chats[key].id.server == 'c.us') {
                chats.push(Chats[key]);
            }
        }

        res.status(200).send({
            chats,
            "message": "success"
        });
    },

    async verificarNumero(req, res) {
        let number = req.query.number + '@c.us';
        const profile = await WhatsApp.Client.getNumberProfile(number);
        res.status(200).send({
            profile,
            "message": "success"
        });
    },

    async enviarMensagens(req, res) {
        let numbers = new String(req.body.numbers);
        let messages = new String(req.body.message);

        numbers = numbers.replace(/\s/g, '');

        let arrNumbers = numbers.split(',');
        let arrMessages = messages.split('/:end:/');

        for (let key in arrNumbers) {
            for (let keyM in arrMessages) {
                await WhatsApp.Client.sendText(arrNumbers[key] + '@c.us', arrMessages[keyM]);
            }
        }

        /*{
            "numbers":"558754756985, 5598652135",
            "message": "Eae gente, tudo bem com vocês?/:end:/Hoje é isso./:end:/Tudo Beleza."
        }*/

        res.status(200).send({
            "messages": arrMessages,
            "to": arrNumbers,
            "message": "success"
        });
    },

    async nivelBateria(req, res){
        let level = WhatsApp.Client.getBatteryLevel();
        res.status(200).send({
            "level": level,
            "message": "success"
        });
    },

    async enviarArquivoBase64(req, res) {
        let numbers = new String(req.body.numbers);
        numbers = numbers.replace(/\s/g, '');

        let arrNumbers = numbers.split(',');
        let base64 = req.body.base64;
        let name = req.body.filename;
        let messages = req.body.message

        for (let key in arrNumbers) {
            await WhatsApp.Client.sendFileFromBase64(arrNumbers[key] + '@c.us', base64, name, messages);
        }

        res.status(200).send({
            name,
            messages,
            'to': arrNumbers,
            "message": "success"
        });
    }
}