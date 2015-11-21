# Anotações Módulo MongoDB 

## [Aula 01](https://www.youtube.com/watch?v=leYxsEAL_yY)

### NoSQL

* Not-only SQL.
* Os bancos NoSQL são diferenciados por suas características específicas, visto que cada um foi criado para resolver problemas específicos.
* Principais grupos de NoSQL:
	* Chave/Valor - bancos mais rápidos, utilizados comumentemente para cache. Identifica os valores dos objetos apenas por suas chaves específicas
	* Orientado a Documento - um aprimoramento do chave/valor. É possível realizar pesquisas dos valores pelos nomes dos objetos
	* Grafos - Grafo é um ponto ligado a outro ponto (ruas, linhas de trem).
	* Colunas
	* Mistos - Bancos que englobam diferentes categorias (grupos) de NoSQL.

### MongoDB
	
#### Features
* Schemaless - Sem esquemas (estruturações exatas, tabelas, campos, etc).
* Trabalha com JSON/BSON
* Réplica - Espelhamento dos dados
* Sharding - Como o MongoDB trabalha com a memória RAM, se a coleção de dados for muito grande e superar a capacidade dela, essa técnica é utilizada. O sharding divide os dados em pacotes menores e coloca em outros servidores.
* GridFs - Servidor de arquivos binários do MongoDB
* Geolocation

#### Terminologia

SQL RDBMS  | MongoDB
---------- | ---------
Database | Database
Table | Collection
Rows | Document JSON
Query | Query
Index | Index
Partition | Shard

#### Alguns comandos:
 Comando  | Função  | Sintaxe
--------- | ------- | --------
`mongoexport` | Exporta os dados de uma coleção para um arquivo JSON | mongoexport --db nome_database --collection nome_collection --out nome_arquivo.json
`mongoimport` | Importa os dados de um arquivo JSON para uma database | mongoimport --db nome_database --collection nome_collection --drop --file nome_arquivo.json

> --db e --collection podem ser simplificados por -d e -c

#### Exercício [(resolvido)](https://github.com/igorvidottof/curso-be-mean-instagram/tree/master/01-modulo-mongodb/exercicios/aula-01)

Realizar o import do documento restaurantes.json para o banco be-mean, coleção restaurantes e contar a quantidade de documentos importados.

#### Observação

> Evite usar mongoimport e mongoexport para backups de instância de produção. Eles não preservarão de forma confiável todos os tipos de dados ricos do BSON, porque JSON só pode representar um subconjunto dos tipos suportados pelo BSON. Use mongodump e mongorestore como descrito em [MongoDB Backup Methods](https://docs.mongodb.org/manual/core/backups/) para esse tipo de funcionalidade.

## [Aula 02](https://www.youtube.com/watch?v=PaNVk0V2UNI)
### Conceitos passados
#### Comandos básicos

Comando | Descrição
------- | ---------
use dbName | muda para a db selecionada ou a cria, caso não exista
show dbs | mostra todas as dbs
show collections | mostra todas as collections da db selecionada
db.collectionName.insert({dados}) | faz o insert de dados
db.collectionName.find() | busca todos os dados da collection
db.createCollection(collectionName, .json) | cria uma collection a partir de um json
var something = {}  db.collectionName.insert(something) | cria uma variável e depois só passa ela como parâmetro para o insert


#### CRUD (Create)
Função | Descrição
------- | ---------
db.insert() | faz a inserção de dados na db
db.save() | insere caso não exista e faz o update, caso já exista 

#### Alteração de dados de um registro
Primeiro devemos criar uma pesquisa para encontrarmos o registro que desejamos alterar
```
var query = {name: "Caterpie"}
```

Em seguida guardar o resultado da busca numa variável
```
var p = db.collectionName.find(query)
```

Então podemos acessar os dados desse objeto para alteração
```
p.name
```

> porém neste caso não funcionará, pois com o `find()`, o retorno é um **cursor**, ou seja seus dados não podem ser acessados.

Então o correto a se fazer é com o `findOne()`, pois ele retorna o **objeto direto**
```
var p = db.collectionName.findOne(query)
```

Agora podemos alterar o conteúdo de p
```
p.defense = 35
```

Todavia a alteração foi aplicada somente na variável, então precisamos salvar no banco
```
db.collectionName.save(p)
```

#### Como trabalhar com cursores?
```
var cursor = db.collectionName.find();
while(cursor.hasNext()){
	print(tojson(cursor.next()))
}
```
#### Exercício [(resolvido)](https://github.com/igorvidottof/curso-be-mean-instagram/tree/master/01-modulo-mongodb/exercicios/aula-02)


## [Aula 03](https://www.youtube.com/watch?v=cIHjA1hyPPY)
### CRUD (Retrieve)

Comando |  Sintaxe  | Descrição
------- | --------- | ---------
`db.collection.find()` | `db.collection.find({clausulas}, {campos})` | Retorna um cursor
`db.collection.findOne()` | `db.collection.findOne({clausulas}, {campos})` | Retorna o objeto direto

> Se comparado com bancos relacionais, as `clausulas` possuem o mesmo efeito do `WHERE` e os `campos` do `SELECT`. Com isso podemos criar objetos `JSON` e passá-los como parâmetros nas buscas.

##### Exemplo
```
var query = {name: "Pikachu"}; // aqui descrevemos as restrições de busca
var fields = {name: 1, description: 1} // aqui os campos que serão retornados
db.pokemons.find(query, fields);
```

>```
{
  "_id": ObjectId("5648cbeeb2b455d5cd60fd7b"),
  "name": "Pikachu",
  "description": "Rato elétrico"
}
```

Logo, temos que, para os campos setados com o valor 1 (true) são exibidos e com o valor 0 (false) são omitidos.

```
var query = {name: "Pikachu"};
var fields = {height: 0}; // omitindo apenas o campo height
db.pokemons.find(query, fields);
```

>```
{
  "_id": ObjectId("5648cbeeb2b455d5cd60fd7b"),
  "name": "Pikachu",
  "description": "Rato elétrico",
  "type": "eletric",
  "attack": 55
}
```

#### Operadores Aritméticos
Operador | MongoDB
-------- | -------
< | `$lt` (less than)
<= | `$lte` (less than or equal)
> | `$gt` (greater than)
>= | `$gte` (greater than or equal)

> Esses operadores devem ser usados dentro de objetos JSON, como no exemplo abaixo.

##### Exemplo
```
var query = {attack: {$lt: 50}};
db.pokemons.find(query);
```
> Retorna todos os pokémons com ataque menor que 50

#### Operadores lógicos
Operador | MongoDB
-------- | -------
OR | $or
NOT OR | $nor
AND | $and

> Como esses operadores são utilizados para realizar comparações lógicas, os parâmetros de comparação são passados por meio de um array.

##### Exemplo
```
var par1 = {type: "elétrico"};
var par2 = {attack: {$lte: 70}};
var query = {$and: [par1, par2]};
db.pokemons.find(query);
```
> Retorna todos os pokémons que sejam do `type` elétrico **E** tenham o `attack` menor ou igual à 70.

#### Operador "Existêncial"
Esse é um operador específico do MongoDB que verifica a existência de determinado campo.
Sua denotação é `$exists`

##### Exemplo
```
db.clientes.find({telefoneResidencial: {$exists: true}});
```
> Retorna todos os clientes que possuem o campo `telefoneResidencial`.

#### Exercício [(resolvido)](https://github.com/igorvidottof/curso-be-mean-instagram/tree/master/01-modulo-mongodb/exercicios/aula-03)

## [Aula 04 (parte 1)](https://www.youtube.com/watch?v=ONzJsNbv15U)
### CRUD (Update)
Operador | Sintaxe | Descrição
-------- | ------- | ---------
`update()` | `db.collection.update(query, mod, options);` | Atualiza os dados dos documentos especificados na query

### Operadores de Modificação
Para utilização correta da função `update` é necessário fazer a utilização de operadores de modificação, tais como o `$set`, `$unset` e `$inc`

#### $set
Modifica um valor existente ou cria o campo com o valor caso esse campo não exista

Operador | Sintaxe 
-------- | ------- 
`$set` | `{$set: {campo: valor}}`


##### Exemplo:
```
var query = {name: /charizard/i};
var mod = {$set: {attack: 99}};
db.pokemons.update(query, mod);
```
> Altera o campo `attack` do Charizard para o valor 99 se ele existir. Caso contrário, esse campo é criado com esse mesmo valor.

#### $unset
Remove campos de documentos

Operador | Sintaxe 
-------- | ------- 
`$unset` | `{$unset: {campo: valor}}`


##### Exemplo:
```
var query = {name: /charizard/i};
var mod = {$unset: {attack: 1}};
db.pokemons.update(query, mod);
```
> Remove o campo `attack` do Charizard se ele existir. Caso contrário não faz nada.

#### $inc
Faz o incremento ou decremento de campos que possuem valores numéricos.

Operador | Sintaxe 
-------- | ------- 
`$inc` | `{$inc: {campo: valor}}`

##### Exemplo:
Incremento:
```
var query = {name: /charizard/i};
var mod = {$inc: {attack: 20}};
db.pokemons.update(query, mod);
```
> Aumenta 20 no `attack` do Charizard se o campo existir.

Decremento:
```
var query = {name: /charizard/i};
var mod = {$inc: {attack: -20}};
db.pokemons.update(query, mod);
```
> Para decrementar basta colocar um número negativo.

### Operadores de Array

Os documentos no MongoDB podem ter arrays de valores também, com isso existem alguns operadores para trabalhar com esses objetos, são eles `$push`, `$pushAll`, `$pull`, `$pullAll`.

#### $push
Faz a inserção de um valor num array caso ele já exista. Caso contrário, cria um campo de array com o valor especificado.

Operador | Sintaxe 
-------- | -------
`$push` | `{$push: {campo: valor}}`

##### Exemplo:
```
var query = {name: /charizard/i};
var mod = {$push: {moves: "Lança Chamas"}};
db.pokemons.update(query, mod);
```
> Insere o "Lança Chamas" no campo de array `moves` do documento com nome Charizard, caso esse campo já exista. Caso contrário, cria esse array.

#### $pushAll
Tem o mesmo efeito do `$push`, porém com a possibilidade de enviar mais de um valor, com isso é necessário passar um array como valor.

Operador | Sintaxe 
-------- | -------
`$pushAll` | `{$pushAll: {campo: [valores]}}`

##### Exemplo:

```
var query = {name: /charizard/i};
var attacks = ["Explosão de Chamas", "Investida"];
var mod = {$pushAll: {moves: attacks}};
db.pokemons.update(query, mod);
```

> Insere os valores no campo de array `moves` do documento com nome Charizard, caso esse campo já exista. Caso contrário, cria esse array com os valores que foram passados.

#### $pull
Exclui um valor de um array caso este exista, senão não faz nada.

Operador | Sintaxe 
-------- | -------
`$pull` | `{$pull: {campo: valor}}`
```
var query = {name: /charizard/i};
var mod = {$pull: {moves: "Investida"}};
db.pokemons.update(query, mod);
```
> Exclui o valor "Investida" do campo `moves` do documento Charizard, caso ele exista.

#### $pullAll
Prmite a exclusão de vários valores de um array de uma única vez.

Operador | Sintaxe 
-------- | -------
`$pullAll` | `{$pullAll: {campo: [valores]}}`
```
var query = {name: /charizard/i};
var attacks = ["Investida", "Explosão de Chamas"];
var mod = {$pullAll: {moves: attacks}};
db.pokemons.update(query, mod);
```
> Exclui os valores "Investida" e "Explosão de Chamas" do campo `moves` do documento Charizard, caso ele exista.

## [Aula 04 (parte 2)]()
### CRUD(Update)
#### options
A função update contém alguns valores padrões para sua execução, mas que podem ser alterados, São eles:
```
{
  upsert: boolean,
  multi: boolean,
  writeConcern: document
}
```

#### upsert
O parâmetro `upsert` serve para caso o documento não seja encontrado pela query. Quando seu valor é true, ele insere o objeto que está sendo passado como modificação.

O `upsert` por padrão é **false**.

```
var query = {name: /PokemonInexistente/i}
var options = {upsert: true};
var mod = {$set: {active: false}};
db.pokemons.update(query, mod, options);
```
> Não existe nenhum documento nessa collection que satisfaça essa query, logo um novo documento é criado com o campo que foi passado como parâmetro de modificação, neste cenário um documento será criado apenas com o campo `"active:" false`.

##### $setOnInsert
Esse operador é utilizado em conjunto com o upsert. É possível passar valores que serão adicionados caso o upsert aconteça. Além da modificação normal que aconteceria, esses valores também são adicionados a um novo documento.

```
var query = {name: /PokemonInexistente/i}
var options = {upsert: true};
var mod = {
    $set: {active: true},
    $setOnInsert: {
    name: "AindaNaoExisteMon",
    type: null,
    attack: null,
    defense: null,
    height: null,
    description: "Sem maiores informações"
    }
};
db.pokemons.update(query, mod, options);
```
> Então se a query for encontrada, é executado o **update** normalmente, aplicando a modificação passada no `$set`, do contrário, um novo documento é criado pelo **upsert** com os campos e valores passados no `$setOnInsert`, além dos campos e valores especificados no `$set`.

#### multi
O MongoDB, por padrão, permite a alteração(update) de apenas **um documento por vez**, no entanto, se for realmente necessário alterar mais de um documento basta alterar o parâmetro `multi` para `true`

```
var query = {}; // seleciona todos os documentos
var options = {multi: true};
var mod = {$set: {active: true}};
db.pokemons.update(query, mod, options);
```

> Altera todos os documentos, inserindo ou apenas alterando o campo `active: true`

#### writeConcern
Definições e Informações sobre [writeConcern](https://docs.mongodb.org/manual/reference/write-concern/) podem ser encontrados na documentação do MongoDB.

### Operadores de Array (continuação)
#### $in
O operador `$in` tem a mesma operação que o `$or` tem para trabalhar com documentos. Ele recebe um array de valores e qualquer documento que possua um array com **pelo menos um** desses valores é retornado.

Operador | Sintaxe 
-------- | ------- 
$in | {campo: {$in: [valores]}};


##### Exemplo
```
var query = {moves: {$in: [/choque do trovão/i, /lança chamas/i]}};
db.pokemons.find(query);
```

> Retorna todos os pokémons que tenham em seu array de `moves` o choque do trovão **OU** o lança chamas.

#### $nin (not in)
Operador inverso ao `$in`. Retorna todos os documentos que não possuam nenhum dos valores passados no array.

Operador | Sintaxe 
-------- | ------- 
$nin | {campo: {$nin: [valores]}};

##### Exemplo
```
var query = {moves: {$in: [/choque do trovão/i, /lança chamas/i]}};
db.pokemons.find(query);
```

> Retorna todos os pokémons que **não tenham** o choque do trovão e o lança chamas em seu array de `moves`

#### $all
O operador `$all` tem a mesma operação que o `$and` tem para trabalhar com documentos. Ele recebe um array de valores e qualquer documento que possua um array com **todos** esses valores é retornado.

Operador | Sintaxe 
-------- | ------- 
$all | {campo: {$all: [valores]}};

##### Exemplo
```
var query = {moves: {$all: [/choque do trovão/i, /lança chamas/i]}};
db.pokemons.find(query);
```

> Neste exemplo nenhum documento é retornado, posto que nenhum pokémon tem em seu array de `moves` o choque do trovão **E** o lança chamas.


### Operadores de Negação
#### $ne (not equal)
Retorna todos os documentos que possuem o valor **diferente** do valor passado como parâmetro.

Operador | Sintaxe 
-------- | ------- 
$ne | {campo: {$ne: valor};

##### Exemplo
```
var query = {type: {$ne: "grama"}};
db.pokemons.find(query);
```

> Retorna todos os documentos que possuem o campo `type` **diferente** de grama.

**Obs:**
> O operador `$ne` não aceita `REGEX` como parâmetro.


#### $not
Operador de negação lógica, nega uma verdade. Simplificando, inverte o resultado de uma expressão lógica.

##### Exemplo
```
var expressao = {$lte: 80};
var query = {attack: {$not: expressao}};
db.pokemons.find(query)
```

> Retorna todos os documentos que possuam o valor **NÃO menor ou igual a 80**, logicamente, maior que 80.


### CRUD (Delete)
#### remove()
O `remove`, ao contrário do `update`, permite a remoção de vários documentos ao mesmo tempo por padrão. Tendo em vista esse empecilho é necessário muito cuidado ao passar parâmetros para remoção.

Função | Sintaxe 
-------- | ------- 
remove() | db.collection.remove({documento})

##### Exemplo
```
var everybody = {};
db.pokemons.remove(everybody);
```

> Deleta **todos** os documentos da coleção, mas não a coleção em si.

#### drop()
Para deletar a coleção então é utilizado a função `drop`

Função | Sintaxe 
-------- | ------- 
drop() | db.collection.drop()


##### Exemplo
```
db.pokemons.drop();
```

> Deleta a coleção `pokemons`



















