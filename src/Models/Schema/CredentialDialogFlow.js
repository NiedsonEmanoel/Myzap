let mongoose = require('mongoose');

const CredentialDialogFlow = new mongoose.Schema({
    alias: {
        type: String,
        required: true
    },

    credential: {
        "type": {
            type: String,
            required: true,
        },

        "project_id": {
            type: String,
            required: true,
        },

        "private_key": {
            type: String,
            required: true,
        },

        "client_email": {
            type: String,
            required: true,
        },

        "client_id": {
            type: String,
            required: true,
        },

        "auth_uri": {
            type: String,
            required: true,
        },

        "token_uri": {
            type: String,
            required: true,
        },

        "auth_provider_x509_cert_url": {
            type: String,
            required: true,
        },

        "client_x509_cert_url": {
            type: String,
            required: true,
        },
    }

}, {
    timestamps: true
});

module.exports = CredentialDialogFlow;