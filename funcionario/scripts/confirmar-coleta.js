// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os botões com a classe "btn-confirmar"
  const botoesConfirmar = document.querySelectorAll(".btn-confirmar");

  // Para cada botão encontrado, adiciona um ouvinte de clique
  botoesConfirmar.forEach(botao => {
    botao.addEventListener("click", () => {
      // Obtém o valor do atributo data-id do botão (forma alternativa de acessar dataset)
      const id = botao.dataset.id;

      // Faz uma requisição PUT para confirmar a coleta com o ID especificado
      fetch(`/api/coletas/${id}/confirmar`, {
        method: "PUT" // Define o método HTTP como PUT
      })
        .then(response => {
          // Se a resposta não for bem-sucedida, lança um erro
          if (!response.ok) throw new Error("Erro ao confirmar");
          return response.text(); // Converte a resposta para texto (se necessário)
        })
        .then(() => {
          // Após confirmação, encontra a linha da tabela onde está o botão
          const linha = botao.closest("tr");

          // Atualiza o texto da célula com classe "status" para "Concluído"
          linha.querySelector(".status").textContent = "Concluído";

          // Desabilita o botão para evitar múltiplos cliques
          botao.disabled = true;
        })
        // Captura erros e exibe um alerta ao usuário
        .catch(error => alert("Falha ao confirmar: " + error));
    });
  });
});