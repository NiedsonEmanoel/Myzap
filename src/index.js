const Venom = require('./Controllers/Venom');
const WhatsApp = new Venom();

WhatsApp.initVenom().then(()=>{
    console.log('Conectado')
}).catch((error)=>{
    console.error(error);
});