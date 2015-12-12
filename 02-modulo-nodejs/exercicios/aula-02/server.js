/*eslint-disable no-alert, no-console */

'use strict';

var date = (new Date()).toJSON();

var http = require('http')
	,	url = require('url')
	, SUCESS = 
		{	version: '1.0'
		,	name: 'Exercício 02 Node.js'
		,	returned_at: date
		}
	;

http.createServer(function(request, response){
	var pathname = url.parse(request.url).pathname
		,	routes = 
			[	'/api/pokemons/create'
			,	'/api/pokemons/read'
			,	'/api/pokemons/update'
			,	'/api/pokemons/delete'
			]
		;
			
	for(var key in routes){
		if (routes[key] === pathname) {
			response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
			response.write(JSON.stringify(SUCESS));
		}
	}

	response.end();

}).listen(3000, function(){
	console.log('Servidor rodando em localhost:3000');
});