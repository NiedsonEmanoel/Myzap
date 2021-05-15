const nodemailer = require('nodemailer');

module.exports = class {
    #Transporter
    constructor(user, pass, service) {
        this.#Transporter = nodemailer.createTransport({
            service: service,
            auth: {
                user: user,
                pass: pass,
                // Para gerar uma senha no Gmail: 
                // 1 - Entre na configuração de segurança da conta da Google (https://myaccount.google.com/security)
                // 2 - Abra opção "App Passwords"
                // 3 - Escolha o App "Mail"
                // 4 - Escolha o Dispositivo "Other" e dê um nome desejado ("nodemailer", por exemplo)
                // 5 - Copie a senha gerada e cole aqui no código
            }
        });
    }

    sendEmail(options, callback) {
        this.#Transporter.sendMail(options, callback);
    }
}