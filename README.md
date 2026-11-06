# MR Soluções – Express + Handlebars + MySQL

## 1. Banco de dados (MySQL Workbench)
Escolha **uma** opção:

- **Banco novo / pode zerar tudo:** abra e execute `sql/banco_de_dados.sql`
  (apaga e recria as tabelas, **inclusive os usuários cadastrados**).
- **Já tenho o banco e quero manter usuários e produtos:** execute **uma vez**
  `sql/atualizacao_relatorios_e_cadastro_produtos.sql`.

Dica: no Workbench use o raio **sem** o cursor (`Ctrl+Shift+Enter`) para rodar o script inteiro.

## 2. Configurar a conexão
`db/conexao.js` (host, user, password, database) ou as variáveis `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
Defina também `SESSION_SECRET` com um texto longo e aleatório.

> Erro `ER_NOT_SUPPORTED_AUTH_MODE`? Rode no Workbench:
> `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sua_senha'; FLUSH PRIVILEGES;`

## 3. Rodar
```
npm install
npm run dev     # com nodemon
npm start       # sem nodemon
```
Acesse http://localhost:3000 (rode os comandos na pasta onde está o `package.json`).

## 4. Virar administrador
As páginas **Cadastrar Produto** e **Relatórios** só abrem para quem tem `tipo = 'admin'`.
1. Cadastre sua conta em `/cadastro`
2. No Workbench: `UPDATE usuarios SET tipo = 'admin' WHERE email = 'seu@email.com';`
3. Saia e entre de novo no site. O menu passa a mostrar os links de administração.

Quem se cadastra pelo site sempre entra como `cliente`.

## Rotas
| rota | quem acessa | o que faz |
|---|---|---|
| `/` `/sobre` `/servicos` `/contato` `/carrinho` | todos | páginas do site |
| `GET /produtos` | todos | produtos e categorias vindos do MySQL |
| `GET/POST /cadastro` | visitante | cria conta (senha com hash bcrypt) |
| `GET/POST /login`, `GET /logout` | todos | sessão |
| `GET/POST /cadastrar-produto` | **admin** | grava produto (nome, preço, quantidade, categoria) em `produtos` |
| `GET /relatorios` | **admin** | totais, produtos, serviços e clientes lidos do banco |

## Modelo de dados
```
categorias 1 ──< N produtos        servicos        usuarios (tipo: cliente | admin)
```
- `produtos.quantidade` = estoque; `produtos.ativo = 0` esconde da loja sem apagar
- `categorias.cor` = cor da etiqueta no relatório; a categoria **Outros** serve para o que não se encaixa
- Produtos cadastrados pelo formulário usam a imagem `/img/sem-imagem.svg`
- `usuarios.email` e `usuarios.cpf` são UNIQUE
- O relatório de clientes mostra só `tipo = 'cliente'` (administradores ficam de fora)

## Estrutura
```
app.js                       rotas e middlewares (static, urlencoded, session, soAdmin, 404, 403, 500)
db/                          conexao.js  produtos.js  usuarios.js  relatorios.js  (SQL sempre com "?")
sql/                         banco_de_dados.sql  atualizacao_relatorios_e_cadastro_produtos.sql
data/                        dados fixos: site, home, serviços, sobre
views/                       layouts/ partials/ e as páginas .handlebars
public/                      css/ img/ js/ videos/
```

## Pendências
- `public/videos/cliente1.mp4` (carrossel de depoimentos) não veio nos zips.
- O formulário de produto não tem campo de imagem: todo produto novo usa a imagem padrão.
- Produtos só são criados pelo formulário; editar ou apagar ainda é via SQL.
- Para produção: proteção CSRF, limite de tentativas de login e HTTPS (`cookie.secure`).
