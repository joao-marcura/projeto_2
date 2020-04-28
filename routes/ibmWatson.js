var express = require('express');
var router = express.Router();
//recupera configuracoes de acesso aos servicos IBM Watson
const ibmWatson = require('../lib/ibmWatsonCredentials');

//post para o servico: IBM Watson Assistant
router.post('/assistant', function(req,res,next){
	//recupera mensagem de texto e contexto da conversa
	var {text, contextDialog} = req.body;
	context = JSON.parse(contextDialog);
	//constroi json para envio dos dados ao servico
	const params = {
		input: { text } ,
		//skill id
		workspaceId: '7d618f92-fd39-4d10-8f24-7185ca4baee3',
		context
	};
	//envia os dados ao servico e retorna mensagem
	ibmWatson.assistant.message(
	params,
	function(err, response){
		if(err)
			res.json({ status: 'ERRO', data: err.toString() });
		else
			res.json({ status: 'OK', data: response });
	}
	);
});

module.exports = router;