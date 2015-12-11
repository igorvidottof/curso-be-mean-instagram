/*eslint-disable no-alert, no-console */

'use strict';

var date = (new Date()).toJSON();

const http = require('http')
	, SUCESS = 
		{ version: '1.0'
		, name: 'Be MEAN'
		, returned_at: date
		}
	, ERROR = 
		{ message: 'Página não encontrada' }
	;

http.createServer(function(req, res) {
	if(req.url === '/api/v1') {
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
		res.write(JSON.stringify(SUCESS));
	}
	else {
		res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
		res.write(JSON.stringify(ERROR)); //res.write só aceita string e buffer
	}
	res.end();
}).listen(3000, function(){
	console.log('Servidor rodando em localhost:3000');
});