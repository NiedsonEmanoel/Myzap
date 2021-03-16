const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    profileUrl: {
        type: String,
    },

    chatId: {
        type: String,
        required: true
    },

    inAttendace: {
        type: Boolean,
        default: false
    },

    firstAttendace: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = ClientSchema;