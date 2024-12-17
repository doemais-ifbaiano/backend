# backend

## Sobre

Backend do aplicativo Doe Mais, responsável por gerenciar o aplicativo que facilita doações para instituições, possibilitando contribuições financeiras e materiais, acompanhamento de campanhas, visualização de instituições atendidas e integração entre doadores e causas, promovendo uma rede de solidariedade.

## Instalação

1. Clone o repositório:
```bash
 git clone git@github.com:Doe-IFBaiano/backend.git
```
 
2. Copie em um arquivo .env as variáveis necessárias e altere de acordo com o ambiente passado:
```bash
cp .env.example .env
 ```

3. Instale as dependências:

OP 1
 
```bash
npm install
```

OP 2

```bash
yarn install
```

4. Inicialize o Prisma ORM:

```bash
npx prisma init
```

Modifique a linha gerada pelo Prisma para o formato abaixo:

```bash
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=public"
```

5. Configure o Docker:

```bash
docker compose up -d
```

6. Inicialize o projeto:
```bash
npm start
```

## Licença
Este projeto está licenciado sob a Licença GNU GPL - veja o arquivo [LICENÇA](LICENSE) para detalhes.
