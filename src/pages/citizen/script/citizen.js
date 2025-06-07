document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado.");
    window.location.href = "/login.html";
    return;
  }

  // ⚠️ Você precisa implementar esse endpoint no backend
  fetch("http://localhost:8080/api/citizens/me", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("user-info").innerHTML = `
        <span class="material-symbols-outlined user-icon">account_circle</span>
        <div>
          <strong>${data.username}</strong><br>
          ${data.email}<br>
          ${data.phone}<br>
          ${data.address.street}, ${data.address.number} - ${data.address.city}
        </div>
      `;
    })
    .catch(() => alert("Erro ao carregar dados do cidadão."));

  fetch("http://localhost:8080/api/appointments", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(appointments => {
      const tbody = document.getElementById("agenda-body");
      tbody.innerHTML = appointments.map(ag => `
        <tr>
          <td>${ag.id}</td>
          <td>${formatDate(ag.scheduledAt)}</td>
          <td>${ag.wasteItem?.type || '-'}</td>
          <td><span class="status ${ag.status.toLowerCase()}">${translateStatus(ag.status)}</span></td>
          <td><button onclick="editar(${ag.id})">✏️</button></td>
          <td><button onclick="cancelar(${ag.id})">❌</button></td>
        </tr>
      `).join("");
    })
    .catch(() => alert("Erro ao carregar agendamentos."));
});

function formatDate(dateTime) {
  if (!dateTime) return "";
  const [date] = dateTime.split("T");
  return date.split("-").reverse().join("/");
}

function translateStatus(status) {
  const map = {
    SCHEDULED: "Agendado",
    CANCELED: "Cancelado",
    COMPLETED: "Concluído",
    NOT_COMPLETED: "Não Realizado"
  };
  return map[status] || status;
}