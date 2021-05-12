const mongoose = require('mongoose');

const StarsSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Avaliation: {
        type: Number,
        required: true
    }, 
}, {timestamps: true});

module.exports = StarsSchema;