const conn = require('./conexao')

const LINHAS_INICIAIS = 8 

const formatarPreco = valor => 'R$ ' + Number(valor).toFixed(2).replace('.', ',') 


function formatarTelefone(ddd, telefone) {
  if (!telefone) return '-'
  const numero = telefone.slice(0, -4) + '-' + telefone.slice(-4)
  return ddd ? `(${ddd}) ${numero}` : numero
}


const marcarOcultas = lista => lista.map((item, i) => ({ ...item, oculto: i >= LINHAS_INICIAIS }))


function carregar(callback) {
  const sqlProdutos = `
    SELECT p.id, p.nome, p.preco, p.quantidade, c.titulo AS categoria, c.cor
    FROM produtos p
    JOIN categorias c ON c.id = p.categoria_id
    ORDER BY p.id`

  conn.query(sqlProdutos, (err, produtos) => {
    if (err) return callback(err)

    conn.query('SELECT id, nome, preco, descricao FROM servicos ORDER BY id', (err, servicos) => {
      if (err) return callback(err)


      const sqlClientes = `
        SELECT id, nome, email, ddd, telefone
        FROM usuarios
        WHERE tipo = 'cliente'
        ORDER BY id`

      conn.query(sqlClientes, (err, clientes) => {
        if (err) return callback(err)

        callback(null, {
          produtos: marcarOcultas(produtos.map(p => ({ ...p, precoTexto: formatarPreco(p.preco) }))),
          servicos: marcarOcultas(servicos.map(s => ({ ...s, precoTexto: formatarPreco(s.preco) }))),
          clientes: marcarOcultas(clientes.map(c => ({ ...c, telefoneTexto: formatarTelefone(c.ddd, c.telefone) })))
        })
      })
    })
  })
}

module.exports = { carregar }
