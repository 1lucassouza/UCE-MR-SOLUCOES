document.addEventListener('DOMContentLoaded', () => {

  // MENU DE PERFIL
  const btnPerfil = document.getElementById('btnPerfil');
  const menuPerfil = document.getElementById('menuPerfil');

  if (btnPerfil && menuPerfil) {

    btnPerfil.addEventListener('click', (e) => {
      e.stopPropagation();
      menuPerfil.classList.toggle('aberto');
    });

    document.addEventListener('click', () => {
      menuPerfil.classList.remove('aberto');
    });

    menuPerfil.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // PESQUISA
  const formBusca = document.getElementById('formBusca');
  const campoBusca = document.getElementById('campoBusca');

  if (formBusca && campoBusca) {

    formBusca.addEventListener('submit', (e) => {
      e.preventDefault();

      const termo = campoBusca.value.trim().toLowerCase();

      if (!termo) {
        campoBusca.focus();
        return;
      }

      // Serviços
      const servicos = [
        { nome: 'energia solar', url: '/servicos#rota-energiaSolar' },
        { nome: 'cerca elétrica', url: '/servicos#cerca-eletrica' },
        { nome: 'cerca eletrica', url: '/servicos#cerca-eletrica' },
        { nome: 'alarme', url: '/servicos#seguranca' },
        { nome: 'alarm', url: '/servicos#seguranca' },
        { nome: 'segurança', url: '/servicos#seguranca' },
        { nome: 'seguranca', url: '/servicos#seguranca' },
        { nome: 'pabx', url: '/servicos#redesPABX' },
        { nome: 'rede', url: '/servicos#redesPABX' }
      ];

      const encontrado = servicos.find(s => s.nome.includes(termo));

      if (encontrado) {
        window.location.href = encontrado.url;
        return;
      }

      // Produtos
      window.location.href = '/produtos?busca=' + encodeURIComponent(termo);
    });

  }

});