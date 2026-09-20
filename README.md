# Cashflow API

API REST de fluxo de caixa: receitas, despesas, categorias e resumos por período.

## Stack

- Node.js 20+ e TypeScript
- Express 5
- PostgreSQL e Sequelize
- Zod (validação)
- JWT, Helmet e CORS
- ESLint, Prettier e Husky

## Funcionalidades

- Cadastro e login; senha com hash; token JWT
- Papéis `USER` e `ADMIN` — usuário comum só acessa o próprio `userId`
- Categorias (com totais de movimentos)
- Movimentos (entrada/saída), tipos e métodos de pagamento
- Resumo mensal e anual (totais e variação)

## Arquitetura

```
routes → middlewares → controllers → services → repositories → models
```

Request validado com Zod (`UserSchema`, `CategorySchema`, …). Resposta via DTOs (`UserDto.Response`, …). Erros de negócio passam por exceptions e um error middleware.

## Como rodar

Requisitos: Node.js 20+ e PostgreSQL.

```bash
cp .env.example .env   # ou crie o .env na mão
npm install
npm run db:migrate
npm run dev
```

API em `http://localhost:3000/api`.

## Variáveis de ambiente

| Variável         | Descrição                                                    |
| ---------------- | ------------------------------------------------------------ |
| `PORT`           | Porta HTTP (default `3000`)                                  |
| `DATABASE_URL`   | URL do Postgres (`postgres://user:pass@host:5432/cash-flow`) |
| `JWT_SECRET`     | Segredo do token (mín. 32 caracteres)                        |
| `JWT_EXPIRES_IN` | Expiração do JWT (default `24h`)                             |
| `CORS_ORIGIN`    | Origin permitida                                             |
| `NODE_ENV`       | `development`, `staging` ou `production`                     |

## Rotas

Prefixo `/api`. Header `Authorization: Bearer <token>` nas rotas autenticadas.

| Método | Caminho                                     | Acesso                             |
| ------ | ------------------------------------------- | ---------------------------------- |
| `POST` | `/users`                                    | Público                            |
| `POST` | `/users/login`                              | Público                            |
| `GET`  | `/users/me`                                 | JWT                                |
| `GET`  | `/users`                                    | ADMIN                              |
| `POST` | `/categories`                               | JWT                                |
| `GET`  | `/categories`                               | ADMIN                              |
| `GET`  | `/categories/user/:userId/all`              | Próprio ou ADMIN                   |
| `GET`  | `/categories/user/:userId/all/complete`     | Próprio ou ADMIN                   |
| `POST` | `/movement`                                 | JWT                                |
| `GET`  | `/movement/user/:userId`                    | Próprio ou ADMIN (`month`, `year`) |
| `GET`  | `/movement/user/:userId/all`                | Próprio ou ADMIN                   |
| `GET`  | `/movement/user/:userId/summary`            | Próprio ou ADMIN                   |
| `GET`  | `/movement/user/:userId/summary/year/:year` | Próprio ou ADMIN                   |
| `GET`  | `/movement-types`                           | JWT                                |
| `GET`  | `/payment-methods`                          | JWT                                |

## Scripts

| Comando                     | Uso                 |
| --------------------------- | ------------------- |
| `npm run dev`               | Servidor com reload |
| `npm run build`             | Compila TypeScript  |
| `npm start`                 | Sobe o `dist`       |
| `npm run db:migrate`        | Roda migrations     |
| `npm run lint` / `lint:fix` | ESLint              |
| `npm run format`            | Prettier            |
