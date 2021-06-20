const express = require('express');

const api = express.Router();

api.use('/v2', require('./V2'));
api.use('/v1', require('./V1'))

module.exports = api;

