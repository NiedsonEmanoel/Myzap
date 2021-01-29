const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

module.exports = {
  async sendDialogFlow(messagem) {
    try {
      var projectId = 'secret-chat-71aeb';
      const sessionId = uuid.v4();
      const sessionClient = new dialogflow.SessionsClient();
      const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: messagem,
            languageCode: 'pt-BR',
          },
        },
      };
      var intentName;
      const responses = await sessionClient.detectIntent(request);
      const result = responses[0].queryResult;
      if (result.intent) {
        intentName = result.intent.displayName;
      } else {
        intentName = "fallback";
      }
      var ret = {
        "Query": result.queryText,
        "Response": result.fulfillmentText,
        "Parameters": result.parameters,
        "IntentName": intentName
      }

      return ret;
    } catch (erro) {
      console.log("Invalid Format");
    }
  }
}
