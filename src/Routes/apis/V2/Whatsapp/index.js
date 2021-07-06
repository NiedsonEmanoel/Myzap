const express = require('express');
const MultiSession = require('../../../../Controllers/multisession.controller')
const WhatsRoute = express.Router();

WhatsRoute.post('/send/message', MultiSession.newMessage)
WhatsRoute.post('/send/file', MultiSession.newBase64)

module.exports = WhatsRoute;