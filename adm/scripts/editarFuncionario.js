// editarFuncionario.js

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos HTML de busca
    const searchCpfInput = document.getElementById('searchCpf');
    const btnSearchEmployee = document.getElementById('btnSearchEmployee');

    // Referência ao formulário de edição (o próprio elemento)
    const editEmployeeForm = document.getElementById('editEmployeeForm');

    // Referências aos campos do formulário de edição (somente os necessários)
    const editNome = document.getElementById('nome'); // Corrigido para 'nome' do HTML
    const editEmail = document.getElementById('email'); // Corrigido para 'email' do HTML
    const editSenha = document.getElementById('senha'); // Corrigido para 'senha' do HTML
    const editMatricula = document.getElementById('matricula'); // Corrigido para 'matricula' do HTML
    const editCargo = document.getElementById('cargo'); // Corrigido para 'cargo' do HTML
    const editStatus = document.getElementById('status'); // Adicionado 'status'

    // Campo oculto para o ID do funcionário
    const funcionarioIdHidden = document.getElementById('funcionarioId'); // Adicionado o ID oculto

    // Estado para armazenar o ID do funcionário atualmente sendo editado
    let currentEmployeeId = null;

    // --- Função para preencher o formulário com dados de um funcionário ---
    function fillEmployeeForm(employee) {
        currentEmployeeId = employee.id; // Armazena o ID do funcionário
        funcionarioIdHidden.value = employee.id; // Preenche o campo oculto

        editNome.value = employee.nome || '';
        editEmail.value = employee.email || '';
        // editSenha.value = ''; // Não preenche a senha por segurança, usuário altera se quiser
        editMatricula.value = employee.matricula || '';
        editCargo.value = employee.cargo || '';
        editStatus.value = employee.status || 'ativo'; // Garante um valor padrão

        // Habilitar os campos do formulário após preenchimento
        editEmployeeForm.querySelectorAll('input, select, button[type="submit"], button[type="button"]').forEach(element => {
            // Excluímos os campos de busca especificamente aqui, caso eles estejam dentro do form
            if (element.id !== 'searchCpf' && element.id !== 'btnSearchEmployee') {
                element.disabled = false;
            }
        });
    }

    // --- Função para desabilitar e limpar o formulário de edição ---
    function disableAndClearForm() {
        currentEmployeeId = null; // Limpa o ID do funcionário atual
        funcionarioIdHidden.value = ''; // Limpa o campo oculto

        editEmployeeForm.reset(); // Limpa todos os campos do formulário

        // Desabilita todos os campos do formulário, exceto os de busca
        editEmployeeForm.querySelectorAll('input, select, button[type="submit"], button[type="button"]').forEach(element => {
            if (element.id !== 'searchCpf' && element.id !== 'btnSearchEmployee') {
                element.disabled = true;
            }
        });
    }

    // --- Simulação de busca de funcionário por CPF (para testar sem backend) ---
    // Em um cenário real, você faria uma requisição GET para /api/employees/{id}
    // ou buscaria por CPF se tivesse um endpoint específico para isso.
    async function fetchEmployeeByCpf(cpf) {
        // Exemplo de dados fictícios alinhados com os campos reais do seu modelo
        const mockEmployees = [
            {
                id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Exemplo de UUID
                nome: 'João Silva',
                email: 'joao.silva@example.com',
                // senha: 'senha_segura_joao', // Não incluímos aqui para não expor a senha no frontend
                matricula: 'EMP001',
                cargo: 'Coletor',
                status: 'ativo'
            },
            {
                id: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210', // Exemplo de UUID
                nome: 'Maria Oliveira',
                email: 'maria.oliveira@example.com',
                // senha: 'senha_segura_maria',
                matricula: 'EMP002',
                cargo: 'Motorista',
                status: 'ferias'
            }
        ];

        // Em um cenário real, você faria:
        // const response = await fetch(`/api/employees/by-cpf/${cpf}`); // Se houvesse um endpoint por CPF
        // if (!response.ok) throw new Error('Funcionário não encontrado');
        // return await response.json();

        // Por enquanto, simula a busca nos dados mock
        return mockEmployees.find(emp => emp.matricula === cpf); // Usando matrícula como simulação de busca
    }

    // --- Evento de clique no botão de Buscar Funcionário ---
    btnSearchEmployee.addEventListener('click', async () => {
        const searchIdentifier = searchCpfInput.value.trim(); // Pode ser CPF ou Matrícula

        if (!searchIdentifier) {
            alert('Por favor, digite a matrícula do funcionário para buscar.');
            return;
        }

        try {
            const foundEmployee = await fetchEmployeeByCpf(searchIdentifier); // Simula a busca
            if (foundEmployee) {
                fillEmployeeForm(foundEmployee);
                alert('Funcionário encontrado e formulário preenchido!');
            } else {
                alert('Funcionário não encontrado com a matrícula informada.');
                disableAndClearForm();
            }
        } catch (error) {
            console.error('Erro ao buscar funcionário:', error);
            alert('Erro ao buscar funcionário. Tente novamente.');
            disableAndClearForm();
        }
    });

    // --- Evento de submissão do formulário de edição ---
    editEmployeeForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        if (!currentEmployeeId) {
            alert('Nenhum funcionário selecionado para edição. Por favor, busque um funcionário primeiro.');
            return;
        }

        // Coleta apenas os dados necessários do formulário
        const updatedEmployeeData = {
            id: currentEmployeeId, // ID é crucial para a atualização no backend
            nome: editNome.value,
            email: editEmail.value,
            // A senha só é enviada se o campo foi preenchido
            senha: editSenha.value ? editSenha.value : undefined, 
            matricula: editMatricula.value,
            cargo: editCargo.value,
            status: editStatus.value // Adicionando o status
        };

        console.log('Dados do funcionário a serem atualizados:', updatedEmployeeData);

        // --- Lógica para enviar dados atualizados para o backend ---
        // Aqui você faria uma requisição PUT ou PATCH para a sua API:
        // fetch(`/api/employees/${currentEmployeeId}`, {
        //     method: 'PUT', // Ou 'PATCH', dependendo da sua API
        //     headers: {
        //         'Content-Type': 'application/json',
        //         // 'Authorization': 'Bearer SEU_TOKEN_AQUI' // Se sua API exige autenticação
        //     },
        //     body: JSON.stringify(updatedEmployeeData)
        // })
        // .then(response => {
        //     if (!response.ok) {
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }
        //     return response.json();
        // })
        // .then(data => {
        //     alert('Alterações salvas com sucesso!');
        //     console.log('Resposta do backend:', data);
        //     // Opcional: Redirecionar ou recarregar a página
        //     // window.location.href = '/adm/lista-funcionarios.html';
        // })
        // .catch(error => {
        //     console.error('Erro ao salvar alterações do funcionário:', error);
        //     alert('Erro ao salvar alterações do funcionário: ' + error.message);
        // });

        alert('Simulação: Alterações salvas com sucesso! (Verifique o console para os dados que seriam enviados)');
        // disableAndClearForm(); // Opcional: Limpar e desabilitar formulário após salvar
    });

    // --- Lógica para o Modal de Coletas Anteriores ---
    const coletasModal = document.getElementById('coletasModal'); // Corrigido o ID do modal
    const funcionarioNomeModal = document.getElementById('funcionarioNomeModal'); // Span para o nome no modal
    const coletasTableBody = document.getElementById('coletasTableBody'); // Tbody da tabela de coletas
    const noColetasMessage = document.getElementById('noColetasMessage'); // Mensagem de sem coletas

    // Listener para quando o modal de coletas é exibido
    coletasModal.addEventListener('show.bs.modal', async () => {
        if (!currentEmployeeId) {
            alert('Nenhum funcionário selecionado para ver o histórico de coletas.');
            // Oculta o modal manualmente se já estiver aparecendo
            const modalInstance = bootstrap.Modal.getInstance(coletasModal);
            if (modalInstance) modalInstance.hide();
            return;
        }

        // Atualiza o nome do funcionário no título do modal
        funcionarioNomeModal.textContent = editNome.value || 'Funcionário';

        // Limpa o conteúdo existente e mostra mensagem de carregamento
        coletasTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Carregando coletas...</td></tr>';
        noColetasMessage.classList.add('d-none'); // Oculta a mensagem de "sem coletas"

        try {
            // Simula a busca de histórico de coletas por ID do funcionário
            // Em um projeto real, você faria uma requisição à API, ex:
            // const response = await fetch(`/api/employees/${currentEmployeeId}/collections`);
            // if (!response.ok) throw new Error('Erro ao buscar histórico de coletas');
            // const historyData = await response.json();

            // Dados mock de coletas para simulação
            const mockCollections = [
                { id: 'c001', date: '2025-05-30', material: 'Plástico', weight: 50, status: 'Concluída' },
                { id: 'c002', date: '2025-05-28', material: 'Metal', weight: 120, status: 'Concluída' },
                { id: 'c003', date: '2025-05-25', material: 'Papel', weight: 80, status: 'Concluída' },
            ];
            // Filtra as coletas mock para simular que são do funcionário específico
            const historyData = mockCollections.filter(col => col.id); // Adapte essa lógica se tiver um mock mais complexo

            coletasTableBody.innerHTML = ''; // Limpa novamente após a "busca"

            if (historyData && historyData.length > 0) {
                historyData.forEach(item => {
                    const row = `
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.date}</td>
                            <td>${item.material}</td>
                            <td>${item.weight} kg</td>
                            <td>${item.status}</td>
                        </tr>
                    `;
                    coletasTableBody.insertAdjacentHTML('beforeend', row);
                });
            } else {
                noColetasMessage.classList.remove('d-none'); // Mostra a mensagem de "sem coletas"
                coletasTableBody.innerHTML = ''; // Garante que a tabela esteja vazia
            }
        } catch (error) {
            console.error('Erro ao carregar histórico de coletas:', error);
            coletasTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Erro ao carregar coletas.</td></tr>';
            noColetasMessage.classList.add('d-none');
        }
    });

    // Inicializa o formulário como desabilitado até que um funcionário seja buscado
    disableAndClearForm();
});