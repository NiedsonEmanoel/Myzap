let mongoose = require('mongoose');
mongoose.set('useFindAndModify', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

const MessagesSchema = new mongoose.Schema ({
    type: {
        type: String
    },
    
    message: {
        type: String
    },

    body: {
        type: String
    },

    author: {
        type: String
    },

    isServer: {
        type: Boolean,
        default: false
    },

    chatId: {
        type: String,
        required: true
    },

    fileLink: {
        type: String,
        ref: 'files'
    },

    fileLinkDownload: {
        type: String,
        ref: 'files'
    },

    amount: {
        type: String,
        required: false
    },

    currency: {
        type: String,
        required: false
    },

    fileName: String,

}, {timestamps: true});

module.exports = MessagesSchema;