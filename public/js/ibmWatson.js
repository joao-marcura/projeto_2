// Variavel para controlar o contexto do Dialogo
var contextDialog = '{}';

function sendMessageToAssistant(){
	//recupera mensagem digitada pelo usuario
	var textMessage = document.chatForm.textMessage.value;
	chat = document.getElementById('chat');
	
	//na primeira chamada (boas vindas) textMessage é undefined
	//entao define como vazio para dar erro na api
	if(textMessage === undefined || textMessage === '')
		textMessage = '';
	else //exibe a mensagem na tela
		chat.innerHTML += 'Você -->' + textMessage + '<br>';
		
	//limpa o campo input
	document.chatForm.textMessage.value = '';
	
	//post para serviço watsonAssistant
	$.post("/ibmWatson/assistant",
			{ text: textMessage, contextDialog },
			//tratamento de sucesso de processamento da API
			function(returnedData, statusRequest){
				//se ocorreu algum erro no processamento da API
				if (returnedData.status === 'ERRO')
					alert(returnedData.data);
				else{
					//exibe retorno da API e recupera o contexto para o proximo dialogo
					chat.innerHTML += 'Chatbot -->' + returnedData.data.result.output.text + '<br>';
					contextDialog = JSON.stringify(returnedData.data.result.context);
				}
			}
	)
	//tratamento de erro do post
	.fail(function(returnedData){
		alert('Erro' + returnedData.status + ' ' + returnedData.statusText);
	});
}			

//envia mensagem quando o usuario aperta enter
$(document).keypress(
	function(event){
		if(event.which == '13'){
			event.preventDefault();
			sendMessageToAssistant();
		}
	}
);

//apos carregar todos os recursos da pagina, faz post para o servico
//para exibir mensagem de boas vindas do chat
$(document).ready(function(){
	sendMessageToAssistant();
});