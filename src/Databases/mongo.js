let mongoose = require('mongoose');

module.exports = {
    async Connect() {
        await mongoose.connect(process.env.MONGO, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }, (err) => {
            if (err) {
                console.log(' - Erro no MongoDB');
                process.exit(1);
            } else {
                console.info('- MongoDB connected.');
                mongoose.Promise = global.Promise;
            }
        });
    }
};