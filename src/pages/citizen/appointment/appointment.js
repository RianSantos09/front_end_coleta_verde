document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-agendamento");

  const wasteTypeMap = {
    "1": "ELECTRONIC",
    "2": "ORGANIC",
    "3": "RECYCLABLE",
    "4": "HAZARDOUS",
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Faça login para agendar.");
      window.location.href = "../../../src/pages/auth/login.html";
      return;
    }

    const scheduledAtRaw = document.getElementById("data").value;
    const wasteId = document.getElementById("tipo").value;
    let descricao = document.getElementById("descricao").value.trim();
    const photoUrl = ""; 

    if (!scheduledAtRaw || !wasteId) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const wasteType = wasteTypeMap[wasteId];
    if (!wasteType) {
      alert("Selecione um tipo válido de resíduo.");
      return;
    }

    // Se descrição estiver vazia, enviar texto padrão
    if (!descricao) {
      descricao = "Sem descrição";
    }

    const scheduledAt = scheduledAtRaw.length === 16 ? scheduledAtRaw + ":00" : scheduledAtRaw;

    try {
      const response = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scheduled_at: scheduledAt,
          optional_photo_url: photoUrl,
          waste: {
            type: wasteType,
            description: descricao,
          },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Agendamento criado com sucesso!");
        window.location.href = "../citizen.html";
      } else {
        alert(result.message || JSON.stringify(result) || "Erro ao agendar.");
        console.warn("Erro:", result);
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Erro de conexão. Tente novamente mais tarde.");
    }
  });
});
