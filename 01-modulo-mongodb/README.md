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
mongoexport | Exporta os dados de uma coleção para um arquivo JSON | mongoexport --db nome_database --collection nome_collection --out nome_arquivo.json
mongoimport | Importa os dados de um arquivo JSON para uma database | mongoimport --db nome_database --collection nome_collection --drop --file nome_arquivo.json

> --db e --collection podem ser simplificados por -d e -c

#### Exercício
Realizar o import do documento restaurantes.json para o banco be-mean, coleção restaurantes e contar a quantidade de documentos importados.

#### Observação

> Evite usar mongoimport e mongoexport para backups de instância de produção. Eles não preservarão de forma confiável todos os tipos de dados ricos do BSON, porque JSON só pode representar um subconjunto dos tipos suportados pelo BSON. Use mongodump e mongorestore como descrito em MongoDB Backup Methods para esse tipo de funcionalidade.
