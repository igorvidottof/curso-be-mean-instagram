/*eslint-disable no-alert, no-console */

'use strict';

const http = require('http');

const options = { 
	host: 'api.redtube.com'
,	path: '/?data=redtube.Videos.searchVideos&search=Sasha%20Gray'
};

function callback(res){
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));

	let data = '';

	res.setEncoding('utf8'); 

	res.on('data', (dados) => {
		data += dados;
	});

	res.on('end', () => {
		console.log('Dados recuperados: ' + data);
	});
}

const req = http.request(options, callback);

req.on('error', (e) => {
	console.log('Deu pra acessar não safado\n ERRO: ' + e.message);
});

req.end();