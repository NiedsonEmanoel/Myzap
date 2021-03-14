const Venom = require('./Classes/Venom');
const path = require('path');
const fs = require('fs');
let sessions = [];
let started = [];
let limit = new Number(process.env.SESSION_LIMIT) || 16;

module.exports = {
    async createInternal() {
        for (let index = 0; index < limit; index++) {
            sessions[index] = new Venom(index, process.env.GCP_PROJECT_NAME, process.env.JSON_LOCATION, process.env.LANGUAGE_CODE);
        }
    },

    getSessions() {
        return started;
    },

    getLimit() {
        return limit;
    },

    async getMax(req, res) {
        let max = sessions.length;
        let sessionsX = [];

        for (let i = 0; i < max; i++) {
            sessionsX.push(i);
        }

        res.status(200).send({
            "numberOfSessions": max,
            "sessions": sessionsX
        });
    },

    async initilizeInternal() {
        started.push('0');
        await sessions[0].initVenom().then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    },

    async initializeSession(req, res) {
        let id = req.query.id;
        if (!id) {
            res.status(400).send({
                "message": "id não informado"
            });
        }
        try {
            await sessions[id].initVenom().then(() => {
                started.push(id);
                res.status(200).send({
                    "id": id,
                    "message": "success"
                });
            }).catch((e) => {
                res.status(400).send({
                    "id": id,
                    "message": "error",
                    "error": e
                });
            });
        } catch (e) {
            res.status(500).send({
                "id": id,
                "message": "error",
                "error": e
            });
        }
    },

    verifySession(req, res) {
        let id = req.params.id;
        if (!id) {
            res.status(400).send({
                "message": "id não informado"
            });
        }

        if (started.includes(id)) {
            res.status(200).send({
                "message": "success",
                "started": "true"
            });
        } else {
            res.status(404).send({
                "message": "success",
                "started": "false"
            });
        }
    },

    async receberChatsNovos(req, res) {
        let id = req.query.id;
        if (!id) {
            res.status(400).send({
                "message": "id não informado"
            });
        }
        let Chats = await sessions[id].Client.getAllChatsNewMsg();
        let chats = [];

        for (let key in Chats) {
            if (Chats[key].id.server == 'c.us') {
                chats.push(Chats[key]);
            }
        }

        res.status(200).send({
            "id": id,
            chats,
            "message": "success"
        });
    },

    async verificarNumero(req, res) {
        let id = req.query.id;
        if (!id) {
            res.status(400).send({
                "message": "id não informado"
            });
        }
        let number = req.params.number + '@c.us';
        const profile = await sessions[id].Client.getNumberProfile(number);
        if (profile.status != 404) {
            res.status(200).send({
                "id": id,
                profile,
                "message": "success"
            });
        } else {
            res.status(404).send({
                "id": id,
                profile,
                "message": "success"
            });
        }
    },


    async enviarMensagens(req, res) {
        let id = req.query.id;
        if (!id) {
            res.status(400).send({
                "message": "id não informado"
            });
        }

        let numbers = new String(req.body.numbers);
        let messages = new String(req.body.messages);

        numbers = numbers.replace(/\s/g, '');

        let arrNumbers = numbers.split(',');
        let arrMessages = messages.split('/:end:/');

        for (let key in arrNumbers) {
            for (let keyM in arrMessages) {
                if (arrNumbers[key].length == 13) {
                    let part1 = arrNumbers[key].substr(0, 4);
                    let part2 = arrNumbers[key].substr(5, 12)
                    arrNumbers[key] = `${part1}${part2}`
                }
                await sessions[id].Client.sendText(arrNumbers[key] + '@c.us', arrMessages[keyM]);
            }
        }

        res.status(200).send({
            "id": id,
            "messages": arrMessages,
            "to": arrNumbers,
            "message": "success"
        });
    },

    async inputDeviceInfo(req, res) {
        let id = req.query.id;
        if (!id) {
            res.status(400).send({
                "message": "id não informado"
            });
        }
        let info = await sessions[id].Client.getHostDevice();

        res.status(200).send({
            "id": id,
            "device": info,
            "message": "success"
        });
    },

    async nivelBateria(req, res) {
        let id = req.query.id;
        if (!id) {
            res.status(400).send({
                "message": "id não informado"
            });
        }
        let level = await sessions[id].Client.getBatteryLevel();
        res.status(200).send({
            "id": id,
            "level": level,
            "message": "success"
        });
    },

    async enviarArquivoBase64(req, res) {
        let id = req.query.id;
        if (!id) {
            res.status(400).send({
                "message": "id não informado"
            });
        }
        let numbers = new String(req.body.numbers);
        numbers = numbers.replace(/\s/g, '');

        let arrNumbers = numbers.split(',');
        let base64 = req.body.base64;
        let name = req.body.name || 'file';
        let message = req.body.message || '';

        for (let key in arrNumbers) {
            try {
                if (arrNumbers[key].length == 13) {
                    let part1 = arrNumbers[key].substr(0, 4);
                    let part2 = arrNumbers[key].substr(5, 12)
                    arrNumbers[key] = `${part1}${part2}`
                }
                await sessions[id].Client.sendFileFromBase64(arrNumbers[key] + '@c.us', base64, name, message);
            } catch (e) {
                res.status(400).send({
                    "id": id,
                    'to': arrNumbers,
                    "message": e.text
                });
            }
        }

        res.status(200).send({
            "id": id,
            name,
            message,
            'to': arrNumbers,
            "message": "success"
        });
    },

    async todosAsMensagensDoNumero(req, res) {
        let id = req.query.id;
        if (!id) {
            res.status(400).send({
                "message": "id não informado"
            });
        }
        let number = req.params.number + '@c.us';
        let includesMe = Boolean(req.query.includeMe === 'true');

        let messages = await sessions[id].Client.getAllMessagesInChat(number, includesMe);

        res.status(200).send({
            "id": id,
            "messagesList": messages,
            "message": "success"
        });
    },

    async closeSession(req, res) {
        let id = req.query.id;
        if (id == 0) {
            res.status(400).send({
                "message": "Não é possível fechar a sessão principal."
            });
        } else if (!started.includes(id)) {
            res.status(404).send({
                "message": "Não é possível fechar uma sessão não inicializada"
            });
        }
        else {
            await sessions[id].Client.close();
            res.status(200).send({
                "id": id,
                "message": "success"
            });
        }
    },

    async qrCode(req, res) {
        let id = req.query.id;
        if (!id) {
            id = 0;
        }
        const tempDir = path.resolve('./', 'Controllers', 'Classes', 'Temp')
        const QrCode = path.resolve(tempDir, 'qrcode' + id + '.png');
        const QrOut = path.resolve(tempDir, 'out.png');

        res.setHeader('Refresh', 5);

        fs.readFile(QrCode, (err, data) => {
            if (err) {
                fs.readFile(QrOut, (err, data) => {
                    if (err) {
                        res.status(500).json("Unavaliable");
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'image/png' });
                        res.end(data);
                    }
                });
            } else {
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.end(data);
            }
        });
    },
}
