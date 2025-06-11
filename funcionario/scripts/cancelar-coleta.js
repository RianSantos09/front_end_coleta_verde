// Espera o carregamento completo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
  
  // Seleciona o formulário com o ID "form-cancelamento"
  const form = document.getElementById("form-cancelamento");

  // Adiciona um ouvinte de evento para o envio do formulário
  form.addEventListener("submit", async (e) => {
    // Impede o comportamento padrão do envio do formulário (recarregar a página)
    e.preventDefault();

    // Obtém e remove espaços extras do valor do campo "motivo"
    const motivo = document.getElementById("motivo").value.trim();
    // Obtém o primeiro arquivo selecionado no input de imagem (se houver)
    const imagem = document.getElementById("imagem").files[0];

    // Verifica se o motivo foi preenchido
    if (!motivo) {
      alert("Informe o motivo do cancelamento.");// Alerta caso esteja vazio
      return;
    }

    // Cria um objeto FormData para enviar os dados como multipart/form-data
    const formData = new FormData();
    // Adiciona o motivo ao FormData
    formData.append("motivo", motivo);
    // Adiciona a imagem se existir
    if (imagem) formData.append("imagem", imagem);

    try {
      // Envia os dados para o endpoint "/api/cancelamentos" via POST
      const response = await fetch("/api/cancelamentos", {
        method: "POST",
        body: formData,
      });

      // Obtém a resposta do servidor em texto e exibe em um alerta
      const msg = await response.text();
      alert(msg);
    } catch (err) {
      // Em caso de erro, exibe mensagem de erro e imprime no console
      alert("Erro ao enviar cancelamento.");
      console.error(err);
    }
  });
});