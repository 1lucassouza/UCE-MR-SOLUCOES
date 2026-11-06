const conn = require('./conexao')



function buscarPorEmail(email, callback) {
  conn.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, linhas) => {
    if (err) return callback(err)
    callback(null, linhas[0])
  })
}

function criar(u, callback) {
  const sql = `
    INSERT INTO usuarios
      (nome, cpf, email, ddd, telefone, cep, rua, bairro, numero, complemento, senha_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const valores = [u.nome, u.cpf, u.email, u.ddd, u.telefone, u.cep, u.rua, u.bairro, u.numero, u.complemento, u.senhaHash]
  conn.query(sql, valores, (err, resultado) => {
    if (err) return callback(err)
    callback(null, resultado.insertId)
  })
}



function buscarPorId(id, callback) {
  conn.query(
    'SELECT id, nome, cpf, email, ddd, telefone, cep, rua, bairro, numero, complemento FROM usuarios WHERE id = ?',
    [id],
    (err, linhas) => {
      if (err) return callback(err);
      callback(null, linhas[0]);
    }
  );
}

function atualizar(id, dados, callback) {
  const sql = `
    UPDATE usuarios
    SET nome = ?, email = ?, ddd = ?, telefone = ?,
        cep = ?, rua = ?, bairro = ?, numero = ?, complemento = ?
    WHERE id = ?
  `;

  const valores = [
    dados.nome,
    dados.email,
    dados.ddd,
    dados.telefone,
    dados.cep,
    dados.rua,
    dados.bairro,
    dados.numero,
    dados.complemento,
    id
  ];

  conn.query(sql, valores, callback);
}

module.exports = {
  buscarPorEmail,
  criar,
  buscarPorId,
  atualizar
}