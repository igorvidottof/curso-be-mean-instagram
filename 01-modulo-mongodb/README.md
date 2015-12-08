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
* replica - Espelhamento dos dados
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

Exercício 


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

#### Exercício [(resolvido)](https://github.com/igorvidottof/curso-be-mean-instagram/tree/master/01-modulo-mongodb/exercicios/aula-04)

## [Aula 05](https://www.youtube.com/watch?v=1eHc8reT_Vk)
#### distinct()
Retorna um array com todos as ocorrências **únicas** de valores de um determinando campo, isto é, não são retornados valores repetidos.

> Tem função idêntica ao `GROUP BY` do SQL

Função | Sintaxe 
-------- | ------- 
`distinct()` | `db.collection.distinct("campo");`


##### Exemplo:
```
db.pokemons.distinct("types");
```
> Retorna todos os tipos de pokémons existentes na `db` sem repetição de tipo.

Como o `distinct` retorna um array é possível utilizar a propriedade `length` para verificar quantos valores distintos foram retornados.

##### Exemplo:
```
db.pokemons.distinct("types").length;
```

#### Paginação
##### limit().skip()
###### limit()

O `limit()` traz os **N** primeiros documentos encontrados que satisfaçam a query, onde **N** é o parâmetro passado para a função.

##### Exemplo:
```
db.pokemons.find( {} , {name: 1, _id: 0} ).limit(2);
```

> Traz apenas o nome dos dois primeiros pokémons da `db`.

###### skip()
Pula os N primeiros documentos antes de retornar o resultado da query, sendo que N é o parâmetro passado para a função.

##### Exemplo:
```
db.pokemons.find( {} , {name: 1, _id: 0} ).limit(2).skip(1);
```

> Pula o primeiro documento encontrado e retorna os 2 próximos pelo efeito do `limit(2)`.


Com esses conceitos que é definida a **Paginação**.

Paginação nada mais é do que separar o resultado da query em **páginas**, nas quais a quantidade de documentos será definida pelo `limit(N)` e a separação daś páginas pelo `skip(N * X)`, onde **X** se refere ao número da página, a começar por 0.

##### Exemplo:

Primeira Página
```
db.pokemons.find( {} , {name: 1, _id: 0} ).limit(5).skip(5 * 0);
```

Segunda Página
```
db.pokemons.find( {} , {name: 1, _id: 0} ).limit(5).skip(5 * 1);
```


#### Contagem de Documentos

##### find().length() vs count()

###### find().length()
Para fazer a contagens de documentos pode-se ser usado a função `length()`, primeiramente procurando-os com o `find()` e logo em seguida contando-os com o `length()`.

##### Exemplo:
```
db.collection.find().length();
```
A grande desvantagem desta forma de contagem é que todos os documentos são buscados primeiro, carregados na memória, e somente depois contados um a um, o que pode gerar um certo delay.


###### count()
Com o count a contagem é feita instantaneamente, resultando num tempo de resposta bem menor. O que pode se tornar mais visível em `dbs` com muitos registros.

Função | Sintaxe 
-------- | ------- 
`count()` | `db.collection.count({query});`


O `count` permite também a realização de contagens de campos e valores específicos, passando um objeto de query como parâmetro para ele, sem necessitar antes de usar o `find`

##### Exemplo:
```
db.restaurantes.count( {"borough": "Bronx"} );
```

> Retorna a quantidade de restaurantes que possuem o campo `"borough"` com o valor `"Bronx"`

#### Agrupamentos

#### group()
Faz o agrupamento de valores de documentos que possuam algum valor em comum.

Função | Sintaxe 
-------- | -------
`group()` | `db.collection.group({propriedades});`

Se fosse necessário contar a quantidade de pokémons por tipo, o `count()` poderia ser utilizado. Todavia para cada tipo distinto seria necessário realizar a operação de count mudando o parâmetro para cada tipo.

Com o `group()` isso se torna bem mais prático.

##### Exemplo:
```javascript
db.pokemons.group({
  initial: {total: 0},
  reduce: function(curr, result){
    curr.types.forEach(function(type){
      if(result[type]){ // se o tipo já existe o array
        result[type]++;
      } else{
        result[type] = 1;
      }
      result.total++;
    });
  }
});
```
> O `forEach` percorre o array `types` e os tipos são listados dentro de um array e inicializados na primeira vez que um documento possui um tipo ainda não listado. Se o tipo já existir nesse array ele é incrementado pela função `reduce`. O retorno é um array com um documento contendo todos os tipos e suas respectivas quantidades.

Obs:

> O total será maior do que a quantidade de pokémons em si, pois existem pokémons com mais de um tipo.

###### Propriedades do group()
O group tem algumas propriedades, como as que foram utilizadas acima (`initial` e `reduce`) e algumas outras, como, por exemplo o `cond`, que implica alguma condição de agrupamento.

##### Exemplo:

```javascript
db.pokemons.group({
  initial: { total: 0 },
  cond: { attack: { $gte: 80} },
  reduce: function(curr, result){
    curr.types.forEach(function(type){
      if(result[type]){ // se o tipo já existe o array
        result[type]++;
      } else{
        result[type] = 1;
      }
      result.total++;
    });
  }
});
```

> Retorna todos os tipos de pokémos e suas respectivas quantidades de pokémons que atendem a condição, neste exemplo, attack >= 80.

##### Outros exemplos de `group()`

```javascript
db.pokemons.group({
  initial: { total: 0, attack: 0, defense: 0 },
  reduce: function(current, result){
    result.total++;
    result.attack += current.attack;
    result.defense += current.defense;
  }
});
```

> O `reduce` então itera sobre os documentos, e o `result` tem o papel de acumulador, que recebe o valor atual(`current`) de cada documento.

Outra propriedade do `group()` é o `finalize`, que é executado no final de todas as operações.

##### Exemplo:
```javascript
db.pokemons.group({
  initial: { total: 0, attack: 0, defense: 0 },
  reduce: function(current, result){
    result.total++;
    result.attack += current.attack;
    result.defense += current.defense;
  },
  finalize: function(result){
    result.attackAvg = result.attack/result.total;
    result.defenseAvg = result.defense/result.total;
  }
});
```

> Aqui o `finalize` retorna as médias dos ataques e das defesas de todos os pokémons da `db`.


#### aggregate()
Também é utilizado para agrupamentos.

Função | Sintaxe 
-------- | -------
`aggregate()` | `db.collection.aggregate({$propriedades});`


##### Exemplo

```
db.pokemons.aggregate({
  $group: {
    _id: {}, // id agrupador, especifica algum campo para agrupamento
    attackAvg: {$avg: "$attack"},
    defenseAvg: {$avg: "$defense"},
    attack: {$sum: "$attack"},
    defense: {$sum: "$defense"},
    total: {$sum: 1}
  }
})
```

> Retorna um array chamado `result` com a média do attack e da defesa, soma do attack e da defesa de todos os pokémons e quantidade de pokémons.

Obs:

> Todas as propriedades do `aggregate` começam com o operador `$`, como o `$group` e `$avg`. No exemplo acima `$attack` e `$defense` também recebem o `$`, isso porque esse operador indica ao mongo que o este valor é um campo.


Para colocar uma condição no aggregate é necessário colocar todas as propriedades dentro de um array e utilizar a propriedade `match` pois ele é um operador de estágio.

Função | Sintaxe 
-------- | -------
`aggregate()` | `db.collection.aggregate([{$match}, {$propriedades}]);`


```js
db.pokemons.aggregate([
  {$match: {types: "fire"}},
  {  
    $group: {
      _id: {},
      attackAvg: {$avg: "$attack"},
      defenseAvg: {$avg: "$defense"},
      attack: {$sum: "$attack"},
      defense: {$sum: "$defense"},
      total: {$sum: 1}
  }
}]);
```


#### Exercício [(resolvido)](https://github.com/igorvidottof/curso-be-mean-instagram/tree/master/01-modulo-mongodb/exercicios/aula-05)


## [Aula 06 - Parte 1](https://www.youtube.com/watch?v=5bbWeEEzRQM)
### Relacionamentos
#### Forma Manual
Para fazer relacionamentos no `MongoDB` deve-se simplesmente inserir o `_id` de um objeto de uma coleção noutra. No exemplo, alguns ids da coleção de `pokemons` serão inseridos na coleção `inventario`.

```js
var pokemons = [
  {"_id": ObjectId("564dc38c3e726cf185f8809d")},
  {"_id": ObjectId("5648ce1eb2b455d5cd60fd7d")},
  {"_id": ObjectId("5648ce1eb2b455d5cd60fd7c")}
];
```

> Guardando os ids da collection `pokemons` numa variável para inserção na collection `inventario`.

```js
var json = {
  name: "Meus Pokémons",
  pokemons: pokemons
}

db.inventario.insert(json);
```

> Inserção do documento json na collection `inventario`

```js
db.inventario.findOne();
```

```
{
  "_id": ObjectId("5655cefa2c2514172759ed2e"),
  "name": "Meus Pokémons",
  "pokemons": [
    {
      "_id": ObjectId("564dc38c3e726cf185f8809d")
    },
    {
      "_id": ObjectId("5648ce1eb2b455d5cd60fd7d")
    },
    {
      "_id": ObjectId("5648ce1eb2b455d5cd60fd7c")
    }
  ]
}
```

Ok, o documento foi inserido. Todavia, essa collection `inventarios` possui apenas os ids dos pokémons, com isso não sabemos quais os pokémons que estão nesse documento. Logo, para ver seus dados é necessário buscá-los por seus `_id` na collection de origem (`pokemons`) e armazená-los num array para visualização (equivalente ao SELECT).

```js
var pokemons = [];
var getPokemon = function(id){
  pokemons.push( db.pokemons.findOne(id) );
}
var invt = db.inventario.findOne();
invt.pokemons.forEach(getPokemon);
```

> O objeto `invt` acessa o campo `pokemons` e o `forEach` percorre o array de ids do `inventario`. A cada looping a função `getPokemon` recebe esse id, procura ele no array de origem (`pokemons`) e quando encontra dá um push no array `pokemons` criado anteriormente.

#### DBRef

Outra forma de relacionar documentos é o **DBRef**. 

DBRef é uma convenção para referenciar um documento relacionado, isso inclui:

```
{
  $ref: nome da coleção a ser referenciada,
  $id: o ObjectId do documento referenciado,
  $db: a database onde a coleção referenciada se encontra
}
```

Exemplo:

```js
{
  "pokemon" : {
    "$ref" : "pokemons",
    "$id" : ObjectId("564220f0613f89ac53a7b5d0"),
    "$db" : "be-mean-instagram"
   }
}
```


## [Aula 06 - Parte 2](https://www.youtube.com/watch?v=IXz4IL0da1k)
### Explain

O `explain` mostra como o MongoDB executa as `queries` internamente, exibindo as informações e os parâmetros utilizados para realização dessa `query`.

```js
db.restaurantes.find( {name: "Morris Park Bake Shop" }).explain();
```

##### Saída

```js
{
  "queryPlanner": {
    "plannerVersion": 1,
    "namespace": "be-mean.restaurantes",
    "indexFilterSet": false,
    "parsedQuery": {
      "name": {
        "$eq": "Morris Park Bake Shop"
      }
    },
    "winningPlan": {
      "stage": "COLLSCAN",
      "filter": {
        "name": {
          "$eq": "Morris Park Bake Shop"
        }
      },
      "direction": "forward"
    },
    "rejectedPlans": [ ]
  },
  "serverInfo": {
    "host": "igorpc",
    "port": 27017,
    "version": "3.0.7",
    "gitVersion": "6ce7cbe8c6b899552dadd907604559806aa2e9bd"
  },
  "ok": 1
}
```

É possível ainda, passar parâmetros adicionais para o `explain` para que ele traga mais algumas informações. Um parâmetro que podemos passar é o `executionStats`.

```js
db.restaurantes.find( {name: "Morris Park Bake Shop" } ).explain("executionStats");
```

Então obtemos, além das informações padrões trazidas pelo `explain`, o campo `executionStats`:

```js
"executionStats": {
    "executionSuccess": true,
    "nReturned": 1,
    "executionTimeMillis": 30,
    "totalKeysExamined": 0,
    "totalDocsExamined": 25359,
    "executionStages": {
      "stage": "COLLSCAN",
      "filter": {
        "name": {
          "$eq": "Morris Park Bake Shop"
        }
      },
      "nReturned": 1,
      "executionTimeMillisEstimate": 30,
      "works": 25361,
      "advanced": 1,
      "needTime": 25359,
      "needFetch": 0,
      "saveState": 198,
      "restoreState": 198,
      "isEOF": 1,
      "invalidates": 0,
      "direction": "forward",
      "docsExamined": 25359
    }
  },
```

#### Mas por que utilizar o `explain`?

Como ele traz várias informações sobre a `query`, podemos tirar proveito delas e verificar se há alguma possibilidade de melhora, tanto na forma de escrever a `query` quanto como na adição de **índices**.

> Neste exemplo vemos que a execução retornou o documento em `30ms` e que todos os documentos da `collection` foram examinados.

```js
"executionTimeMillis": 30,
"totalDocsExamined": 25359,
```

### Index

É uma forma de garantir que informações importantes ou que são frequentemente acessadas retornem de uma maneira mais rápida do que a convencional.

Vamos verificar se essa `collection` *restaurantes* já possui algum índice:

```js
db.restarantes.getIndexes();

```

##### Saída

```js
[
  {
    "v": 1,
    "key": {
      "_id": 1
    },
    "name": "_id_",
    "ns": "be-mean.restaurantes"
  }
```

> O MongoDB cria um índice padrão na criação de uma `collection`, o chamado `Object Id`. 

Vamos trazer o mesmo documento que trouxemos no último exemplo, porém utilizando esse índice.

```js
db.restaurantes.find( {ObjectId("5650d036dd3bb10f0d34c443")} ).explain("executionStats");
```

##### Saída

```js
{
  "queryPlanner": {
    "plannerVersion": 1,
    "namespace": "be-mean.restaurantes",
    "indexFilterSet": false,
    "parsedQuery": {
      "_id": {
        "$eq": ObjectId("5650d036dd3bb10f0d34c443")
      }
    },
    "winningPlan": {
      "stage": "IDHACK"
    },
    "rejectedPlans": [ ]
  },
  "executionStats": {
    "executionSuccess": true,
    "nReturned": 1,
    "executionTimeMillis": 0,
    "totalKeysExamined": 1,
    "totalDocsExamined": 1,
    "executionStages": {
      "stage": "IDHACK",
      "nReturned": 1,
      "executionTimeMillisEstimate": 0,
      "works": 2,
      "advanced": 1,
      "needTime": 0,
      "needFetch": 0,
      "saveState": 0,
      "restoreState": 0,
      "isEOF": 1,
      "invalidates": 0,
      "keysExamined": 1,
      "docsExamined": 1
    }
  },
  "serverInfo": {
    "host": "igorpc",
    "port": 27017,
    "version": "3.0.7",
    "gitVersion": "6ce7cbe8c6b899552dadd907604559806aa2e9bd"
  },
  "ok": 1
}
```

Agora temos o tempo de retorno de **0ms** e apenas **um** documento examinado, isto é, apenas o índice.

```js
"executionTimeMillis": 0,
"totalDocsExamined": 1,
```

#### Como criar um Index?

Criamos um `índice` através da função `createIndex( {campo: ordem} )`, onde `ordem` refere-se a ordenação natural(**1**) ou inversa(**-1**), tanto alfabeticamente quanto numérica.

```js
db.restaurantes.createIndex( {name: 1} );
```

##### Saída

```js
{
  "createdCollectionAutomatically": false,
  "numIndexesBefore": 1,
  "numIndexesAfter": 2,
  "ok": 1
}
```

Agora vamos testar o índice com o mesmo exemplo que fizemos buscando o restaurante pelo nome.

```js
db.restaurantes.find( {name: "Morris Park Bake Shop"} ).explain("executionStats").executionStats.executionTimeMillis;
```

> 0ms

```js
db.restaurantes.find( {name: "Morris Park Bake Shop"} ).explain("executionStats").executionStats.totalDocsExamined;
```

> 1 índice.

#### Como deletar um Index

Exatamente da maneira que ele foi criado, porém agora com a função `dropIndex()`

```js
db.restaurantes.dropIndex( {name: 1} );
```

##### Saída

```js
{
  "nIndexesWas": 2,
  "ok": 1
}
```

#### Observação

Índices melhoram muito a velocidade de `queries` e `updates` porém eles aumentam o peso e o número de operações da `database`, portanto devem ser criados apenas quando realmente são necessários.

Uma dica é criar **índices compostos**, com mais de um campo, com isso, além de a `query` ser mais precisa e assertiva ela será bem rápida.

### [GridFS](https://docs.mongodb.org/manual/core/gridfs/)
GridFS é o sistema de arquivos do MongoDB, o qual faz o armazenamento de arquivos binários que excedam o tamanho do documento **BSON** de 16Mb em *chunks* de 255kb cada, sendo que podemos acessar essas partes sem carregar o arquivo inteiro na memória.

Não é possível fazer alterações e atualizações em todo o arquivo automaticamente, para isso é necessário criar e salvar uma nova versão, com isso podemos verificar a versão mais atual do arquivo pelo campo `uploadDate` e deletar os anteriores, se preferir.

#### Sintaxe
```js
mongofiles -h <host> -d <nome_db> put <arquivo>
```

#### Exemplo

```
mongofiles -h 127.0.0.1 -d be-mean-files put ~/Desktop/Os_Raios_do_Pikachu.mp4 
2015-11-29T12:40:49.037-0200  connected to: 127.0.0.1
added file: /home/igor/Desktop/Os_Raios_do_Pikachu.mp4
```

Quando salvamos um arquivo no GridFS duas coleções são criadas a `fs.chunks` e a `fs.files`.
#### fs.chunks
Na coleção `fs.chunks` fica o arquivo binário divido em pequenas partes, chamadas de `chunks`, cada `chunk` é um documento contendo 255KB de dados seguindo essa estrutura:

```js
{
  "_id" : <ObjectId>, // id da chunk
  "files_id" : <ObjectId>, // mantém relacionamento com o fs.files
  "n" : <num>, // índice da chunk no arquivo
  "data" : <binary> // dados binários
}
```

#### fs.files
Onde são armazenados os metadados do arquivo, como:

```js
{
  "_id" : <ObjectId>, // id que é referenciado em cada chunk no campo files_id
  "length" : <num>, // tamanho total do arquivo em bytes
  "chunkSize" : <num>, // tamanho dos chunks
  "uploadDate" : <timestamp>, // quando o arquivo foi criado
  "md5" : <hash>, // gerado a partir do conteúdo deste arquivo
  "filename" : <string>, // nome do arquivo inserido
}
```

> Se fizermos uma `query` pelo `md5` e encontramos mais de um documento, significa que temos documentos idênticos salvos no GridFS, com isso podemos decidir o que fazer com estes arquivos.

#### Dica
Se for usar GridFS, utilize-o em um servidor próprio (diferente do `mongod`) para configurá-lo da melhor maneira possível.

### Replica
A Replica é um recurso muito importante que **devemos** utilizar em todos os projetos. Ela faz o espelhamento dos dados de um servidor para outro, no MongoDB uma `ReplicaSet` pode conter 50 membros, ou seja, **50 Replicas** contando com os árbitros.

![Replicas](https://github.com/igorvidottof/curso-be-mean-instagram/blob/master/imgs/replicas.png)

> Todas as operações de escrita são feitas no primária e replicada para os secundários. As operações de leitura também são feitas na primária.

#### Importante
**Devemos também replicar os `Shards`.**

A Replica tem duas etapas:
  * Initial Sync
  * Replication

#### Oplog
O `oplog` (log de operações) é uma **capped collection** especial que mantém os registros de todas as operações de modificação de dados.

O MongoDB aplica as operações na Replica primária e, em seguida, registra as operações no `oplog`. 

Os membros secundários, então, copiam e aplicam essas operações em um processo assíncrono.

#### Utilizando Replicas
##### Primeiramente temos que criar os diretórios aos quais vamos replicar os dados.

```js
mkdir /data/rs1
mkdir /data/rs2
mkdir /data/rs3
```

##### Fazer o `Script` para criar os servidores para replicação.

```js
mongod --replSet replica_set --port 27017 --dbpath /data/rs1/ --logpath /data/rs1/log.txt --fork
mongod --replSet replica_set --port 27018 --dbpath /data/rs2/ --logpath /data/rs2/log.txt --fork
mongod --replSet replica_set --port 27019 --dbpath /data/rs3/ --logpath /data/rs3/log.txt --fork
```

> O `--logpath` e o `--fork` faz com que o log seja escrito em background num arquivo, sem retorno das operações no terminal.

##### Conectar com o cliente num dos servidores

```js
mongo --port 27017
```

##### Criar um arquivo de configuração

```js
rsconf = {
   _id: "replica_set",
   members: [
    {
     _id: 0,
     host: "127.0.0.1:27017"
    }
  ]
}
```

##### Iniciar o `replica set` com esse arquivo de configuração para criar a Replica Primária

```js
rs.initiate(rsconf)
```

Com isso já aparecerá que estamos conectados na **Replica Primária**.

##### Adicionar replicas
Para adicionar replicas ao `replica set` é muito simples, temos apenas que utilizar o `rs.add()` passando como parâmetro a `string` da porta em que está o servidor de replica:

```js
rs.add("127.0.0.1:27018");
```

```js
rs.add("127.0.0.1:27019");
```

Com isso temos duas replicas secundárias.

##### Verificar o status da replica set

```js
rs.status()
```

##### Verificar os dados do oplog

```js
rs.printReplicationInfo();
```

##### Rebaixamento de Replica Primária
Num ambiente de produção, por exemplo, que temos replicas em servidores diferentes, se o que está a Replica Primaria cai ou dá algum problema, podemos rebaixá-la, com isso o MongoDB elege outra primária automaticamente pelos árbitros.

Fazemos isso com o seguinte comando:

```js
rs.stepDown()
```

##### Exercício Explain e Index [(resolvido)](https://github.com/igorvidottof/curso-be-mean-instagram/tree/master/01-modulo-mongodb/exercicios/aula-06)

## [Aula 07](https://www.youtube.com/watch?v=1ElYrkSIvII)
### Replicas
#### Árbitros
Quando um servidor de replica primário é derrubado outro servidor de replica deve assumir sua posição, contudo podemos ter vários servidores secundários de replicas levantados, neste ponto que entra o *árbitro*, ele também é uma `replica set`, porém não guarda dados, apenas tem o papel de decidir qual replica deve se tornar a primária. Devemos utilizar árbitros **somente** quando temos um número par de replicas, para que então ele desempate a votação entre as replicas secundárias.

###### Obs:
> Árbitros não necessitam de hardwares dedicados

##### Como usar?
Primeiramente precisamos criar um diretório onde armazenaremos os dados de configuração do árbitro.

```
mkdir /data/arb
```

Após isso levantamos o mongod utilizando esse diretório que criamos para o árbitro

```
mongod --replSet replica_set --port 30000 --dbpath /data/arb
```

Agora só precisamos conectar na replica primária e adicionar o árbitro. Tomemos o cenário onde nossa replica primária está na porta 27017.

Conectando...

```
mongod --port 27017
```

Adicionando o árbitro...

```
rs.addArb("127.0.0.1:30000");
```

Se tudo correu bem uma mensagem `"ok"` aparecerá no console. Agora vamos verificar se o árbitro realmente faz parte de nosso replica set.

```js
rs.status();

//Saída
{
  "set": "replica_set",
  "date": ISODate("2015-12-07T15:59:31.536Z"),
  "myState": 1,
  "members": [
    {
      "_id": 0,
      "name": "127.0.0.1:27017",
      "health": 1,
      "state": 1,
      "stateStr": "PRIMARY",
      "uptime": 474,
      "optime": Timestamp(1449503964, 1),
      "optimeDate": ISODate("2015-12-07T15:59:24Z"),
      "electionTime": Timestamp(1449503518, 1),
      "electionDate": ISODate("2015-12-07T15:51:58Z"),
      "configVersion": 4,
      "self": true
    },
    {
      "_id": 1,
      "name": "127.0.0.1:27018",
      "health": 1,
      "state": 2,
      "stateStr": "SECONDARY",
      "uptime": 453,
      "optime": Timestamp(1449503964, 1),
      "optimeDate": ISODate("2015-12-07T15:59:24Z"),
      "lastHeartbeat": ISODate("2015-12-07T15:59:30.489Z"),
      "lastHeartbeatRecv": ISODate("2015-12-07T15:59:31.344Z"),
      "pingMs": 0,
      "configVersion": 4
    },
    {
      "_id": 2,
      "name": "127.0.0.1:27019",
      "health": 1,
      "state": 2,
      "stateStr": "SECONDARY",
      "uptime": 443,
      "optime": Timestamp(1449503964, 1),
      "optimeDate": ISODate("2015-12-07T15:59:24Z"),
      "lastHeartbeat": ISODate("2015-12-07T15:59:30.489Z"),
      "lastHeartbeatRecv": ISODate("2015-12-07T15:59:29.869Z"),
      "pingMs": 0,
      "configVersion": 4
    },
    {
      "_id": 3,
      "name": "127.0.0.1:30000",
      "health": 1,
      "state": 7,
      "stateStr": "ARBITER",
      "uptime": 7,
      "lastHeartbeat": ISODate("2015-12-07T15:59:30.489Z"),
      "lastHeartbeatRecv": ISODate("2015-12-07T15:59:30.491Z"),
      "pingMs": 0,
      "configVersion": 4
    }
  ],
  "ok": 1
}
```

###### There it is o/

## Sharding
Sharding é o processo de armazenamento de dados em várias máquinas(servidores), é a abordagem que o MongoDB faz para atender o crescimento dos dados. Promove a escalabilidade horizontal.

#### Qual é a diferença entre escalabilidade horizontal e vertical?
Na **vertical** o que aumenta é a capacidade do servidor, melhoras em seu hardware, quantidade de memória, processamento, já na **horizontal** o aumento é no número de servidores, distribuindo assim a carga de processamento.

### Arquitetura de um Cluster com MongoDB
Num *cluster* com MongoDB existem três serviços:

#### Shards
*Shards* armazenam dados. Cada *shard* é um replica set do MongoDB que guarda um pedaço da sua coleção.

#### Config Servers
Cada *config server* é uma instância do MongoDb que guarda os metadados(informações) sobre o cluster. Os metadados mapeiam os *chunks*(pedaços) de dados para os shards. Clusters num ambiente de produção possuem exatamente **três** Config Servers.

#### Router
O *Router* (*Query Router* ou *mongos instances*) processa e direciona as operações para os shards e então retorna os resultados para os clientes. Com isso, a aplicação não acessa diretamente os shards. Um cluster pode conter mais de um 
query router.

### Criando um Cluster
Primeiramente devemos criar as pastas para nossos config servers e levantar o mongod com a opção `--configsvr` numa porta específica.

```js
mkdir \data\configdb
mongod --configsvr --port 27010
```

Depois disso precisamos criar o Router utilizando o mongos, indicando o Config Server que ele acessará para ter as informações dos Shards.

```js
mongos --configdb localhost:27010 --port 27011
```

Tendo esses pontos configurados vamos criar e levantar três shards para exemplificação.

Criando as pastas...

```js
mkdir /data/shard1 && mkdir /data/shard2 && mkdir /data/shard3
```

Levantando os shards em terminais diferentes

**Shard 1**

```js
mongod --port 27012 --dbpath /data/shard1
```

**Shard 2**

```js
mongod --port 27013 --dbpath /data/shard2
```

**Shard 3**

```js
mongod --port 27014 --dbpath /data/shard3
```

Agora temos que conectar na porta do Router e adicionar os shards a ele.

Conectando ao Router

```js
mongo --host localhost --port 27011
```

Adicionando os shards

```js
mongos> sh.addShard("localhost:27012")
{
  "shardAdded": "shard0000",
  "ok": 1
}
[mongos] test> sh.addShard("localhost:27013")
{
  "shardAdded": "shard0001",
  "ok": 1
}
[mongos] test> sh.addShard("localhost:27014")
{
  "shardAdded": "shard0002",
  "ok": 1
}
```

Depois disso vamos especificar qual *database* servirá de base para o shard com a função `sh.enableSharding()`

```js
[mongos] test> sh.enableSharding("be-mean")
{
  "ok": 1
}
```

E logo após especificamos qual coleção será "shardeada" com a função `sh.shardCollection()`

```js
[mongos] test> sh.shardCollection( "be-mean.notas", {"_id": 1} )
{
  "collectionsharded": "be-mean.notas",
  "ok": 1
}

```

> A sintaxe desse comando é sh.shardCollection( "<database>.<collection>, shard-key-pattern" ), onde o shard-key se refere ao campo de separação dos documentos, tem a mesma função da key de uma index.

Tudo pronto, agora vamos popular essa collection, lembrando que devemos enviar os dados sempre para o Router para ele decidir o que fazer.

```js
for ( i = 1; i < 100000; i++ ) {
  db.notas.insert(
        {
            tipo: "prova",
            nota : Math.random() * 100,
            estudante_id: i, 
            active: true, 
            date_created: Date.now(),
            escola: "Webschool", 
            país: "Brasil", 
            rg: i*3 
        }
  );
}
```

#### Observação
O tamanho padrão do chunk de cada shard é **64MB**, logo a coleção precisa ser maior que 64MB para que ocorra a divisão dos seus dados pela *shard-key*.

Dependendo do número de shards do seu cluster o MongoDb pode esperar que tenha pelo menos 10 chunks para disparar a migração.

Podemos utilizar o comando `db.printShardingStatus()` para ver todos os chunks presentes no servidor.


## Gerenciamento de Usuários no MongoDB
O MongoDb trabalha com usuários definindo quais seus papéis/funções (roles) no sistema.

Ele concede acesso a dados e comandos através de autorização baseada em funções(roles) e fornece papéis integrados que fornecem os diferentes níveis de acesso. Além disso, podemos criar papéis definidos pelo usuário.

A função concede privilégios para executar conjuntos de ações sobre os recursos definidos. Um papel é aplicado ao banco de dados no qual ele está definido e pode conceder acesso a um nível de coleção.

Toda informação de autenticação e autorização de usuários fica na coleção **system.users** na database **admin**. 

### Comandos de gerenciamento de usuários

#### createUser
Cria um usuário no banco de dados onde o comando for executado.

##### Acesso Requerido

Para criar um novo usuário em um banco de dados, devemos ter a ação createUser. Para conceder funções a um usuário, devemos ter a ação *grantRole* no banco de dados onde existe esse papel.

##### Sintaxe

```js
{ createUser: "<name>",
  pwd: "<cleartext password>",
  customData: { <any information> },
  roles: [
    { role: "<role>", db: "<database>" } | "<role>",
    ...
  ],
  digestPassword: boolean, //opcional
  writeConcern: { <write concern> }
}
```


##### Exemplo
Criando um usuário administrador

Para trabalhar com usuários precisamos primeiramente acessar a db **admin**

```js
use admin
```

Agora podemos rodar o comando `createUser()`

```js
db.createUser(
   {
      user: "IgorAdmin",
      pwd: "admin123",
      roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
   }
)

//Saída
Successfully added user: {
  "user": "IgorAdmin",
  "roles": [
    {
      "role": "userAdminAnyDatabase",
      "db": "admin"
    }
  ]
}
```

#### updateUser
Atualiza o perfil do usuário no banco de dados no qual executamos o comando. Este comando sobrescreve os dados antigos com os dados passados para ele.

Para atualizar um usuário, precisamos especificar o campo *updateUser* e pelo menos um outro campo, exceto *writeConcern*.

##### Acesso Requerido

Devemos ter o acesso, que inclui a ação *revokeRole* em todos os bancos, a fim de atualizar os papéis de um usuário.

Se quisermos adicionar uma função a um usuário devemos ter a ação *grantRole* no banco de dados.

Para alterar o campo *pwd* ou *customData* de outro usuário, devemos ter as ações *changeAnyPassword* e *changeAnyCustomData*.

Para modificar nossos próprios dados de senha e customData, devemos ter os privilégios *changeOwnPassword* e *changeOwnCustomData*.

##### Sintaxe

```js
{ updateUser: "<username>",
  pwd: "<cleartext password>",
  customData: { <any information> },
  roles: [
    { role: "<role>", db: "<database>" } | "<role>",
    ...
  ],
  writeConcern: { <write concern> }
}
```

##### Exemplo
Vamos adicionar a propriedade customData que o usuário "IgorAdmin" não possuía antes.

```js
db.runCommand(
    {
        updateUser: "IgorAdmin",
        customData: { teacher: false }
    }
)

//Saída
{
  "ok": 1
}
```

> Como no exemplo, vimos que podemos usar também a função `runCommand()` para manipular as operações de gerenciamento de usuários, basta passar o primeiro campo com o nome do comando que deseja executar, neste caso `updateUser`

###### Warning!
Como dito acima o updateUser substitui os dados anteriormente definidos pelos novos dados, sem nenhum consentimento :anguished:

Sabendo disso não devemos utilizar essa função para alterar o array de roles. Para isso há funções específicas como  *grantRolesToUser* para adicionar roles ou *revokeRolesFromUser* para remover. 

#### dropUser
Remove o usuário da database onde é executado.

##### Acesso Requerido

Devemos possuir a ação *dropUser* em um banco de dados para remover um usuário dele.

##### Sintaxe

```js
{
  dropUser: "<user>",
  writeConcern: { <write concern> }
}
```

##### Exemplo

```js
db.runCommand(
    {
         dropUser: "IgorAdmin",
         writeConcern: { w: "majority", wtimeout: 5000 }
    }
)

//Saída
{
  "ok": 1
}
```

#### dropAllUsersFromDatabase
Remove todos os usuários do banco de dados no qual você executa o comando.

##### Acesso Requerido
Devemos possuir a ação *dropUser* em um banco de dados para remover um usuário dele.

##### Sintaxe

```js
{ dropAllUsersFromDatabase: 1,
  writeConcern: { <write concern> }
}
```

> O 1 indica o valor booleano true

##### Exemplo

```js
db.runCommand( 
    {
        dropAllUsersFromDatabase: 1,
        writeConcern: { w: "majority" } 
    } 
)

//Saída
{
  "n": 1,
  "ok": 1
}
```

> n é o número de usuários deletados

#### grantRolesToUser
Adiciona papéis a um usuário.

##### Acesso Requerido
Devemos ter a ação *grantRole* em um banco de dados para adicionar um papel a um usuário do mesmo.

##### Sintaxe

```
{ grantRolesToUser: "<user>",
  roles: [ <roles> ],
  writeConcern: { <write concern> }
}
```

##### Exemplo

```js
db.runCommand( { grantRolesToUser: "OutroUser",
  roles: [
    { role: "read", db: "be-mean"},
    "readWrite"
  ],
  writeConcern: { w: "majority" , wtimeout: 2000 }
 })
 ```

#### revokeRolesFromUser
Remove uma ou mais funções de um usuário no banco de dados. 

##### Acesso Requerido

Devemos ter a ação *revokeRole* em um banco de dados para remover um ou mais papéis de um usuário do mesmo.

##### Sintaxe

```js
{ revokeRolesFromUser: "<user>",
  roles: [
    { role: "<role>", db: "<database>" } | "<role>",
    ...
  ],
  writeConcern: { <write concern> }
}
```

##### Exemplo

```js
 db.runCommand( { revokeRolesFromUser: "OutroUser",
  roles: [
          { role: "read", db: "be-mean" },
          "readWrite"
  ],
  writeConcern: { w: "majority" }
 })
```

#### usersInfo
Retorna informações sobre um ou mais usuários.

##### Sintaxe

```js
{ usersInfo: { user: "<name>", db: "<db>" },
  showCredentials: <Boolean>,
  showPrivileges: <Boolean>
}
```

##### Exemplo
Se quisermos verificar um usuário específico, podemos buscá-lo por seu nome de usuário.

```js
db.runCommand({
    usersInfo: { user: "IgorAdmin", db: "admin" }
})

//Saída
{
  "users": [
    {
      "_id": "admin.IgorAdmin",
      "user": "IgorAdmin",
      "db": "admin",
      "customData": {
        "student": true
      },
      "roles": [
        {
          "role": "userAdminAnyDatabase",
          "db": "admin"
        }
      ]
    }
  ],
  "ok": 1
}
```

Se quisermos ver as credenciais deste usuário podemos acrescentar o campo `showCredentials: true`

```js
db.runCommand({
    usersInfo: { user: "IgorAdmin", db: "admin" },
    showCredentials: true
})

//Saída
{
  "users": [
    {
      "_id": "admin.IgorAdmin",
      "user": "IgorAdmin",
      "db": "admin",
      "credentials": {
        "SCRAM-SHA-1": {
          "iterationCount": 10000,
          "salt": "Vse5GCluCmfRUFFxIPvSPA==",
          "storedKey": "vK9P3PDfQi41vCCu8ibhLYauQLM=",
          "serverKey": "+bpwOL7iz3Ht71K6NSHr6YWW9fc="
        }
      },
      "customData": {
        "student": true
      },
      "roles": [
        {
          "role": "userAdminAnyDatabase",
          "db": "admin"
        }
      ]
    }
  ],
  "ok": 1
}
```

Ainda podemos obter também as informações dos privilégios(ações) que o usuário possui, passando também o campo `show Privileges: true`

```js
db.runCommand({
    usersInfo: { user: "IgorAdmin", db: "admin" },
    showCredentials: true,
    showPrivileges: true
})

//Saída
{
  "users": [
    {
      "_id": "admin.IgorAdmin",
      "user": "IgorAdmin",
      "db": "admin",
      "credentials": {
        "SCRAM-SHA-1": {
          "iterationCount": 10000,
          "salt": "Vse5GCluCmfRUFFxIPvSPA==",
          "storedKey": "vK9P3PDfQi41vCCu8ibhLYauQLM=",
          "serverKey": "+bpwOL7iz3Ht71K6NSHr6YWW9fc="
        }
      },
      "customData": {
        "student": true
      },
      "roles": [
        {
          "role": "userAdminAnyDatabase",
          "db": "admin"
        }
      ],
      "inheritedRoles": [
        {
          "role": "userAdminAnyDatabase",
          "db": "admin"
        }
      ],
      "inheritedPrivileges": [
        {
          "resource": {
            "db": "",
            "collection": ""
          },
          "actions": [
            "changeCustomData",
            "changePassword",
            "createRole",
            "createUser",
            "dropRole",
            "dropUser",
            "grantRole",
            "revokeRole",
            "viewRole",
            "viewUser"
          ]
        },
        {
          "resource": {
            "cluster": true
          },
          "actions": [
            "authSchemaUpgrade",
            "invalidateUserCache",
            "listDatabases"
          ]
        },
        {
          "resource": {
            "db": "",
            "collection": "system.users"
          },
          "actions": [
            "collStats",
            "dbHash",
            "dbStats",
            "find",
            "killCursors",
            "listCollections",
            "listIndexes",
            "planCacheRead"
          ]
        },
        {
          "resource": {
            "db": "admin",
            "collection": "system.users"
          },
          "actions": [
            "collStats",
            "createIndex",
            "dbHash",
            "dbStats",
            "dropIndex",
            "find",
            "killCursors",
            "listCollections",
            "listIndexes",
            "planCacheRead"
          ]
        },
        {
          "resource": {
            "db": "admin",
            "collection": "system.roles"
          },
          "actions": [
            "collStats",
            "createIndex",
            "dbHash",
            "dbStats",
            "dropIndex",
            "find",
            "killCursors",
            "listCollections",
            "listIndexes",
            "planCacheRead"
          ]
        },
        {
          "resource": {
            "db": "admin",
            "collection": "system.version"
          },
          "actions": [
            "collStats",
            "dbHash",
            "dbStats",
            "find",
            "killCursors",
            "listCollections",
            "listIndexes",
            "planCacheRead"
          ]
        },
        {
          "resource": {
            "db": "admin",
            "collection": "system.new_users"
          },
          "actions": [
            "collStats",
            "dbHash",
            "dbStats",
            "find",
            "killCursors",
            "listCollections",
            "listIndexes",
            "planCacheRead"
          ]
        },
        {
          "resource": {
            "db": "admin",
            "collection": "system.backup_users"
          },
          "actions": [
            "collStats",
            "dbHash",
            "dbStats",
            "find",
            "killCursors",
            "listCollections",
            "listIndexes",
            "planCacheRead"
          ]
        }
      ]
    }
  ],
  "ok": 1
}
```

##### Listando mais de um usuário
Para listar mais de um usuário por vez basta que passemo-nos num array no campo `usersInfo`.

```js
db.runCommand({
    usersInfo: [ 
        { user: "FirstUser", db: "admin" }, 
        { user: "SecondUser", db: "admin" }, 
        { user: "ThirdUser", db: "another-db" } 
    ]
})
```

##### Listando todos os usuários
Para listar todos os usuários passamos o valor 1 (*true*) para o campo usersInfo.

```js
db.runCommand( { usersInfo: 1 } )
```

### Conectar autenticando
Primeiramente levantamos o mongod com a opção `--auth`

```js
mongod --auth --port 27017
```

Depois conectamos ao servidor passando as usuário e senha

```js
mongo --port 27017 -u "<user>" -p "<password>" --authenticationDatabase "<db>"
```


