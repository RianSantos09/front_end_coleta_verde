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
    const nomeRequester = ag.requester_name || "N/A";
    const tipoResiduo = ag.waste_type || ag.waste?.type || "N/A";

    return `
      <tr>
        <td>${id}</td>
        <td>${formatarData(ag.scheduled_at)}</td>
        <td>${tipoResiduo}</td>
        <td><span class="status ${ag.status.toLowerCase()}">${capitalize(ag.status)}</span></td>
        <td><button class="btn-acoes" onclick="editar('${id}')">&#9998;</button></td>
        <td><button class="btn-acoes" onclick="cancelar('${id}')">❌</button></td>
      </tr>
    `;
  }).join("");
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
    exibirAgendamentos(appointments);

  } catch (error) {
    console.error("Erro ao recarregar agendamentos:", error);
  }
}

function editar(id) {
  console.log("Editar ID:", id);
  if (!id || typeof id !== "string" || id.length < 10) {
    return alert("ID inválido para editar.");
  }

  // Aqui você poderia redirecionar para uma tela de edição:
  window.location.href = `appointment/edit.html?id=${id}`;
}

function cancelar(id) {
  console.log("Cancelar ID:", id);
  if (!id || typeof id !== "string" || id.length < 10) {
    return alert("ID inválido para cancelar.");
  }

  const token = localStorage.getItem("token");
  if (!token) return alert("Usuário não autenticado.");

  if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;

  fetch(`http://localhost:8080/api/appointments/${id}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (!response.ok) throw new Error("Erro ao cancelar agendamento.");
      alert("Agendamento cancelado com sucesso!");
      location.reload();
    })
    .catch(error => {
      console.error("Erro:", error);
      alert("Erro ao cancelar o agendamento.");
    });
}
