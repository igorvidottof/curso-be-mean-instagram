# Anotações Módulo Node.js

## [Aula 01](https://www.youtube.com/watch?v=OgfO37F6mdg)

### Teoria (Resumo)

#### V8
O *V8* é um interpretador de JavaScript. Sua função é, basicamente, compilar o código de JavaScript para o código nativo de máquina para depois executá-lo. Ele levou a velocidade dos códigos compilados para o JavaScript.

#### Node.js
O Node.js é um interpretador de *JavaScript* que funciona do lado do servidor. Ele foi criado em cima do **V8**, que é o motor de JavaScript da Google e que roda no Chrome, além disso ele conta com outras bibliotecas que o auxiliam no gerenciamento dos processos, como por exemplo a *Libuv*.

#### Característica do Node.js

#### Single Thread
O Node.js trabalha apenas com uma thread, o que economiza muita memória e processamento. Ele gerencia todos os processos por meio de uma fila chamada *Event Loop*.

#### Event Loop
O Event Loop é uma fila **infinita** que recebe todos os eventos emitidos pelo Node.js e os encaminha para onde serão executados. 

Como o processo é **assíncrono** ele irá executar e só após sua finalização que ele dispara o *trigger* para seu *callback*, esse então volta para a fila que irá ser executada pelo Event Loop.

Com isso o processo não fica parado aguardando sua finalização no Event Loop.

#### Libuv
É uma biblioteca multi-plataforma que foi criada para fazer o trabalho da *libev* e *libeio* agregando também a parte de DNS do C-Ares.

A libev gerenciava o Event Loop e a libeio gerenciava o I/O assíncrono.

#### I/O Async
Qualquer leitura ou escrita de dados não espera seu processo finalizar para continuar o *script*, nesse caso os processos ocorrem **paralelamente** à execução.

Todas funções do Node.js, por padrão, são **assíncronas**, por isso sempre precisamos de uma função que executará após o final desse processamento, cuja é chamada de **callback**.

#### Thread Pool
O Node.js cria uma *Thread Pool* de tamanho fixo, que possui duas dimensões. A primeira dimensão possui o número de *threads* e a segunda dimensão o número de *tasks* completadas.

#### Event Driven (Orientação à eventos)
O Node.js é orientado à eventos, o que simplifica a programação assíncrona. O responsável pela captura de eventos é o *listener*.

#### API
* Tem como base o Unix
* Extensivamante Modularizada (possui diversos módulos)
* Extensivamente Assíncrona

## [Aula 02](https://www.youtube.com/watch?v=mDtNcosGgiU)

### HTTP
O módulo http é o principal módulo de nossas aplicações pois é com ele que criamos um servidor web para fornecer nossos sistemas.

Ele trabalha com diversas funcionalidades do protocolo HTTP.

Esse módulo é nativo, com isso não necessita de instalação.

Para utilizarmos ele temos que importá-lo para nosso código:

```js
require('http');
```

Cada requisição que fazemos possui *cabeçalhos* com informações que dizem o que essa requisição faz.

O protocolo HTTP possui um conjunto de *métodos/verbos* que o cliente pode invocar, tais como GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS, CONNECT e PATCH.

#### Status Codes
São os códigos de retorno do HTTP. Eles são divididos 5 grupos:

* 1XX Informacional
* 2XX Sucesso
* 3XX Redirecionamento
* 4XX Erro do Cliente
* 5XX Erro do Servidor 

### createServer
Para iniciarmos um servidor HTTP utilizaremos a função createServer que recebe uma função com 2 parâmetros, **request** e **response**.

Exemplo:

```js
var http = require('http');

http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Be MEAN');
    response.end();
}).listen(3000, function(){
    console.log('Servidor rodando em localhost:3000');
});
```

No `writeHead` passamos o **Status Code** e um objeto com o **tipo do documento**.

Outra forma de fazer seria separando as funções:

```js
var http = require('http');

var server = http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Be MEAN');
    response.end();
});

server.listen(3000, function(){
console.log('Executando Servidor HTTP');
});
```

Neste exemplo demos uma resposta de escrita com texto normal, para mostrar uma resposta com **html** devemos mudar o **Content-Type** para **text/html**.

```js
var http = require('http');

http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<h1>Be MEAN</h1>');
    response.end();
}).listen(3000, function(){
    console.log('Servidor rodando em localhost:3000');
});
```

Agora vamos criar um documento html e fazer a leitura dele, após isso enviar a resposta com o conteúdo seu conteúdo.

```js
var http = require('http')
    , fs = require('fs')
    , index = fs.readFileSync('index.html');

http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(index);
}).listen(3000, function(){
    console.log('Servidor rodando em localhost:3000');
});
```

### Rotas
Criando rotas para acesso ao sistema web. A primeira rota (`api/v1`) mostrará informações sobre nossa API.

Primeiramente criamos um JSON de resposta que o servidor entregará ao *client*.

```js
const JSON = {
      version: '1.0'
    , name: 'Be MEAN'
    , created_at: Date.now()
};
```

Depois o adicionamos ao nosso script *base-server.js* que irá servir como uma base para nosso servidor HTTP.

```js
'use strict';

const http = require('http')
    , JSON = {
          version: 1.0
        , name: 'Be MEAN'
        , created_at: Date.now()
    };

http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end();
}).listen(3000, function(){
    console.log('Servidor rodando em localhost: 3000');
});
```

Antes de continuarmos vamos instalar algumas ferramentas que ajudarão na execução de algumas tarefas, são elas o [nodemon](http://nodemon.io/) e a extensão do Chrome [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en-US)

> O nodemon fica "observando" as alterações que são feitas no código e faz o restart do server automaticamente.

Agora vamos criar o script completo para levantar o servidor e bater em nossa API.

```js
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
```

Levantando o server:

```js
nodemon server.js
```

Acessamos a porta que está rodando o servidor pelo navegador

```js
localhost:3000
```

Logo receberemos o JSON de **ERROR** que configuramos

```
{ message: 'Página não encontrada' }
```

Vamos então encaminhar a requisição para a rota de nossa API

```js
localhost:3000/api/v1
```

Agora temos o JSON de **SUCCESS**

```
{"version":"1.0","name":"Be MEAN","returned_at":"2015-12-10T15:11:25.420Z"}
```

> Podemos também testar nosso servidor e rotas pelo Postman, que proporciona uma visão bem mais completa do que o navegador.

### QueryString
São as variáveis e valores que são obtidos através de formulários ou requisições do usuário e que são enviados à **url**, como `?name=Igor`, por exemplo. No Node.js, existe um módulo nativo chamado `url`, que é responsável por fazer *parser* e formatação de urls. Abaixo segue um exemplo de como capturar *query strings* da url.

```js
'use strict';

let http = require('http')
  , url = require('url')     
  ;

http.createServer(function(request, response){
  var result = url.parse(request.url, true); 

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write('<html><body>');
  response.write('<h1>Be-MEAN</h1>');
  response.write('<h2>Query String</h2>');
  response.write('<ul>');

  for(var key in result.query) {
      response.write('<li>' + key +':' + result.query[key] + '</li>');
  }

  response.write('</ul>');
  response.write('</body></html>');

  response.end();

}).listen(3000, function(){
  console.log('Servidor rodando em localhost:3000');
});
```

> A função url.parse() retorna um objeto com vários atributos da url, como href, protocol, host, auth, hostname, port, pathname, search, path, **query** e hash.

## [Aula 03](https://www.youtube.com/watch?v=TpNofR3Axsk)

### GET
Vamos utilizar a função `get` do módulo `http` para requisitar informações de algumas APIs.

Modelo:

```js
http.get(
  { hostname: 'localhost'
  , port: 80
  , path: '/'
  , agent: false // criar um novo agente(client) apenas para este pedido
  } //JSON de configuração
  , 
    function (res) {
      // Função de resposta
    }
);
```

Criando o JSON de configuração e a função de callback:

File: [http-get-localhost-querystring.js](https://github.com/igorvidottof/curso-be-mean-instagram/blob/master/02-modulo-nodejs/arquivos/aula-03/http-get-localhost-querystring.js)

```js
'use strict';

const http = require('http');

http.get(
  { hostname: 'localhost'
  , path: '/user?name=Suissa&teacher=true&age=31'
  , port: 3000
  , agent: false
  }
  , 
    (response) => {
      let body = '';

      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      
      // cada valor recebido pelo evento data é armazenado na variável data
      response.on('data', function(data){
        body += data; 
      });
      
      // quando não há mais valores para serem recebidos, retorna a resposta
      response.on('end', function(){
        console.log('Resposta: ', body);
      });
    }
);
```

> *'data'* e *'end'* são eventos de *response*. Isso acontece porque ele é uma instância do [http.IncomingMessage](https://nodejs.org/api/http.html#http_http_incomingmessage).

> Um objeto *IncomingMessage* é criado por http.Server ou http.ClientRequest e passado como o primeiro argumento para o request e response, respectivamente. Ele pode ser usado para acessar resposta de status, os cabeçalhos e os dados em si.

O *IncomingMessage* implementa a interface de [Readable Stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) que nos dá alguns eventos importantes, como:

* **close**: evento emitido quando qualquer tipo de Stream foi fechada;
* **data**: evento que recebe os dados da Stream;
* **end**: evento emitido quando não há mais dados para ler;
* **error**: evento emitido quando acontecer algum erro.

Vamos levantar o servidor para que possamos testar a requisição com o `http.get`

File: [hello-querystring.js](https://github.com/igorvidottof/curso-be-mean-instagram/blob/master/02-modulo-nodejs/arquivos/aula-03/hello-querystring.js)

```js
nodemon hello-querystring.js
```

Por fim vamos executar o arquivo que criamos acima para requisitar os dados no servidor que acabamos de levantar.

File: [http-get-localhost-querystring.js](https://github.com/igorvidottof/curso-be-mean-instagram/blob/master/02-modulo-nodejs/arquivos/aula-03/http-get-localhost-querystring.js)

```js
node http-get-localhost-querystring.js

// Saída
STATUS: 200
HEADERS: {"content-type":"text/html","date":"Mon, 14 Dec 2015 19:41:38 GMT","connection":"close","transfer-encoding":"chunked"}
Resposta:  <html><body><h1>Be-MEAN</h1><h2>Query String</h2><ul><li>name:Suissa</li><li>teacher:true</li><li>age:31</li></ul></body></html>
```

### request
O *request* é um método do módulo `http` que faz qualquer tipo de requisição HTTP.

Para fazermos uma requisição então criamos primeiro o JSON de configuração com o `host` e o `path` da API que vamos acessar, a função de *callback* que enviará a resposta de nossa requisição, a função `http.request()`, que recebe o JSON de configuração e a função de *callback*, uma função para escutar o evento `error` e por último a função `req.end()` para finalizar a requisição.

File: [http-request.js](https://github.com/igorvidottof/curso-be-mean-instagram/blob/master/02-modulo-nodejs/arquivos/aula-03/http-request.js)

```js
'use strict';

const http = require('http');

const options = { 
  host: 'api.redtube.com'
, path: '/?data=redtube.Videos.searchVideos&search=Sasha%20Gray'
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
```

### POST
Operação *Create* do **CRUD**.  
Cria instâncias em determinada API. Como exemplo faremos uma requisição na [API](http://webschool-io.herokuapp.com/) do curso.

File: [http-request-post.js](https://github.com/igorvidottof/curso-be-mean-instagram/blob/master/02-modulo-nodejs/arquivos/aula-03/http-request-post.js)

```js
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

//Saída console
STATUS: 201 // Created
HEADERS: {"server":"Cowboy","connection":"close","x-powered-by":"Express","access-control-allow-origin":"*","content-type":"application/json; charset=utf-8","content-length":"79","etag":"W/\"4f-ERrKXAlSys/Kl30LBjvRZA\"","date":"Mon, 14 Dec 2015 23:34:42 GMT","via":"1.1 vegur"}
Dados finalizados: {"__v":0,"name":"Igor Vidotto","type":"aluno","_id":"566f5212e3ce061100657d5f"}
```

### PUT
Operação *Update* do **CRUD**.  
Atualiza instâncias em determinada API. Como exemplo faremos uma requisição na [API](http://webschool-io.herokuapp.com/) do curso.

Para fazermos a operação de *Update* usamos o mesmo modelo acima, alterando apenas o `method` para **PUT** e na path adicionamos o `id` do documento que queremos alterar.

File: [http-request-post.js](https://github.com/igorvidottof/curso-be-mean-instagram/blob/master/02-modulo-nodejs/arquivos/aula-03/http-request-put.js)

```js
'use strict';

const http = require('http')
    , querystring = require('querystring')
    , postData = querystring.stringify({
        name: 'Igor Vidotto Felipe'
      })
    , options = {
        host: 'webschool-io.herokuapp.com'
      , method: 'PUT' 
      , path: '/api/pokemons/566f5212e3ce061100657d5f'
      , headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        , 'Content-Length': postData.length
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

req.write(postData); // Update
req.end();

//Saída console
STATUS: 202 // Accepted
HEADERS: {"server":"Cowboy","connection":"close","x-powered-by":"Express","access-control-allow-origin":"*","content-type":"application/json; charset=utf-8","content-length":"108","etag":"W/\"6c-AJs7wkR3BNHbb8h4g+2cew\"","date":"Mon, 14 Dec 2015 23:52:06 GMT","via":"1.1 vegur"}
Dados finalizados: {"data":{"ok":1,"nModified":1,"n":1,"lastOp":"6228291530885431297","electionId":"565e25d106dca622271891c4"}}
```

