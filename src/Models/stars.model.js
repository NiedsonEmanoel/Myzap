const mongoose = require('mongoose');
const StarsSchema =require('./Schema/StarsSchema')

const StarsModel = mongoose.model('avaliations', StarsSchema);

module.exports = StarsModel;