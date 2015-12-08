# Anotações Módulo Nodejs

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



