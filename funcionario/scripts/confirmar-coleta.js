document.addEventListener("DOMContentLoaded", () => {
  const corpoTabela = document.getElementById("corpo-tabela");

  corpoTabela.addEventListener("click", (event) => {
    const botao = event.target.closest(".btn-confirmar");
    if (!botao) return;

    const id = botao.dataset.id;
    if (!id) {
      alert("ID da coleta não encontrado.");
      return;
    }

    // Simulação da requisição para backend
    setTimeout(() => {
      const linha = botao.closest("tr");
      const statusTd = linha.querySelector(".status-coleta");
      statusTd.textContent = "Concluído";
      botao.disabled = true;
      alert(`Coleta confirmada!`);
    }, 500);
  });
});