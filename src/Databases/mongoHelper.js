let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

module.exports = async function () {
    await mongoose.connect(process.env.MONGO, {
    }, (err) => {
        if (err) {
            console.log(' - Erro no MongoDB');
            process.exit(1);
        } else {
            console.info('- MongoDB connected.')
        }
    });
}