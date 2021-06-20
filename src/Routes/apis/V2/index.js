const express = require('express');
const ApiV2 = express.Router();

ApiV2.use('/whatsapp', require('./Whatsapp'))

module.exports = ApiV2;