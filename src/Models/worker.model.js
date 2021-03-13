const mongoose = require('mongoose');
const WorkerSchema = require('./Schema/WorkerSchema');

const Worker = mongoose.model('users', UserSchema);

module.exports = Worker;