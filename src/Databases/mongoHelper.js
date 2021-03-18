const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = async function () {
    await mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    }, (err) => {
        if (err) {
            console.log(' - Erro no MongoDB');
            process.exit(1);
        } else {
            console.info('- MongoDB connected.')
        }
    });
}