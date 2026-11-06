const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const path = require('path')

const conn = require('./db/conexao')
const produtosDB = require('./db/produtos')
const usuariosDB = require('./db/usuarios')
const relatoriosDB = require('./db/relatorios')

// módulos internos (Aula 1): dados fixos do site
const site = require('./data/site')
const home = require('./data/home')
const sobre = require('./data/sobre')
const servicos = require('./data/servicos')

const app = express()

// Conta administrativa fixa do sistema. O acesso ainda exige a senha cadastrada.
const ADMIN_EMAIL = 'souadm@gmail.com'
const normalizarEmail = email => String(email || '').trim().toLowerCase()

// Handlebars como view engine (Aula 7)
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Arquivos estáticos: /css, /img, /js, /videos (Aula 4)
app.use(express.static(path.join(__dirname, 'public')))

// Lê os campos dos formulários (req.body)
app.use(express.urlencoded({ extended: true }))

// Sessão: guarda quem está logado (cookie com id; os dados ficam no servidor)
app.use(session({
  secret: process.env.SESSION_SECRET || 'troque-este-segredo',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 2 } // 2 horas
}))

// Dados disponíveis em TODAS as views, layout e partials
app.locals.empresa = site.empresa
app.locals.menu = site.menu
app.locals.menuAdmin = site.menuAdmin
app.locals.rodape = site.rodape

// "usuario" fica disponível em todas as views (o cabeçalho usa)
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario
  next()
})

// ---------- páginas ----------

app.get('/', (req, res) => {
  res.render('index', {
    titulo: 'Página Principal - MR Soluções',
    css: 'paginaPrincipal',
    bootstrap: true,
    ...home
  })
})

app.get('/sobre', (req, res) => {
  res.render('sobre', { titulo: 'Sobre Nós - MR Soluções', css: 'sobre', ...sobre })
})

app.get('/servicos', (req, res) => {
  res.render('servicos', {
    titulo: 'Serviços - MR Soluções',
    css: 'servicos',
    ...servicos
  })
})

app.get('/produtos', (req, res, next) => {
  produtosDB.listarPorCategoria((err, categorias) => {
    if (err) return next(err) // cai no middleware de erro 500
    res.render('produtos', {
      titulo: 'Produtos - MR Soluções',
      css: 'produtos',
      js: 'produtos',
      categorias
    })
  })
})

app.get('/contato', (req, res) => {
  res.render('contato', {
    titulo: 'Contato - MR Soluções',
    css: 'contato',
    js: 'contato'
  })
})

app.get('/carrinho', (req, res) => {
  res.render('carrinho', {
    titulo: 'Carrinho - MR Soluções',
    css: 'carrinho',
    js: 'carrinho'
  })
})

// ---------- login ----------

// Login e cadastro não usam o rodapé (e o login também não usa o cabeçalho)
function paginaLogin(res, extra) {
  res.render('login', {
    titulo: 'Login - MR Soluções',
    css: 'login',
    semCabecalho: true,
    semRodape: true,
    ...extra
  })
}

app.get('/login', (req, res) => {
  if (req.session.usuario) return res.redirect('/')
  paginaLogin(res, { sucesso: req.query.ok ? 'Conta criada com sucesso! Faça login.' : null })
})

app.post('/login', (req, res, next) => {
  const corpo = req.body || {}
  const email = (corpo.email || '').trim().toLowerCase()
  const senha = corpo.senha || ''
  const erroLogin = () => paginaLogin(res, { erro: 'E-mail ou senha inválidos.', email })

  usuariosDB.buscarPorEmail(email, (err, usuario) => {
    if (err) return next(err)
    if (!usuario) return erroLogin() // mesma mensagem para e-mail ou senha errados

    bcrypt.compare(senha, usuario.senha_hash, (err, confere) => {
      if (err) return next(err)
      if (!confere) return erroLogin()

      // regenerate: cria um id de sessão novo ao logar (evita fixação de sessão)
      req.session.regenerate(err => {
        if (err) return next(err)
        const partes = String(usuario.nome || 'Usuário').trim().split(/\s+/)
        const emailDaConta = normalizarEmail(usuario.email || email)

        req.session.usuario = {
          id: usuario.id,
          nome: usuario.nome,
          // O e-mail fixo é administrador mesmo que o banco ainda marque tipo='cliente'.
          admin: emailDaConta === ADMIN_EMAIL || String(usuario.tipo || '').trim().toLowerCase() === 'admin',
          primeiroNome: partes[0],
          iniciais: (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase()
        }

        // Aguarda a gravação da sessão antes de redirecionar.
        req.session.save(err => {
          if (err) return next(err)
          res.redirect('/')
        })
      })
    })
  })
})

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})

// ---------- cadastro ----------

function paginaCadastro(res, extra) {
  res.render('cadastro', {
    titulo: 'Cadastro - MR Soluções',
    css: 'cadastro',
    semRodape: true,
    ...extra
  })
}

app.get('/cadastro', (req, res) => {
  if (req.session.usuario) return res.redirect('/')
  paginaCadastro(res, {})
})

app.post('/cadastro', (req, res, next) => {
  const apenasDigitos = texto => (texto || '').replace(/\D/g, '')
  const limpo = texto => (texto || '').trim()
  const corpo = req.body || {}

  const dados = {
    nome: limpo(corpo.nome),
    cpf: apenasDigitos(corpo.cpf),
    email: limpo(corpo.email).toLowerCase(),
    ddd: apenasDigitos(corpo.ddd),
    telefone: apenasDigitos(corpo.telefone),
    cep: apenasDigitos(corpo.cep),
    rua: limpo(corpo.rua),
    bairro: limpo(corpo.bairro),
    numero: limpo(corpo.numero),
    complemento: limpo(corpo.complemento)
  }
  const senha = corpo.senha || ''
  const confirmarSenha = corpo.confirmarSenha || ''

  // validação no servidor (o navegador pode ser burlado)
  let erro = null
  if (dados.nome.length < 3) erro = 'Informe o nome completo.'
  else if (dados.cpf.length !== 11) erro = 'O CPF deve ter 11 dígitos.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) erro = 'Informe um e-mail válido.'
  else if (dados.ddd && dados.ddd.length !== 2) erro = 'O DDD deve ter 2 dígitos.'
  else if (dados.telefone && (dados.telefone.length < 8 || dados.telefone.length > 9)) erro = 'O telefone deve ter 8 ou 9 dígitos.'
  else if (dados.cep && dados.cep.length !== 8) erro = 'O CEP deve ter 8 dígitos.'
  else if (senha.length < 6) erro = 'A senha deve ter pelo menos 6 caracteres.'
  else if (senha !== confirmarSenha) erro = 'As senhas não conferem.'

  // devolve o que a pessoa digitou (menos a senha) para não preencher tudo de novo
  if (erro) return paginaCadastro(res, { erro, valores: dados })

  bcrypt.hash(senha, 10, (err, senhaHash) => {
    if (err) return next(err)

    usuariosDB.criar({ ...dados, senhaHash }, err => {
      if (err && err.code === 'ER_DUP_ENTRY') { // UNIQUE de email ou cpf
        return paginaCadastro(res, { erro: 'E-mail ou CPF já cadastrado.', valores: dados })
      }
      if (err) return next(err)
      res.redirect('/login?ok=1')
    })
  })
})

// ---------- administração (só quem tem tipo 'admin' no banco) ----------

function soAdmin(req, res, next) {
  if (!req.session.usuario) return res.redirect('/login')
  if (!req.session.usuario.admin) {
    return res.status(403).render('403', { titulo: 'Acesso negado', css: 'erro', semRodape: true })
  }
  next()
}

// Cadastro de produto: as categorias do <select> vêm do banco
function paginaCadastroProduto(res, categorias, extra) {
  const valores = (extra && extra.valores) || {}
  res.render('cadastrar-produto', {
    titulo: 'Cadastrar Produto | MR Soluções',
    css: 'cadastraProd',
    js: 'cadastraProd',
    semRodape: true, // a página tem o próprio rodapé simples
    categorias: categorias.map(c => ({ ...c, selecionada: String(c.id) === String(valores.categoria) })),
    ...extra
  })
}

app.get('/cadastrar-produto', soAdmin, (req, res, next) => {
  produtosDB.listarCategorias((err, categorias) => {
    if (err) return next(err)
    const mensagem = req.session.mensagem // aviso guardado pelo POST (aparece uma vez só)
    delete req.session.mensagem
    paginaCadastroProduto(res, categorias, { mensagem })
  })
})

app.post('/cadastrar-produto', soAdmin, (req, res, next) => {
  const corpo = req.body || {}
  const nome = (corpo.nome || '').trim()
  const preco = (corpo.preco || '').trim().replace(',', '.')
  const quantidade = (corpo.quantidade || '').trim()
  const categoriaId = Number(corpo.categoria)
  const valores = { nome, preco: corpo.preco, quantidade: corpo.quantidade, categoria: corpo.categoria }

  produtosDB.listarCategorias((err, categorias) => {
    if (err) return next(err)

    // validação no servidor (o navegador pode ser burlado)
    let erro = null
    if (!nome) erro = 'Informe o nome do produto.'
    else if (nome.length > 100) erro = 'O nome pode ter no máximo 100 caracteres.'
    else if (!/^\d{1,8}(\.\d{1,2})?$/.test(preco) || Number(preco) <= 0) erro = 'Informe um preço válido, maior que zero (ex.: 19,90).'
    else if (!/^\d{1,9}$/.test(quantidade)) erro = 'A quantidade deve ser um número inteiro, 0 ou mais.'
    else if (!categorias.some(c => c.id === categoriaId)) erro = 'Selecione uma categoria válida.'

    if (erro) return paginaCadastroProduto(res, categorias, { erro, valores })

    produtosDB.criar({ nome, preco: Number(preco), quantidade: Number(quantidade), categoriaId }, err => {
      if (err) return next(err)
      req.session.mensagem = `Produto "${nome}" cadastrado com sucesso.`
      res.redirect('/cadastrar-produto') // redirect evita reenviar o formulário ao atualizar a página
    })
  })
})

app.get('/relatorios', soAdmin, (req, res, next) => {
  relatoriosDB.carregar((err, dados) => {
    if (err) return next(err)
    res.render('relatorios', {
      titulo: 'Relatórios - MR Soluções',
      css: 'relatorios',
      js: 'relatorios',
      semRodape: true, // a página tem o próprio rodapé simples
      ...dados
    })
  })
})

// ---------- editar dados da conta ----------

app.get('/editar-dados', (req, res, next) => {
  if (!req.session.usuario) return res.redirect('/login');

  usuariosDB.buscarPorId(req.session.usuario.id, (err, usuario) => {
    if (err) return next(err);

    res.render('editar-dados', {
      titulo: 'Editar Dados - MR Soluções',
      css: 'cadastro',
      usuarioDados: usuario,
      sucesso: req.query.sucesso
    });
  });
});

app.post('/editar-dados', (req, res, next) => {
  if (!req.session.usuario) return res.redirect('/login');

  const corpo = req.body;

  const dados = {
    nome: (corpo.nome || '').trim(),
    email: (corpo.email || '').trim().toLowerCase(),
    ddd: (corpo.ddd || '').replace(/\D/g, ''),
    telefone: (corpo.telefone || '').replace(/\D/g, ''),
    cep: (corpo.cep || '').replace(/\D/g, ''),
    rua: (corpo.rua || '').trim(),
    bairro: (corpo.bairro || '').trim(),
    numero: (corpo.numero || '').trim(),
    complemento: (corpo.complemento || '').trim()
  };

  if (!dados.nome || !dados.email) {
    return res.redirect('/editar-dados');
  }

  usuariosDB.atualizar(
    req.session.usuario.id,
    dados,
    (err) => {
      if (err) return next(err);

      req.session.usuario.nome = dados.nome;
      req.session.usuario.primeiroNome = dados.nome.split(/\s+/)[0];

      res.redirect('/editar-dados?sucesso=1');
    }
  );
});

// ---------- erros ----------

// 404: middleware DEPOIS de todas as rotas (Aula 4)
app.use((req, res) => {
  res.status(404).render('404', { titulo: 'Página não encontrada', css: 'erro', semRodape: true })
})

// 500: middleware de erro (4 parâmetros)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).render('500', { titulo: 'Erro interno', css: 'erro', semRodape: true })
})

// Só sobe o servidor depois de conectar ao MySQL (como na Aula 8)
const PORT = process.env.PORT || 3000
conn.getConnection((err, conexao) => {
  if (err) {
    console.log('Não foi possível conectar ao MySQL:', err.message)
    return
  }
  conexao.release()
  console.log('Conectou ao MySQL!')
  app.listen(PORT, () => {
    console.log(`App funcionando em http://localhost:${PORT}`)
  })
})
