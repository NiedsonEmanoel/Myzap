const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
}, (err) => {
    if(err) {
        console.err(err);
    }else{
        console.info('MongoDB connected.')
    }
});

mongoose.Promise = global.Promise;

module.exports = mongoose;