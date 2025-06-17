// funcionario.js

document.addEventListener('DOMContentLoaded', () => {
    const employeeForm = document.getElementById('employeeForm');
    // NOVAS LINHAS: Seleciona o botão do olho e o campo da senha
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('senha');

    // NOVO BLOCO DE CÓDIGO: Lógica para alternar a visibilidade da senha
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            togglePassword.querySelector('i').classList.toggle('fa-eye');
            togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    if (employeeForm) {
        employeeForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            // LINHA ALTERADA: Pega o valor do campo de senha usando passwordInput
            const senha = passwordInput.value;
            const matricula = document.getElementById('matricula').value;
            const cargo = document.getElementById('cargo').value;

            const employeeData = {
                name: nome,
                email: email,
                password: senha,
                registration: matricula,
                role: cargo
            };

            console.log('Dados do funcionário para envio:', employeeData);

            try {
                const response = await fetch('http://localhost:5000/api/employees/employee', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(employeeData)
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Funcionário cadastrado com sucesso!');
                    console.log('Resposta da API:', result);
                    employeeForm.reset();
                } else {
                    const errorData = await response.json();
                    alert(`Erro ao cadastrar funcionário: ${errorData.message || response.statusText}`);
                    console.error('Erro na resposta da API:', errorData);
                }
            } catch (error) {
                console.error('Erro ao enviar requisição:', error);
                alert('Ocorreu um erro ao tentar se conectar com o servidor.');
            }
        });
    } else {
        console.error("Formulário com ID 'employeeForm' não encontrado.");
    }
});