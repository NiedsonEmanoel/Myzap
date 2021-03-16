const mongoose = require('mongoose');

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

    chatId: {
        type: String,
        required: true
    },

    fileLink: {
        type: String,
        ref: 'files'
    },

    fileName: String,

    fileType: String

}, {timestamps: true});

module.exports = MessagesSchema;