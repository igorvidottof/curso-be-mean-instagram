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

#### Exercício [(resolvido)](https://github.com/igorvidottof/curso-be-mean-instagram/blob/master/01-modulo-mongodb/exercicios/aula-01/class-01-resolved-igorvidottof-igor-vidotto-felipe.md)

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
var something = {}  db.collectionName.insert(something) | cria uma variável e depois só passa ela como parâemetro para o insert
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

## [Aula 03](https://www.youtube.com/watch?v=cIHjA1hyPPY)
### Conceitos passados
#### CRUD (Retrieve)

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

