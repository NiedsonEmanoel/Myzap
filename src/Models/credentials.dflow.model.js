const mongoose = require('mongoose');

const CredentialDialogFlowSchema = require('./Schema/CredentialDialogFlow');
const CredentialDialogFlow = mongoose.model('credentialsdflow', CredentialDialogFlowSchema);

module.exports = CredentialDialogFlow;