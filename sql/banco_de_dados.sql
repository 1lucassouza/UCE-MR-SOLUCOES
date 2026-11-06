CREATE DATABASE IF NOT EXISTS mr_solucoes
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mr_solucoes;

DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS servicos;
DROP TABLE IF EXISTS usuarios;


CREATE TABLE categorias (
  id      INT          NOT NULL AUTO_INCREMENT,
  titulo  VARCHAR(100) NOT NULL,
  ancora  VARCHAR(50)  NULL,
  ordem   INT          NOT NULL DEFAULT 0,
  cor     VARCHAR(20)  NOT NULL DEFAULT 'gray',
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE produtos (
  id            INT           NOT NULL AUTO_INCREMENT,
  categoria_id  INT           NOT NULL,
  nome          VARCHAR(100)  NOT NULL,
  preco         DECIMAL(10,2) NOT NULL,
  quantidade    INT           NOT NULL DEFAULT 0,
  imagem        VARCHAR(255)  NOT NULL,
  descricao     VARCHAR(255)  NULL,
  ativo         TINYINT       NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  CONSTRAINT fk_produtos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias (id)
) ENGINE=InnoDB;


CREATE TABLE servicos (
  id         INT           NOT NULL AUTO_INCREMENT,
  nome       VARCHAR(100)  NOT NULL,
  preco      DECIMAL(10,2) NOT NULL,
  descricao  VARCHAR(255)  NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;


CREATE TABLE usuarios (
  id          INT                    NOT NULL AUTO_INCREMENT,
  nome        VARCHAR(120)           NOT NULL,
  cpf         CHAR(11)               NOT NULL,
  email       VARCHAR(150)           NOT NULL,
  ddd         CHAR(2)                NULL,
  telefone    VARCHAR(9)             NULL,
  cep         CHAR(8)                NULL,
  rua         VARCHAR(150)           NULL,
  bairro      VARCHAR(100)           NULL,
  numero      VARCHAR(10)            NULL,
  complemento VARCHAR(100)           NULL,
  senha_hash  VARCHAR(255)           NOT NULL,
  tipo        ENUM('cliente','admin') NOT NULL DEFAULT 'cliente',
  criado_em   TIMESTAMP              NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email),
  UNIQUE KEY uq_usuarios_cpf (cpf)
) ENGINE=InnoDB;

INSERT INTO categorias (id, titulo, ancora, ordem, cor) VALUES
  (1, 'Tomadas', NULL, 1, 'blue'),
  (2, 'Painéis de LED', 'paineis', 2, 'green'),
  (3, 'Lâmpadas', NULL, 3, 'orange'),
  (4, 'Controles', NULL, 4, 'purple'),
  (5, 'Outros', NULL, 5, 'gray');

INSERT INTO produtos (id, categoria_id, nome, preco, quantidade, imagem, descricao) VALUES
  (1, 1, 'Tomada Emborrachada', 11.00, 10, '/img/tom3.png', 'Tomada com acabamento emborrachado'),
  (2, 1, 'Tomada Embutir', 18.90, 25, '/img/tomada_nova1.jpeg', 'Tomada embutida de alta resistência'),
  (3, 1, 'Tomada Tripla', 27.90, 20, '/img/tomada_nova3.jpeg', 'Tomada tripla com suporte para múltiplos plugs'),
  (4, 2, 'Painel LED Slim', 79.90, 8, '/img/painel3.png', 'Painel LED slim para embutir no teto'),
  (5, 2, 'Painel LED Sobrepor', 96.90, 30, '/img/painel_novo2.jpeg', 'Painel LED tipo sobrepor para superfícies lisas'),
  (6, 2, 'Painel LED Quadrado', 111.90, 15, '/img/painel_novo1.jpeg', 'Painel LED quadrado com alto brilho'),
  (7, 3, 'Lâmpada LED 9W', 11.00, 18, '/img/lamp1.png', 'Lâmpada LED 9W para uso residencial'),
  (8, 3, 'Lâmpada LED 12W', 18.90, 12, '/img/lamp2.png', 'Lâmpada LED 12W econômica'),
  (9, 3, 'Lâmpada Tubular', 46.00, 12, '/img/lamp3.png', 'Lâmpada tubular LED para iluminação linear'),
  (10, 4, 'Controle PABX', 49.90, 12, '/img/contr1.png', 'Controle PABX para sistemas de telefonia'),
  (11, 4, 'Controle Touch', 89.90, 12, '/img/contr2.png', 'Controle touch moderno para automação'),
  (12, 4, 'Controle Tok', 72.90, 12, '/img/contr3.png', 'Controle Tok para aplicações diversas');

INSERT INTO servicos (id, nome, preco, descricao) VALUES
  (1, 'Painel Solar', 3500.00, 'Instalação de Painéis Solares.'),
  (2, 'Cerca Elétrica', 580.00, 'Instalação de Cerca Elétrica.'),
  (3, 'Rede e PABX', 920.00, 'Instalação e configuração de redes e sistemas PABX.'),
  (4, 'Alarmes', 200.00, 'Instalação e configuração de sistemas de alarme.');



SELECT c.titulo, p.nome, p.preco, p.quantidade FROM produtos p JOIN categorias c ON c.id = p.categoria_id;
