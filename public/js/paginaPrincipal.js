document.addEventListener('DOMContentLoaded', () => {

  const modal = document.getElementById('modalAvaliacao');
  const abrir = document.getElementById('abrirAvaliacao');
  const fechar = document.getElementById('fecharAvaliacao');
  const form = document.getElementById('formAvaliacao');
  const mensagem = document.getElementById('mensagemAvaliacao');

  if (!modal || !abrir || !fechar || !form) return;

  abrir.addEventListener('click', () => {
    modal.classList.add('ativo');
  });

  fechar.addEventListener('click', () => {
    modal.classList.remove('ativo');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('ativo');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeAvaliacao').value.trim();
    const comentario = document.getElementById('comentarioAvaliacao').value.trim();
    const nota = document.querySelector('input[name="nota"]:checked');

    if (!nota) {
      mensagem.textContent = 'Selecione uma quantidade de estrelas!';
      return;
    }

    const avaliacao = {
      nome: nome || 'Cliente',
      comentario,
      nota: Number(nota.value),
      data: new Date().toLocaleDateString('pt-BR')
    };

    const avaliacoes = JSON.parse(
      localStorage.getItem('avaliacoesMR') || '[]'
    );

    avaliacoes.push(avaliacao);

    localStorage.setItem(
      'avaliacoesMR',
      JSON.stringify(avaliacoes)
    );

    mensagem.textContent = 'Obrigado! Sua avaliação foi registrada.';

    form.reset();

    setTimeout(() => {
      modal.classList.remove('ativo');
      mensagem.textContent = '';
    }, 2000);
  });

});