# API de Gerenciamento de Raquetes de Beach Tennis

---

## Identificação do Autor

**Nome Completo do Aluno:** Gabriel Goettenauer da Silva Almeida

---

## Descrição do Projeto

Esta API RESTful é uma aplicação robusta e segura, desenvolvida com o **NestJS**, um framework progressivo de Node.js. Ela foi criada para gerenciar informações de raquetes de beach tennis, oferecendo um conjunto completo de operações CRUD (Create, Read, Update, Delete).

Além das funcionalidades básicas de gerenciamento de dados, a API incorpora recursos avançados de segurança e observabilidade:

* **Autenticação JWT:** Sistema completo de registro e login de usuários com JSON Web Tokens para garantir acesso seguro.
* **Controle de Acesso com Guards:** Proteção de rotas utilizando Guards do NestJS, exigindo autenticação para acessar endpoints sensíveis.
* **Middleware:** Implementação de um middleware de logging para monitorar requisições.
* **Interceptadores:** Transformação de respostas da API para adicionar informações úteis, como timestamps.
* **Persistência de Dados:** Utiliza **Prisma** como ORM para interagir com um banco de dados relacional.
* **Validação de Dados:** Garante a integridade dos dados através de DTOs e Pipes de validação.
* **Tratamento de Erros:** Um filtro de exceções global para respostas de erro padronizadas.
* **Documentação Interativa:** Geração automática de documentação com Swagger UI.
* **Versionamento de API:** Suporte para diferentes versões da API.

---

## Link para a API em Produção

**URL da API Publicada:** `[ ]`

---

## Instruções de Execução Local

Siga os passos abaixo para configurar e executar a API em seu ambiente de desenvolvimento.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

* **Node.js:** Versão 18.x ou superior (recomendado 20.x)
* **NPM (Node Package Manager):** Versão 9.x ou superior
* **Git:** Para clonar o repositório

### Instalação

1.  Clone este repositório:
    ```bash
    git clone https://github.com/Gabriel-Goettenauer/api-gerenciamento-raquetes.git
    cd 
    ```
2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```

### Configuração do Banco de Dados

Esta API utiliza **Prisma** para gerenciar a persistência de dados.

1.  Crie um arquivo `.env` na raiz do projeto (na mesma pasta do `package.json`).
2.  Adicione as seguintes variáveis de ambiente, configurando a `DATABASE_URL` de acordo com seu banco de dados:

    ```
    DATABASE_URL="file:./dev.db" # Exemplo para SQLite (recomendado para dev local)
    # Ou para PostgreSQL: DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

    JWT_SECRET="sua_chave_secreta_super_forte_e_aleatoria_aqui" # Use uma string longa e aleatória
    ```

3.  Execute as migrações do Prisma para criar o schema do banco de dados:
    ```bash
    npx prisma migrate dev --name initial_schema
    ```
    * Siga as instruções no terminal. Se for a primeira vez, o Prisma criará as tabelas `User` e `Racket`.

### Execução da API

1.  Para iniciar a API em modo de desenvolvimento (com *hot-reload*):
    ```bash
    npm run start:dev
    ```
2.  A API estará acessível em `http://localhost:3000`.

---

## Documentação da API

A documentação interativa da API, gerada com **Swagger UI**, está disponível no seguinte link quando a API estiver rodando localmente ou em produção:

**URL da Documentação Swagger:** `http://localhost:3000/api`

---

## Diagrama de Entidade-Relacionamento (ERD)

O modelo de dados da aplicação é definido no arquivo `prisma/schema.prisma`. As principais entidades são `User` (para autenticação) e `Racket` (para o gerenciamento de raquetes).

* *Dica:* Ferramentas como a extensão do Prisma para VS Code podem ajudar a gerar um ERD visual a partir do seu `schema.prisma`.

---

## Checklist de Funcionalidades Concluídas

Esta seção detalha as funcionalidades implementadas de acordo com os Requisitos de Aprendizagem (RAs) e Indicadores de Desempenho (IDs).

### RA1 - Projetar e desenvolver uma API funcional utilizando o framework NestJS.

* [x] **ID1:** Configuração do ambiente e arquitetura modular (rotas, controladores).
* [x] **ID2:** Boas práticas na organização da lógica de negócios (services).
* [x] **ID3:** Uso de providers e Injeção de Dependência.
* [x] **ID4:** Manipulação de rotas HTTP (parâmetros, query, body).
* [x] **ID5:** Tratamento de erros com filtros globais.
* [x] **ID6:** Criação de DTOs para validação de dados.
* [x] **ID7:** Aplicação de pipes de validação.

### RA2 - Implementar persistência de dados com um banco de dados relacional utilizando Prisma.

* [x] **ID8:** Modelagem de dados (entidades, relações no `schema.prisma`).
* [x] **ID9:** Conexão a banco de dados relacional via Prisma.
* [x] **ID10:** Criação e aplicação de migrações de banco de dados.
* [x] **ID11:** Implementação de operações CRUD para a entidade `Racket`.

### RA3 - Realizar testes automatizados para garantir a qualidade da API.

* [x] **ID12:** Implementação de testes automatizados (unitários/integração com Jest).
* [x] **ID13:** Cobertura de testes para rotas e serviços principais (CRUD).

### RA4 - Gerar a documentação da API e realizar o deploy em um ambiente de produção.

* [x] **ID14:** Integração e geração de documentação Swagger.
* [ ] **ID15:** Realização do deploy da API em plataforma de nuvem.
* [ ] **ID16:** Funcionamento correto da API em ambiente de produção (incluindo Swagger e DB).
* [x] **ID17:** Configuração de variáveis de ambiente com `ConfigModule`.
* [x] **ID18:** Implementação de versionamento de APIs REST (`v1`).

### RA5 - Implementar autenticação, autorização e segurança em APIs utilizando JWT, Guards, Middleware e Interceptadores.

* [x] **ID19:** Configuração da autenticação com JWT.
* [x] **ID20:** Implementação de controle de acesso com Guards.
* [x] **ID21:** Configuração e utilização de Middleware (logging).
* [x] **ID22:** Implementação de Interceptadores (transformação de resposta).

---