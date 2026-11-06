USE mr_solucoes;

SELECT id, nome, email, tipo FROM usuarios;
UPDATE usuarios SET tipo = 'admin' WHERE email = 'souadm@gmail.com';