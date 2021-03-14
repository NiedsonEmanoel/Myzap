const mongoose = require('mongoose');

const ClientSchema = require('./Schema/ClientSchema');
const Client = mongoose.model('clients', ClientSchema);

module.exports = Client;