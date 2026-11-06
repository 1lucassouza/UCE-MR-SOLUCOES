const { empresa } = require('./site')

module.exports = {

  linkWhatsappServico:
    empresa.whatsapp + '?text=' + encodeURIComponent('Olá tudo bem? Gostaria de adquirir um de seus serviços!!'),

  categorias: [
    {
      titulo: 'Energia Solar',
      itens: [
        { imagem: '/img/fotos_tmp/painelSolar.jpg', alt: 'Paineis Solares', texto: 'Paineis Solares' },
        { imagem: '/img/fotos_tmp/painelSolar2.jpg', alt: 'Sistema Autosuficiente', texto: 'Sistema autosuficiente e renovável' },
        { imagem: '/img/fotos_tmp/painelSolar3.jpg', alt: 'Pouca Manutenção', texto: 'Pouca Manutenção' }
      ]
    },
    {
      titulo: 'Cerca Elétrica',
      id: 'cerca-eletrica',
      itens: [
        { imagem: '/img/seguranca - Copia.png', alt: 'Segurança', texto: 'Segurança' },
        { imagem: '/img/servico_de_qualidade - Copia.png', alt: 'Serviços de Qualidade', texto: 'Serviços de Qualidade' },
        { imagem: '/img/confiavel - Copia.png', alt: 'Confiável', texto: 'Confiável e com alta proteção' }
      ]
    },
    {
      titulo: 'Rede e PABX',
      id: 'redesPABX',
      itens: [
        { imagem: '/img/focados - Copia.png', alt: 'Focados em instalar a melhor estrutura', texto: 'Focados em instalar a melhor estrutura' },
        { imagem: '/img/organiza.png?v=2', alt: 'Organização e otimização', texto: 'Organização e otimização' },
        { imagem: '/img/melhores_produtos - Copia.png', alt: 'Com os melhores produtos para sua rede', texto: 'Com os melhores produtos para sua rede' }
      ]
    },
    {
      titulo: 'Alarmes',
      id: 'seguranca',
      itens: [
        { imagem: '/img/fotos_tmp/seguncaResidencial.jpg', alt: 'Proteção para sua casa', texto: 'Proteção para sua casa' },
        { imagem: '/img/fotos_tmp/segurancaresidencial2.jpg', alt: 'Preço acessível e com maior qualidade', texto: 'Preço acessível e com maior qualidade' },
        { imagem: '/img/fotos_tmp/brian-babb-XbwHrt87mQ0-unsplash.jpg', alt: 'Trazendo tranquilidade e mais confiança', texto: 'Trazendo tranquilidade e mais confiança', classe: 'shadow' }
      ]
    }
  ],

  // reverso: true -> imagem do outro lado (classe infCompl-servicos-reverse)
  vantagens: [
    {
      id: 'rota-energiaSolar',
      imagem: '/img/fotos_tmp/painelSolar.jpg',
      titulo: 'Vantagens de utilizar energia solar em sua casa',
      texto: 'Optar pela energia solar significa reduzir drasticamente sua conta de luz, ter autonomia energética e contribuir diretamente para a preservação do meio ambiente. Além disso, é um investimento inteligente, com retorno garantido, que valoriza seu imóvel e te protege contra os constantes aumentos das tarifas de energia. Produzir sua própria energia traz estabilidade financeira, sustentabilidade e segurança para sua família ou negócio.'
    },
    {
      id: 'rota-segurança',
      reverso: true,
      imagem: '/img/fotos_tmp/karl-bewick-RucAvdHRB2I-unsplash.jpg',
      titulo: 'Se procura maior segurança em sua casa, a cerca elétrica pode te ajudar',
      texto: 'Ter uma cerca elétrica instalada é um dos meios mais eficazes de proteger seu patrimônio. Ela funciona como uma barreira física e psicológica, inibindo tentativas de invasão. Além disso, é um sistema de baixo custo de manutenção, altamente eficiente e que pode ser integrado a outros sistemas de segurança, oferecendo proteção 24 horas por dia. Segurança não é luxo, é necessidade. Se tiverem interesse em terem essa maior segurança em sua casa, contate-nos!'
    },
    {
      id: 'rota-manuntenção',
      imagem: '/img/fotos_tmp/ehmitrich-Jt01DmHeiqM-unsplash.jpg',
      titulo: 'Manutenção preventiva para garantir a durabilidade dos seus equipamentos',
      texto: 'A manutenção preventiva garante que seus sistemas operem de forma contínua, eficiente e segura, evitando falhas inesperadas e prejuízos. Com ela, você aumenta a vida útil dos equipamentos, reduz custos com reparos emergenciais e melhora a performance dos seus serviços. É a melhor estratégia para quem valoriza economia, produtividade e tranquilidade no dia a dia.'
    }
  ]
}
