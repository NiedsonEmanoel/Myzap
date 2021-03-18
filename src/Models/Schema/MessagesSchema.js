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

    fileName: String,

}, {timestamps: true});

module.exports = MessagesSchema;