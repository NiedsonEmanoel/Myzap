let mongoose = require('mongoose');
let Attempts = 0;
module.exports = {
    Connect() {
        mongoose.connect(process.env.MONGO, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        }, (err) => {
            if (err) {
                console.error('- Connection error on MongoDB');
                console.info('  - Reconnecting')
                console.info('  - Attempt: '+Attempts+'\n')
                if(Attempts >= 3){
                    console.log('- Closing...')
                    process.exit(1);
                }
                Attempts++
                this.Connect();
            } else {
                console.info('- MongoDB connected.');
                mongoose.Promise = global.Promise;
            }
        });
    }
};