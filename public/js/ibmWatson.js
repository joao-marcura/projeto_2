// Variavel para controlar o contexto do Dialogo
var contextDialog = '{}';

function sendMessageToAssistant(textMessage){
	//se nao recebeu a mensagem por parametro
	//recupera mensagem digitada pelo usuario
	if(textMessage === undefined || textMessage === '')
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
					
					//se o navegador nao for o chrome ou tiver habilitado o som da pagina
					//chama o servico Text to Speech, passando o retorno do assistant
					if(navigator.userAgent.indexOf("Chrome") === -1 || $('#muteButton').attr('class').match('off'))
						sendTextToSpeech(JSON.stringify(returnedData.data.result.output.text));
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
	//se o navegador for o chrome pede ao usuario a permissao
	if(navigator.userAgent.indexOf("Chrome") != -1){
		document.getElementById('muteButton').setAttribute('style', 'font-size:40px;');
		alert('Ative o som se quiser iniciar o dialogo de voz!');
	}
	
	sendMessageToAssistant();
});

//permite a execucao do som no chrome
function allowAutoPlay(){
	$('#muteButton').attr('class', 'fas fa-volume-off');
}

//envia o texto para o TextToSpeech
function sendTextToSpeech(textMessage){
	//cria um elemento html de audio para tocar o audio retornado pela APi
	var audioElement = document.createElement('audio');
	//especifica o atributo type do audio
	audioElement.setAttribute('type', 'audio/ogg;codecs=opus');
	//define como source do audio o retorno do servico textToSpeech
	audioElement.setAttribute('src', '/ibmWatson/textToSpeech?text=' + textMessage);
	//toca o audio retornado
	audioElement.play();
}

//envia audio do usuario e converte para texto
function sendAudioToSpeechToText(blob) {
	//criar um formulario para enviar o arquivo de audio
	var form = new FormData();
	form.append('audioFile', blob);
	//post para o servico watsonSpeechToText
	$.ajax({
		url: 'ibmWatson/speechToText',
		type: 'post',
		data: form,
		processData: false,
		contentType: false,
		//tratamento de erro de post
		error: function (returnedData) {
			alert ('Erro: ' + returnedData.status + ' ' + returnedData.statusText);
		},
		//tratamento de sucesso de processamento do post
		success: function (returnedData){
			//se ocorreu algum erro de processamento da Api
			if(returnedData.status === 'ERRO')
				alert('Erro: ' + returnedData.data);
			//caso os dados tenham retornado com sucesso
			else{
				//recupera a conversao do audio do texto
				if(returnedData.data.result.results[0] != undefined) {
					var retorno = JSON.stringify(returnedData.data.result.results[0].
					alternatives[0].transcript).replace(/"/g,'');
					//envia o texto do audio para obter o retorno do chat
					sendMessageToAssistant(retorno);
				}
			}
		}
	});
}
