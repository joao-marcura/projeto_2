const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

//configuracao para o IBM Watson assistant
const assistant = new AssistantV1({
	url: 'https://gateway.watsonplatform.net/assistant/api',
	version: '2020-01-04',
	authenticator: new IamAuthenticator({ apikey: 's186MeFDdmgCLgpSxDlWj76MASkbhjj0JaigG594kyWm'})	
});

module.exports = {assistant};