form.addEventListener("submit", function (event) {
  event.preventDefault();

  const appointmentId = document.getElementById("appointmentId").value;
  const motivo = document.getElementById("motivo").value;
  const imagem = document.getElementById("imagem").files[0];

  const formData = new FormData();
  formData.append("observacoes", motivo);
  if (imagem) {
    formData.append("imagem", imagem);
  }

  fetch(`/api/coletas/${appointmentId}/cancelar`, {
    method: "PUT",
    body: formData
  })
  .then(response => {
    if (!response.ok) throw new Error("Erro ao cancelar a coleta.");
    return response.json();
  })
  .then(data => {
    alert("Coleta cancelada com sucesso!");
    window.location.href = "index.html";
  })
  .catch(error => {
    console.error(error);
    alert("Erro ao cancelar a coleta.");
  });
});
