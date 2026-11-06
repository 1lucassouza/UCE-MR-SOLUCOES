
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#product-form')
  const mensagem = document.querySelector('#form-message')

  const limparMensagem = () => {
    mensagem.textContent = ''
    mensagem.classList.remove('is-error')
  }

  form.addEventListener('input', limparMensagem)
  form.addEventListener('change', limparMensagem)
})
