document.getElementById("form-agendamento").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Faça login para agendar.");
    return;
  }

  const scheduledAt = document.getElementById("data").value;
  const wasteId = document.getElementById("tipo").value;
  const descricao = document.getElementById("descricao").value;
  const photoUrl = ""; // ainda não tratado upload real

  if (!scheduledAt || !wasteId) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        scheduledAt,
        optionalPhotoUrl: photoUrl,
        wasteId,
        description: descricao
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert("Agendamento criado com sucesso!");
      window.location.href = "/citizen/index.html";
    } else {
      alert(result.message || "Erro ao agendar.");
    }
  } catch (err) {
    alert("Erro ao conectar com o servidor.");
  }
});
