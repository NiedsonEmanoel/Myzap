const Venom = require('./Classes/Engine');
const path = require('path');
const fs = require('fs');
let sessions = [];
let started = [];
const auxFunctions = require('../Functions/index')
let limit = new Number(process.env.SESSION_LIMIT) || 16;
const io = require('../index');
const messageHelper = require('./messages.controller');

module.exports = {
    async createInternal() {
        let dir = process.env.JSON_LOCATION || __dirname+'../dialogflow.json';
        const internalCredential = require(path.resolve(dir));
        for (let index = 0; index < limit; index++) {
            sessions[index] = new Venom(index, internalCredential, process.env.LANGUAGE_CODE, 'Credencial Interna');
        }
    },

    getSessions() {
        return started;
    },

    getLimit() {
        return sessions.length;
    },

    setCredential(credential, id, alias) {
        sessions[id].setCredential(credential, alias);
    },

    getAlias(req, res, next) {
        try {
            let id = req.query.id;
            const alias = sessions[id].getAlias();
            return res.status(200).send({ "alias": alias });
        } catch (e) {

        }
    },

    async getMax(req, res, next) {
        try {
            let max = sessions.length;
            let sessionsX = [];

            for (let i = 0; i < max; i++) {
                sessionsX.push(i);
            }

            res.status(200).send({
                "numberOfSessions": max,
                "sessions": sessionsX
            });
        } catch (error) {
            next(error);
        }
    },

    async initilizeInternal() {
        started.push('0');
        await sessions[0].initVenom().then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    },

    async initializeSession(req, res, next) {
        let id = req.query.id;
        if (!id) {
            const error = new Error('ID not specified');
            error.status = 400;
            next(error);
        }
        try {
            started.push(id);
            io.emit('sessionChanged', {});
            await sessions[id].initVenom().then(() => {
                io.emit('sessionChanged', {});
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
        } catch (error) {
            next(error);
        }
    },

    verifySession(req, res, next) {
        try {
            let id = req.params.id;
            if (!id) {
                const error = new Error('ID not specified');
                error.status = 400;
                next(error);
            }

            if (started.includes(id)) {
                res.status(200).send({
                    "message": "success",
                    "started": true
                });
            } else {
                res.status(200).send({
                    "message": "success",
                    "started": false
                });
            }
        } catch (error) {
            next(error);
        }
    },

    async receberChatsNovos(req, res, next) {
        try {
            let id = req.query.id;
            if (!id) {
                const error = new Error('ID not specified');
                error.status = 400;
                next(error);
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
        } catch (error) {
            next(error);
        }
    },

    async verificarNumero(req, res, next) {
        try {
            let id = req.query.id;
            if (!id) {
                const error = new Error('ID not specified');
                error.status = 400;
                next(error);
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
        } catch (error) {
            next(error);
        }
    },


    async enviarMensagens(req, res, next) {
        try {
            let id = req.query.id;
            let worker = req.body.worker;
            let numbers = new String(req.body.numbers);
            let messages = new String(req.body.messages);

            if (!numbers) {
                const error = new Error('Number not specified');
                error.status = 400;
                next(error);
            }

            if (numbers == "attendance@c.us") {
                await messageHelper.createText('chat', worker, mess, "attendance" + '@c.us', false);
                io.emit('newAttendanceChat', { "from": "attendance@c.us" });
                return res.status(200).send({ "message": "success" })
            }

            if (!worker) {
                const error = new Error('Worker not specified');
                error.status = 400;
                next(error);
            }

            if (!messages) {
                const error = new Error('Message not specified');
                error.status = 400;
                next(error);
            }

            numbers = numbers.replace(/\s/g, '');

            let arrNumbers = numbers.split(',');
            let arrMessages = messages.split('/:end:/');
            let visualMessage = messages.split('/:end:/');

            for (let key in arrMessages) {
                arrMessages[key] = `*${worker}:*\n\n${arrMessages[key]}`
            }

            for (let key in arrNumbers) {
                for (let keyM in arrMessages) {
                    if (arrNumbers[key].length == 13) {
                        let part1 = arrNumbers[key].substr(0, 4);
                        let part2 = arrNumbers[key].substr(5, 12)
                        arrNumbers[key] = `${part1}${part2}`
                    }
                    let from = arrNumbers[key] + '@c.us';
                    let mess = arrMessages[keyM].replace(`*${worker}:*`, '')

                    if (keyM == 0) {
                        await messageHelper.createText('chat', worker, mess, arrNumbers[key] + '@c.us', true);
                    }
                    
                    io.emit('newMessageSent', { "from": from });
                    sessions[id].Client.sendText(arrNumbers[key] + '@c.us', arrMessages[keyM]);
                }
            }

            res.status(200).send({
                "id": id,
                "worker": worker,
                "messages": visualMessage,
                "to": arrNumbers,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async sendMessageInternal(chatid, message) {
        await sessions[0].Client.sendText(chatid, message);
    },

    async deleteChatMessages(req, res, next) {
        let id = req.query.id;
        let { chatId } = req.params;
        chatId = chatId.replace('@c.us', '');
        chatId = chatId + '@c.us';

        fs.rmdir(path.resolve('./', 'Uploads', chatId), { recursive: true }, () => { });

        if (!id) {
            const error = new Error('ID not specified');
            error.status = 400;
            next(error);
        }

        sessions[id].Client.deleteChat(chatId);

        res.status(200).send({
            "message": "success"
        });
    },

    async inputDeviceInfo(req, res, next) {
        try {
            let id = req.query.id;
            if (!id) {
                const error = new Error('ID not specified');
                error.status = 400;
                next(error);
            }
            let info = await sessions[id].Client.getHostDevice();

            res.status(200).send({
                "id": id,
                "device": info,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async nivelBateria(req, res, next) {
        try {
            let id = req.query.id;
            if (!id) {
                const error = new Error('ID not specified');
                error.status = 400;
                next(error);
            }
            let level = await sessions[id].Client.getBatteryLevel();
            res.status(200).send({
                "id": id,
                "level": level,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async enviarArquivoBase64(req, res, next) {
        try {
            let id = req.query.id;
            let numbers = new String(req.body.numbers);

            if (!numbers) {
                const error = new Error('Number not specified');
                error.status = 400;
                next(error);
            }

            numbers = numbers.replace(/\s/g, '');

            let arrNumbers = numbers.split(',');
            let type = req.body.type
            let base64 = req.body.base64;
            let name = req.body.name || 'file';
            let ext = req.body.ext;
            let message = req.body.message || '';


            for (let key in arrNumbers) {
                try {
                    if (arrNumbers[key].length == 13) {
                        let part1 = arrNumbers[key].substr(0, 4);
                        let part2 = arrNumbers[key].substr(5, 12)
                        arrNumbers[key] = `${part1}${part2}`
                    }

                    let dirF = path.resolve(__dirname, '../Uploads') + '/' + arrNumbers[key];

                    let fileName = auxFunctions.WriteFileEXT(arrNumbers[key], ext)
                    let link = `/files/${arrNumbers[key]}?file=${fileName}`;
                    let fileLinkDownload = `/files/${arrNumbers[key]}?file=${fileName}&download=true`;
                    let dirN = dirF + '/' + fileName;

                    let matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                    let s = new Buffer.from(matches[2], 'base64');

                    fs.mkdir(dirF, { recursive: true }, () => { });
                    fs.writeFile(dirN, s, 'binary', () => { });
                    let from = arrNumbers[key];
                    await messageHelper.createMedia(type[0], fileName, link, "", arrNumbers[key], fileLinkDownload, true);
                    io.emit('newFile', { "from": from });
                    if (from != "attendance@c.us") {
                        await sessions[id].Client.sendFileFromBase64(arrNumbers[key], base64, name, message);
                    }
                } catch (e) {
                    console.log(e)
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
        } catch (error) {
            next(error);
        }
    },

    async todosAsMensagensDoNumero(req, res, next) {
        try {
            let id = req.query.id;

            if (!id) {
                const error = new Error('ID not specified');
                error.status = 400;
                next(error);
            }

            let number = req.params.number + '@c.us';
            let includesMe = Boolean(req.query.includeMe === 'true');

            let messages = await sessions[id].Client.getAllMessagesInChat(number, includesMe);

            res.status(200).send({
                "id": id,
                "messagesList": messages,
                "message": "success"
            });
        } catch (error) {
            next(error);
        }
    },

    async closeSession(req, res, next) {
        try {
            let id = req.query.id;
            if (!started.includes(id)) {
                res.status(404).send({
                    "message": "Unable to close an uninitialized session."
                });
            }
            else {
                try {
                    try {
                        fs.unlink(path.resolve('./', 'tokens', 'MyZAP' + id + '.data.json'), () => { });
                        fs.unlink(path.resolve('./', 'tokens', 'MyZAP ' + id + '.data.json'), () => { });
                    } catch (e) {
                        console.clear()
                        console.log(e)
                    }

                    io.emit('sessionChanged', {});
                    started.splice(id, 1);
                    await sessions[id].Client.close();
                }
                catch (e) {
                    console.log(e);
                    res.status(200).send({
                        "id": id,
                        "message": "success"
                    });
                }

                res.status(200).send({
                    "id": id,
                    "message": "success"
                });
            }
        } catch (error) {
            next(error);
        }
    },

    async qrCode(req, res, next) {
        try {
            let id = req.query.id;

            if (!id) {
                const error = new Error('ID not specified');
                error.status = 400;
                next(error);
            }

            const tempDir = path.resolve('./', 'Controllers', 'Classes', 'Temp')
            const QrCode = path.resolve(tempDir, 'qrcode' + id + '.png');
            const QrOut = path.resolve(tempDir, 'out.png');

            fs.readFile(QrCode, (err, data) => {
                if (err) {
                    fs.readFile(QrOut, (err, data) => {
                        if (err) {
                            res.status(500).json("Unavaliable");
                        }
                        else {
                            res.setHeader('Refresh', 60);
                            res.writeHead(200, { 'Content-Type': 'image/png' });
                            res.end(data);
                        }
                    });
                } else {
                    res.setHeader('Refresh', 5);
                    res.writeHead(200, { 'Content-Type': 'image/png' });
                    res.end(data);
                }
            });
        } catch (error) {
            next(error);
        }
    },
}
