"use strict";
const mime = require('mime-types');
const FileAPI = require('./Libs/File/FileInterface');

let File = FileAPI.File;
let FileReader = FileAPI.FileReader;

module.exports = {
    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },

     getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(new File(file));
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      },

    fallbackResponses() {
        let response = [
            'Lamento, mas não compreendi.',
            'Desculpe, mas não compreendi.',
            'Infelizmente, não captei o que deseja.',
            'Não consegui compreender, desculpe.',
            'Não entendi, me desculpe.',
            'Poderia repetir? Eu não consegui entender.',
            'Eu ainda não estou configurado para entender isso :(\nPoderia tentar com outras palavras?',
            'Me desculpe, mas não entendi',
            'Perdão, mas não consegui te entender',
            'Não consegui captar, poderia repetir?'
        ];
        let index = Math.floor(Math.random() * 10);
        return response[index];
    },

    writeName(from, mimetype){
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);

        var telefone = ((String(`${from}`).split('@')[0]).substr(2));
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let miliseconds = date_ob.getMilliseconds();

        const fileName = `${telefone}` + "-" + `${year}` + `${month}` + `${date}` + "-" + `${miliseconds}`;
        let file = `${fileName}.${mime.extension(mimetype)}`;
        console.log(file);
        return file;
    },

    writeMP3(from){
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);

        var telefone = ((String(`${from}`).split('@')[0]).substr(2));
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let miliseconds = date_ob.getMilliseconds();

        const fileName = `${telefone}` + "-" + `${year}` + `${month}` + `${date}` + "-" + `${miliseconds}`;
        let file = `${fileName}.mp3`;
        console.log(file);
        return file;
    },

    isMsgValid(body, number, pass) {
        if((body === '')||(number === '')||(pass !== process.env.PASS_API)){
            return false;
        } else {
            return true;
        }
    }
}