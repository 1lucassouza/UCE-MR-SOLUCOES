function sair() {
    const div = document.getElementById('fundo-sla');

    div.classList.remove('show'); 
}
function toggleSlaPopup() {
    const div = document.getElementById('fundo-sla');
    const nome = document.getElementById('nome').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !mensagem) {
        alert('Preencha o nome e a mensagem antes de prosseguir.');
        return; 
    }
    div.classList.toggle('show'); 
}

function enviarWhatsapp() {
    const mensagem = document.getElementById('mensagem').value.trim();
    const numero = '5519997779429';
    const nome = document.getElementById('nome').value.trim();


    document.getElementById('fundo-sla').classList.remove('show');
    
    const url = `https://wa.me/${numero}?text=${encodeURIComponent("Nome: " + nome + "\nMensagem: " + mensagem)}`;
    window.open(url, '_blank');
}

function enviarEmail() {
    let nome = document.getElementById("nome").value.trim();
    let email = document.getElementById("email").value.trim();
    let mensagem = document.getElementById("mensagem").value.trim();
    
    let destinatario = "lucassouzalucas161513@gmail.com";
    
    let assunto = encodeURIComponent("Mensagem de Contato - " + nome);
    let corpo = encodeURIComponent("Nome: " + nome + "\nEmail: " + email + "\n\nMensagem:\n" + mensagem);
    

    document.getElementById('fundo-sla').classList.remove('show'); 

    window.location.href = `mailto:${destinatario}?subject=${assunto}&body=${corpo}`;
}