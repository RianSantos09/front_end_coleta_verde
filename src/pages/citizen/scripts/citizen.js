document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado para acessar essa página.");
    window.location.href = "../../../src/pages/auth/login.html";
    return;
  }

  try {
    const [citizenRes, appointmentsRes] = await Promise.all([
      fetch("http://localhost:8080/api/citizens", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      fetch("http://localhost:8080/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    ]);

    if (!citizenRes.ok || !appointmentsRes.ok) {
      throw new Error("Erro ao buscar dados do servidor");
    }

    const citizenData = await citizenRes.json();
    const appointments = await appointmentsRes.json();

    // Se houver mais de um cidadão, usar o primeiro (ajuste se necessário)
    const userInfo = Array.isArray(citizenData) ? citizenData[0] : citizenData;

    exibirPerfil(userInfo);
    exibirAgendamentos(appointments);

  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    alert("Erro ao carregar dados. Tente novamente.");
  }
});

function exibirPerfil(userInfo) {
  const perfilEl = document.getElementById("user-info");
  perfilEl.innerHTML = `
    <span class="material-symbols-outlined user-icon">account_circle</span>
    <div>
      <strong>${userInfo.nome ?? "Usuário"}</strong><br>
      ${userInfo.email ?? "Email não informado"}<br>
      ${userInfo.telefone ?? "Telefone não informado"}<br>
      ${userInfo.endereco ?? "Endereço não informado"}
    </div>
  `;
}

function exibirAgendamentos(agendamentos) {
  const tbody = document.getElementById("agenda-body");
  tbody.innerHTML = agendamentos.map(ag => `
    <tr>
      <td>${ag.id}</td>
      <td>${formatarData(ag.data)}</td>
      <td>${ag.tipoDeResiduo ?? "N/A"}</td>
      <td><span class="status ${ag.status}">${capitalize(ag.status)}</span></td>
      <td><button class="btn-acoes" onclick="editar(${ag.id})">&#9998;</button></td>
      <td><button class="btn-acoes" onclick="cancelar(${ag.id})">❌</button></td>
    </tr>
  `).join("");
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

function formatarData(data) {
  if (!data) return "";
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR");
}

function editar(id) {
  alert(`Editar agendamento ${id}`);
}

function cancelar(id) {
  alert(`Cancelar agendamento ${id}`);
}
