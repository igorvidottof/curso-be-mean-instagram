/*eslint-disable no-alert, no-console */

'use strict';

const http = require('http')
		, querystring = require('querystring')
		, postData = querystring.stringify({
				name: 'Igor Vidotto'
			, type: 'aluno'
			})
		, options = {
				host: 'webschool-io.herokuapp.com'
			, method: 'POST'
			, path: '/api/pokemons'
			, headers: {
					'Content-Type': 'application/x-www-form-urlencoded' // indica a forma que a string é enviada, neste caso querystring
				, 'Content-Length': postData.length // devemos indicar o tamanho da informação, cada caracter representa 1 byte
				}
			}
		;

function callback(res){
	console.log('STATUS: ' + res.statusCode);
	console.log('HEADERS: ' + JSON.stringify(res.headers));

	let data = '';

	res.setEncoding('utf8');

	res.on('data', (dados) => {
		data += dados;
	});

	res.on('end', () => {
		console.log('Dados finalizados: ' + data);
	});
}	

const req = http.request(options, callback);

req.on('error', (e) => {
	console.log('Erro ' + e.message);
});

req.write(postData); // Create
req.end();
