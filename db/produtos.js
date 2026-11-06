const conn = require('./conexao')

const formatarPreco = valor => 'R$' + valor.toFixed(2).replace('.', ',')


function listarPorCategoria(callback) {
  const sql = `
    SELECT c.id AS categoria_id, c.titulo, c.ancora,
           p.id, p.nome, p.preco, p.imagem, p.descricao
    FROM categorias c
    JOIN produtos p ON p.categoria_id = c.id
    WHERE p.ativo = 1
    ORDER BY c.ordem, c.id, p.id`

  conn.query(sql, (err, linhas) => {
    if (err) return callback(err)

    const categorias = []
    linhas.forEach(l => {
      let categoria = categorias.find(c => c.id === l.categoria_id)
      if (!categoria) {
        categoria = { id: l.categoria_id, titulo: l.titulo, ancora: l.ancora, produtos: [] }
        categorias.push(categoria)
      }
      const preco = Number(l.preco) 
      categoria.produtos.push({
        id: l.id,
        nome: l.nome,
        imagem: l.imagem,
        descricao: l.descricao,
        precoValor: preco.toFixed(2),
        precoTexto: formatarPreco(preco)
      })
    })
    callback(null, categorias)
  })
}


function listarCategorias(callback) {
  conn.query('SELECT id, titulo FROM categorias ORDER BY ordem, id', (err, linhas) => {
    if (err) return callback(err)
    callback(null, linhas)
  })
}


const IMAGEM_PADRAO = '/img/sem-imagem.svg'

function criar(produto, callback) {
  const sql = `
    INSERT INTO produtos (categoria_id, nome, preco, quantidade, imagem)
    VALUES (?, ?, ?, ?, ?)`
  const valores = [produto.categoriaId, produto.nome, produto.preco, produto.quantidade, IMAGEM_PADRAO]
  conn.query(sql, valores, (err, resultado) => {
    if (err) return callback(err)
    callback(null, resultado.insertId)
  })
}

module.exports = { listarPorCategoria, listarCategorias, criar }
