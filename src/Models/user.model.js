const mongoose = require('mongoose');
const UserSchema = require('./Schema/UserSchema');

const User = mongoose.model('users', UserSchema);

module.exports = User;