const mongoose = require('mongoose');

const MessagesSchema = require('./Schema/MessagesSchema');
const Messages = mongoose.model('messages', MessagesSchema);

module.exports = Messages;