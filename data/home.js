module.exports = {
  atalhos: [
    { href: '/contato', imagem: '/img/race-support-svgrepo-com.svg', texto: 'Contato' },
    { href: '/servicos', imagem: '/img/customer-support (1) 1.png', texto: 'Serviços' },
    { href: '/produtos', imagem: '/img/features 1.png', texto: 'Produtos' }
  ],

  paraCasa: [
    { imagem: '/img/tom3.png', nome: 'Tomada Emborrachada' },
    { imagem: '/img/tomada_nova1.jpeg', nome: 'Tomada Tripla' },
    { imagem: '/img/lamp3.png', nome: 'Lâmpada Tubular' }
  ],

  // invertido: true -> texto à esquerda e imagem à direita
  servicosDestaque: [
    {
      titulo: 'Energia Solar',
      assunto: 'energia solar',
      imagem: '/img/fotos_tmp/instalacao_painelSolar.jpg'
    },
    {
      titulo: 'Cerca Elétrica',
      assunto: 'cerca elétrica',
      imagem: '/img/fotos_tmp/instalacao_cercaEletrica.jpg',
      invertido: true
    }
  ],

  videos: [
    {
      url: 'https://www.youtube.com/embed/d6pzsim_KI0',
      titulo: 'Como Instalar Spot Led no Teto de Gesso',
      legenda: 'Instalação de Spots no Gesso'
    },
    {
      url: 'https://www.youtube.com/embed/eFLY-hamnV0',
      titulo: 'Segurança em Instalações Elétricas - PET Elétrica UFJF',
      legenda: 'Segurança em Instalações Elétricas'
    }
  ],

  duvidas: [
    {
      href: '/servicos#seguranca',
      titulo: 'Leia mais sobre sistema de segurança residencial',
      texto: 'Como escolher o melhor sistema de segurança residencial'
    },
    {
      href: '/servicos#rota-energiaSolar',
      titulo: 'Leia mais sobre energia solar em 2025',
      texto: 'Vantagens da energia solar em 2025'
    },
    {
      href: '/servicos#redesPABX',
      titulo: 'Leia mais sobre manutenção preventiva em redes PABX',
      texto: 'Manutenção preventiva em redes PABX'
    }
  ],

  // id é usado para montar os ids do carrossel (slider1-slide1, slider2-slide1...)
  depoimentos: [
    { id: 1, nome: 'João Pedro', video: '/videos/cliente1.mp4',
      texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit tempore aliquam ad officiis vero.' },
    { id: 2, nome: 'Lucas', video: '/videos/cliente1.mp4',
      texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit tempore aliquam ad officiis vero.' },
    { id: 3, nome: 'Pedro', video: '/videos/cliente1.mp4',
      texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit tempore aliquam ad officiis vero.' }
  ]
}
