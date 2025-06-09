// funcionario.js

document.addEventListener('DOMContentLoaded', () => {
    const employeeForm = document.getElementById('employeeForm');

    // Verifica se o formulário existe na página
    if (!employeeForm) {
        console.error('Elemento com ID "employeeForm" não encontrado. Verifique o HTML.');
        return;
    }

    employeeForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Cria um objeto para armazenar APENAS os dados necessários para o cadastro
        const employeeData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value,
            matricula: document.getElementById('matricula').value,
            cargo: document.getElementById('cargo').value,
            // O campo 'status' e 'id' geralmente são definidos no backend para novos cadastros.
            // O 'id' é gerado automaticamente, e o 'status' pode ter um valor padrão (ex: 'ativo').
        };

        // --- Ações com os dados coletados ---
        // 1. Exibir no console para depuração:
        console.log('Dados do novo funcionário para cadastro:', employeeData);

        // 2. Enviar para o servidor (Backend) usando Fetch API:
        fetch('http://localhost:8080/api/employees/employee', { // Seu endpoint POST para salvar funcionário
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer SEU_TOKEN_AQUI' // Se sua API exige autenticação
            },
            body: JSON.stringify(employeeData),
        })
        .then(response => {
            if (!response.ok) {
                // Se a resposta não for OK (status 2xx), tenta ler a mensagem de erro do backend
                return response.json().then(errorData => { 
                    throw new Error(errorData.message || 'Erro no servidor ao cadastrar.'); 
                });
            }
            return response.json(); // Se OK, retorna os dados do funcionário cadastrado
        })
        .then(data => {
            console.log('Funcionário cadastrado com sucesso:', data);
            alert('Funcionário cadastrado com sucesso!');
            employeeForm.reset(); // Limpa o formulário após o sucesso
        })
        .catch((error) => {
            console.error('Erro ao cadastrar funcionário:', error);
            alert('Erro ao cadastrar funcionário: ' + error.message);
        });
    });
});