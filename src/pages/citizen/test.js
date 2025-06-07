document.addEventListener("DOMContentLoaded", () => {
  const userInfo = {
    nome: "Maria Silva",
    email: "maria.silva@email.com",
    telefone: "(11) 98765-4321",
    endereco: "Rua das Flores, 123 - São Paulo, SP"
  };

  const agendamentos = [
    { id: 1, data: "15/05/2025", tipo: "Eletrônicos", status: "concluido" },
    { id: 2, data: "22/05/2025", tipo: "Recicláveis", status: "pendente" },
    { id: 3, data: "30/05/2025", tipo: "Óleo de cozinha", status: "pendente" },
    { id: 4, data: "10/04/2025", tipo: "Pilhas e baterias", status: "cancelado" },
    { id: 5, data: "05/03/2025", tipo: "Eletrônicos", status: "concluido" },
  ];

  const perfilEl = document.getElementById("user-info");
  perfilEl.innerHTML = `
    <span class="material-symbols-outlined user-icon">account_circle</span>
    <div>
      <strong>${userInfo.nome}</strong><br>
      ${userInfo.email}<br>
      ${userInfo.telefone}<br>
      ${userInfo.endereco}
    </div>
  `;

  const tbody = document.getElementById("agenda-body");
  tbody.innerHTML = agendamentos.map(ag => `
    <tr>
      <td>${ag.id}</td>
      <td>${ag.data}</td>
      <td>${ag.tipo}</td>
      <td><span class="status ${ag.status}">${capitalize(ag.status)}</span></td>
      <td><button class="btn-acoes" onclick="editar(${ag.id})">&#9998;</button></td>
      <td><button class="btn-acoes" onclick="cancelar(${ag.id})">❌</button></td>
    </tr>
  `).join("");
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function editar(id) {
  alert(`Editar agendamento ${id}`);
}

function cancelar(id) {
  alert(`Cancelar agendamento ${id}`);
}
