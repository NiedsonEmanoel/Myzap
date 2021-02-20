"use strict";
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const util = require('util');
const functions = require('./util');
const fs = require('fs');

module.exports = class {
    #sessionClient;
    #projectID;
    #languageCode;
    #sessionID;

    constructor(ProjectID, JSON_LOCATION, languageCode) {
        this.#sessionClient = new dialogflow.SessionsClient({ keyFilename: JSON_LOCATION });
        this.#projectID = ProjectID;
        this.#languageCode = languageCode;
        this.#sessionID = uuid.v4();
    }

    get sessionClient() {
        return this.sessionClient;
    }

    get projectID() {
        return this.#projectID;
    }

    get languageCode() {
        return this.#languageCode;
    }

    get sessionID() {
        return this.#sessionID;
    }

    async detectIntentwAudio(query, contexts) {
        const sessionPath = this.#sessionClient.projectAgentSessionPath(
            this.#projectID,
            this.#sessionID
        );

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: query,
                    languageCode: this.#languageCode,
                },
            },
            outputAudioConfig: {
                audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
            },
        };

        if (contexts && contexts.length > 0) {
            request.queryParams = {
                contexts: contexts,
            };
        }

        const responses = await this.#sessionClient.detectIntent(request);
        return responses[0];
    }

    async detectIntent(query, contexts) {
        const sessionPath = this.#sessionClient.projectAgentSessionPath(
            this.#projectID,
            this.#sessionID
        );

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: query,
                    languageCode: this.#languageCode,
                },
            },
        };

        if (contexts && contexts.length > 0) {
            request.queryParams = {
                contexts: contexts,
            };
        }

        const responses = await this.#sessionClient.detectIntent(request);
        return responses[0];
    }

    async sendText(query) {
        let context;
        let intentResponse;
        try {
            intentResponse = await this.detectIntent(
                query,
                context,
            );
            return intentResponse.queryResult;
        } catch (error) {
            console.log(error);
        }
    }

    async sendTextResponseAudio(query) {
        let context;
        let intentResponse;
        try {
            intentResponse = await this.detectIntentwAudio(
                query,
                context,
            );
            return intentResponse;
        } catch (error) {
            console.log(error);
        }
    }

    async sendAudio(dir, deleteAtEnd) {
        const readFile = util.promisify(fs.readFile);
        const sessionPath = this.#sessionClient.projectAgentSessionPath(this.#projectID, this.#sessionID);
        const inputAudio = await readFile(dir, 'base64');

        const request = {
            session: sessionPath,
            queryInput: {
                audioConfig: {
                    sampleRateHertz: '16000',
                    audioEncoding: 'AUDIO_ENCODING_OGG_OPUS',
                    languageCode: 'pt-BR',
                },
            },
            inputAudio: inputAudio,
            outputAudioConfig: {
                audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
            },
        };

        let responses = await this.#sessionClient.detectIntent(request);
        if (deleteAtEnd == true) { fs.unlink(dir, () => { }); }

        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);

        if (result.fulfillmentText) {
            console.log(`  Intent: ${result.intent.displayName}`);
            return responses[0];
        }
        else {
            console.log(result);
            return functions.fallbackResponses();
        }
    }
}