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
        for (let index = 0; index < limit; index++) {
            sessions[index] = new Venom(index, {
                "type": "service_account",
                "project_id": "secret-chat-71aeb",
                "private_key_id": "b67bded944f5943a4d6266c12f792827af6e88a7",
                "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnvStlU+VZhKfY\n1Fp7eSQVCgkjR1hEXmPs5HUJvckdfk3DIgbHuBb8uV5Jbi2ftcqKmwdyaLOZP5qx\nO2TQHEkdWsPrUlfoPpB/4Tnj5/hz4Umf3tkb3vU5rfgRymV8+4R8x7wHTAkzZJMk\nC2lI9QHZs9A0IxxrRiBAn4jYHmP6N0eYZ3XxhIfN6ZSctPte8HhbGJGJ7RriVGIL\nzahCYZMqrmv8vzKG+H3qGa6gV7/I5GK9TRRy5HbGsXnv0yjKFgXafuxKjjslw/Sv\nyOtQ2qBym3Dw0nIbC63lb6HsDGArnrDjMtCcsAgJROe+HRMFV8VTuWLbwPwtt49F\nc3xyRGALAgMBAAECggEAChzGc/pl1krAD7tlpRH9keMj/+N6N8z0+0AeqjKt4EBQ\nEdaIUBwSDrRiMc0ZpQpBpq+H+GbFhRSnj83D2yQJaGKjcxlowVCcR4ldgxbmDJ5l\nYOT/c8WyRQLu9KueCLXlG9yywkHcQCPtFvw1Ibfbn7NOdwYy3WjB4wN7LYRPhLMd\naFLHCaJ3iffZWouV41RFxUfdpe0yfmzNfMdKX9VKGHBJtme2+ZmH76eql1VUlmWM\nasEGkrXrLbP/lLjwkCcEA3wOmfxbNgocgay60qfxEfa2JRzThEJBdRylgZx8PSR8\nyOL86HYesCvJqPaM1Kvzr5bDZOa413AjlJDi84uPMQKBgQDfb7lQg93hnEXLJ3YQ\nZyPBYaS5hoThKasazJ9OyCIJDn3YSV/CVGy3k8U073wgm32bKNstnk+m0gyxxNab\n3nc+a8SKDCuOgCJHjV5K20n0gfGq6iQgSQKhA4lk/ir4O0AYNGtWeclHGmSc1nGL\nzLUfJG5ExAd9DW/3TgheP61SqQKBgQDAL2glRaP7PWg4fSeQZFGZpt0z+BQH+/Z0\nC+D51X/iYHUecaTv80ZH+jgUaxSEC+Tx73OQq/0Slo0+ThIsTpZo7k1lKBlhRCkw\nfDSOfINoG3DxQUGeqQkiLP0R9EutbAOAS8oEcRsIUSMrsMawrMKBJwkYBhfaWGRs\n9mqQ61lBkwKBgQDGb5cJZtO79uoVTuqQDsm2iV2eV1XUEwmfN3OUqDFyEai6Wg/t\nqsUTFO3j4X1ACFg5YMOndB4RbiNQDhz7OUx154gZgk18tVe8bFT97lt0B6P1wxRq\nh+0JyvZO91x6MUTvOj7KAkc8GriYges92YRSMCyubdqouTJjVK4h5jOsYQKBgQC9\nfMB5p11UNSqSL8wXkOHn1l9Zgyr06FgJ+UBb9EaABEzVtIVEVJ+iDjLG5wE2ZKfa\nZxaRuRHwBuLCYKWIa//e+77xkwTbIyJdfMkxB9Fkj1HffVDex5mKycLHtg/7sHkP\nQSqxEHfvzlgYFtcAkYXBY6SSvEc+cFKsIJXXx0Sc4wKBgCMSsYda9/RSFTJiHiZS\nfJ837QcfHnQZKvG2QdO4I2Q2mTRVGmOnz43WKxM0bB66e2ezwlNy8wH0Xa4z6I4q\nIFItfRJQFpdXy5ViTDgHeds3gtL8PfATzCFOaplw8Q+5I8TgfXaUu+CxkbHfWD5I\noYFtCVBp/dkJ7egdD4EF7Rtm\n-----END PRIVATE KEY-----\n",
                "client_email": "secret-chat-71aeb@appspot.gserviceaccount.com",
                "client_id": "105792998107016357009",
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/secret-chat-71aeb%40appspot.gserviceaccount.com"
            }, process.env.LANGUAGE_CODE, 'Principal');
        }
    },

    getSessions() {
        return started;
    },

    getLimit() {
        return limit;
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
                    let mess = arrMessages[key].replace(`*${worker}:*`, '')
                    await messageHelper.createText('chat', worker, mess, arrNumbers[key] + '@c.us', true);
                    io.emit('newMessage', { "from": from });
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

                    let dirF = path.resolve('./', 'Uploads') + '/' + arrNumbers[key];
                    let fileName = auxFunctions.WriteFileEXT(arrNumbers[key], ext)
                    let link = `http://${process.env.HOST}:${process.env.PORT}/files/${arrNumbers[key]}?file=${fileName}`;
                    let fileLinkDownload = `http://${process.env.HOST}:${process.env.PORT}/files/${arrNumbers[key]}?file=${fileName}&download=true`;
                    let dirN = dirF + '/' + fileName;

                    let matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                    let s = new Buffer.from(matches[2], 'base64');

                    fs.mkdir(dirF, { recursive: true }, () => { });
                    fs.writeFile(dirN, s, 'binary', () => { });
                    let from = arrNumbers[key];
                    await messageHelper.createMedia(type[0], fileName, link, "", arrNumbers[key], fileLinkDownload, true);
                    io.emit('newFile', { "from": from });
                    await sessions[id].Client.sendFileFromBase64(arrNumbers[key], base64, name, message);
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
            if (id == 0) {
                res.status(400).send({
                    "message": "It isn't possible to close the main section."
                });
            } else if (!started.includes(id)) {
                res.status(404).send({
                    "message": "Unable to close an uninitialized session."
                });
            }
            else {
                try {
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
