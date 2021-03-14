const mongoose = require('mongoose');

const WorkerSchema = require('./Schema/WorkerSchema');
const Worker = mongoose.model('users', WorkerSchema);

module.exports = Worker;