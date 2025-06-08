// Variável global para armazenar os agendamentos
let agendamentosGlobais = [];

document.addEventListener("DOMContentLoaded", async () => { 
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado para acessar essa página.");
    window.location.href = "../../../src/pages/auth/login.html";
    return;
  }

  try {
    const citizenRes = await fetch("http://localhost:8080/api/citizens", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!citizenRes.ok) {
      throw new Error("Erro ao buscar dados do cidadão");
    }

    const citizenData = await citizenRes.json();

    // Se houver mais de um cidadão, usar o primeiro (ajuste se necessário)
    const userInfo = Array.isArray(citizenData) ? citizenData[0] : citizenData;

    exibirPerfil(userInfo);
    await carregarAgendamentos();

  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    alert("Erro ao carregar dados. Tente novamente.");
  }
});

// Exibe dados do usuário no perfil
function exibirPerfil(userInfo) {
  const perfilEl = document.getElementById("user-info");

  const telefone = userInfo.phone ?? "Telefone não informado";

  let endereco = "Endereço não informado";
  const addr = userInfo.address;

  if (addr && addr.publicPlace && addr.street && addr.number && addr.uf) {
    endereco = `${addr.publicPlace}, ${addr.street}, ${addr.number} - ${addr.uf}`;
  }

  perfilEl.innerHTML = `
    <span class="material-symbols-outlined user-icon">account_circle</span>
    <div>
      <strong>${userInfo.username ?? "Usuário"}</strong><br>
      ${userInfo.email ?? "Email não informado"}<br>
      ${telefone}<br>
      ${endereco}
    </div>
  `;
}

// Exibe a lista de agendamentos na tabela
function exibirAgendamentos(agendamentos) {
  const tbody = document.getElementById("agenda-body");

  tbody.innerHTML = agendamentos.map(ag => {
    const id = ag.id ?? ag.appointment?.id ?? "N/A";
    const tipoResiduo = ag.wasteItem?.type ?? "Tipo não informado";

    return `
      <tr>
        <td>${formatarData(ag.scheduled_at)}</td>
        <td>${tipoResiduo}</td>
        <td><span class="status ${ag.status.toLowerCase()}">${capitalize(ag.status)}</span></td>
        <td><button class="btn-acoes btn-editar" data-id="${id}">&#9998;</button></td>
        <td><button class="btn-acoes btn-cancelar" data-id="${id}">❌</button></td>
      </tr>
    `;
  }).join("");

  // Adiciona os listeners depois que o HTML está inserido
  document.querySelectorAll(".btn-cancelar").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const appointment = agendamentosGlobais.find(a => (a.id ?? a.appointment?.id) === id);
      if (appointment) {
        cancelarAgendamento(appointment);
      } else {
        alert("Agendamento não encontrado.");
      }
    });
  });

  document.querySelectorAll(".btn-editar").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      editar(id);
    });
  });
}

// Função auxiliar para capitalizar texto
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
}

// Formata a data para "dd/mm/aaaa"
function formatarData(data) {
  if (!data) return "";
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR");
}

// Recarrega os agendamentos da API
async function carregarAgendamentos() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:8080/api/appointments", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Erro ao buscar agendamentos");

    const appointments = await res.json();
    agendamentosGlobais = appointments; // salva globalmente
    exibirAgendamentos(appointments);

  } catch (error) {
    console.error("Erro ao recarregar agendamentos:", error);
  }
}

async function cancelarAgendamento(appointment) {
  const token = localStorage.getItem("token");

  // Monta o corpo da requisição incluindo o type do resíduo
  const requestBody = {
    scheduled_at: appointment.scheduled_at,
    optional_photo_url: appointment.optional_photo_url || null,
    waste: {
      id: appointment.wasteItem.id,
      type: appointment.wasteItem.type,
      description: appointment.wasteItem.description // << necessário
    },
    status: "CANCELED"
  };


  try {
    const response = await fetch(`http://localhost:8080/api/appointments/${appointment.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || "Erro ao cancelar agendamento.");
    }

    const data = await response.json();
    alert("Agendamento cancelado com sucesso!");

    await carregarAgendamentos();

  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    alert("Erro ao cancelar agendamento: " + error.message);
  }
}
