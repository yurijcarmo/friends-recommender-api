# Friends Recommender Api

## Descrição do Projeto

Este projeto consiste em uma API que permite que uma pessoa obtenha sugestões de novos amigos com base nas amizades já existentes. A aplicação escuta na porta 3000 e armazena os dados em memória durante a execução do servidor e não utiliza nenhum banco de dados externo.

Esta API foi desenvolvida utilizando Nest.js e TypeScript, com o auxílio do framework Nest.js para simplificar o desenvolvimento. Além disso, foram implementados testes de integração e unitários utilizando o Jest.

Para mais informações sobre o Nest.js, consulte a [documentação do Nest.js](https://docs.nestjs.com/).

Para mais informações sobre o Node.js, consulte a [documentação do Node.js](https://nodejs.org/en/docs/).

Para mais informações sobre o Jest, consulte a [documentação do Jest](https://jestjs.io/docs/en/getting-started).

# Instruções de Instalação e Execução

## Pré-requisitos

Para executar este projeto, recomenda-se ter o Docker e o Docker Compose instalados em seu sistema operacional. Durante o desenvolvimento deste projeto, os testes foram realizados com as seguintes versões:

- Docker version 26.0.1, build d260a54
- Docker Compose version v2.5.0

Embora essas versões tenham sido usadas para testes, não é estritamente necessário ter exatamente essas versões instaladas. Recomenda-se ter versões recentes para garantir a compatibilidade e evitar possíveis problemas.

Se ainda não foram instalados, siga os links abaixo para instalar:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Instructions for Linux](docker-instructions.md)

Certifique-se também de ter o Git instalado para clonar o repositório.

## Clonando o Repositório

`git clone git@github.com:yurijcarmo/friends-recommender-api.git`

## Execução do Projeto

Para executar o projeto, certifique-se de ter o Docker instalado em sua máquina e execute o seguinte comando na raiz do projeto:

`docker-compose up --build`

Isso iniciará a aplicação na porta 3000.

## Execução dos Testes Automatizados

Para executar os testes automatizados, abra outra aba do terminal e execute os seguintes comandos para entrar no container Docker:

`docker exec -it friends-recommender-api sh`

Em seguida, execute o seguinte comando dentro do container para iniciar os testes:

`npm run test:cov`

Isso iniciará a execução dos testes e garantirá que todas as funcionalidades estejam corretamente implementadas.

## Funcionamento

O sistema permite as seguintes operações:

### Cadastro de Pessoa

- **Endpoint:** `[POST] http://localhost:3000/person`

Esta rota recebe um CPF e um nome, e realiza o cadastro do usuário. Retorna erro com status code 400 caso o usuário já esteja cadastrado ou o CPF informado tenha tamanho diferente de 11 dígitos numéricos.

#### Exemplo de entrada:

```json
{
  "cpf": "12345678901",
  "nome": "João da Silva"
}
```

Saída:
- Retornará código HTTP 200 em caso de sucesso.
- Retornará código HTTP 400 caso o usuário cadastrado já exista ou caso o CPF informado não consista de 11 dígitos numéricos.

### Consulta de Pessoa

- **Endpoint:** `[GET] http://localhost:3000/person/:CPF`

Esta rota recebe um CPF e, se o usuário existir, retorna seus dados (nome e CPF). Caso contrário, retorna erro com status code 404.

Exemplo de saída (sucesso):

```json
{
  "cpf": "12345678901",
  "nome": "João da Silva"
}
```

### Limpeza dos Dados

- **Endpoint:** `[DELETE] http://localhost:3000/clean`

Esta rota limpa todos os dados (pessoas e relacionamentos) em memória.

### Criação de Relacionamento

- **Endpoint:** `[POST] http://localhost:3000/relationship`

Esta rota recebe dois CPFs e, caso os dois usuários existam, cria um relacionamento entre eles. Caso contrário, retorna erro com status code 404.

Exemplo de entrada:

```json
{
  "cpf1": "12345678901",
  "cpf2": "98765432109"
}
```

Saída:
- Retornará código HTTP 200 em caso de sucesso.
- Retornará código HTTP 404 caso um dos usuários não exista.

### Obtenção de Recomendações

- **Endpoint:** `[GET] http://localhost:3000/recommendations/:CPF`

Esta rota recebe um CPF e retorna um array contendo a lista de CPFs de todos os amigos dos amigos do usuário informado que não são seus amigos, ordenada de maneira decrescente pela relevância.

Exemplo de saída:

```json
["98765432109", "45678901234"]
```

### Consulta de Todos os Relacionamentos:

- **Endpoint:** `[GET] http://localhost:3000/relationships`

Consulta todos os relacionamentos cadastrados.

Exemplo de saída:

```json
[
    {
        "cpf1": "55023274544",
        "cpf2": "81434076854"
    },
    {
        "cpf1": "55023274544",
        "cpf2": "23967935996"
    },
    {
        "cpf1": "55023274544",
        "cpf2": "80670382517"
    },
]
```

### Consulta de Todas as Pessoas:

- **Endpoint:** `[GET] http://localhost:3000/persons`

Consulta todas as pessoas cadastradas.

Exemplo de saída:

```json
[
    {
        "cpf": "80670382517",
        "name": "Person 1lckcq"
    },
    {
        "cpf": "36339379315",
        "name": "Person s3z1mi"
    },
    {
        "cpf": "46495398453",
        "name": "Person 1tim8r"
    },
]
```

### Geração de Dados para Teste:

- **Endpoint:** `[POST] http://localhost:3000/socialgraph/generate`

Esta rota gera dados de pessoas e relacionamentos de forma aleatória para fins de teste.

Exemplo de saída: 

```json
{
  "persons": [
    {
      "cpf": "12345678901",
      "nome": "Person ABC"
    },
    {
      "cpf": "23456789012",
      "nome": "Person DEF"
    },
    {
      "cpf": "34567890123",
      "nome": "Person GHI"
    },
  ],
  "relationships": [
    {
      "cpf1": "12345678901",
      "cpf2": "23456789012"
    },
    {
      "cpf1": "12345678901",
      "cpf2": "34567890123"
    },
  ]
}
```

Legal! Não é? Agora que você já está informado de todas as instruções necessárias, você já pode aproveitar esta API para cadastrar pessoas, estabelecer relacionamentos entre elas e receber recomendações de novos amigos!

Divirta-se explorando!
