let mongoose = require('mongoose');
mongoose.set('useFindAndModify', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

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
    },

    attendaceBy: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = ClientSchema;