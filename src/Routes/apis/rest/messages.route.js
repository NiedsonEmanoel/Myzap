const express = require('express');
const messageController = require('../../../Controllers/messages.controller');
const Router = express.Router();

Router.get('/', messageController.index);
Router.get('/:chatId', messageController.details);

module.exports = Router;