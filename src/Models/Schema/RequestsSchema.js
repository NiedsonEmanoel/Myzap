const mongoose = require('mongoose');

const RequestsSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    ImgSource: {
        type: String
    },
    User: {
        type: Object
    },
    Observations: {
        type: String
    },
    Status: {
        type: Number,
        default: 0
    },
    Value: {
        type: String
    },
    Fineshed: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})