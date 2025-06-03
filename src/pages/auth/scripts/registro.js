// Aguarda o DOM estar completamente carregado antes de executar o código
document.addEventListener('DOMContentLoaded', function() {

    // Seleção de elementos do DOM
    const steps = document.querySelectorAll(".step");
    const stepDots = document.querySelectorAll(".step-dot");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const submitBtn = document.getElementById("submitBtn");
    const form = document.getElementById("registerForm");
    const progressFill = document.querySelector(".progress-fill");
    const successMessage = document.getElementById("successMessage");

    let currentStep = 0; // Controla em qual etapa o usuário está

    //  Máscara para o campo de telefone
    document.getElementById('phone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
        value = value.replace(/(\d{2})(\d)/, '($1) $2'); // Adiciona parênteses no DDD
        value = value.replace(/(\d{5})(\d)/, '$1-$2');   // Adiciona traço no número
        e.target.value = value;
    });

    // Máscara para o CEP + preenchimento automático do endereço
    document.getElementById('zipCode').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove não numéricos
        value = value.replace(/(\d{5})(\d)/, '$1-$2'); // Formata como 99999-999
        e.target.value = value;
        
        if (value.length === 9) { 
            fetchAddressByCEP(value.replace('-', '')); // Busca endereço na API
        }
    });

    // Indicador visual da força da senha
    document.getElementById('password').addEventListener('input', function(e) {
        const password = e.target.value;
        const strengthFill = document.querySelector('.password-strength-fill');

        let strength = 0;
        if (password.length >= 6) strength++;                       // Tamanho mínimo
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++; // Letras maiúsculas e minúsculas
        if (/\d/.test(password)) strength++;                         // Números
        if (/[^a-zA-Z\d]/.test(password)) strength++;                // Caracteres especiais

        // Limpa classes anteriores
        strengthFill.className = 'password-strength-fill';

        // Adiciona a classe conforme o nível de força
        if (strength === 1) strengthFill.classList.add('strength-weak');
        else if (strength === 2) strengthFill.classList.add('strength-medium');
        else if (strength === 3) strengthFill.classList.add('strength-strong');
        else if (strength === 4) strengthFill.classList.add('strength-very-strong');
    });

    // 🔄 Validação em tempo real para confirmação de senha
    document.getElementById('confirmPassword').addEventListener('input', function(e) {
        const password = document.getElementById('password').value;
        const confirmPassword = e.target.value;
        const errorMsg = e.target.nextElementSibling;

        if (confirmPassword && password !== confirmPassword) {
            errorMsg.classList.add('show');
            e.target.style.borderColor = '#f44336'; 
        } else {
            errorMsg.classList.remove('show');
            e.target.style.borderColor = confirmPassword ? '#4CAF50' : '#e0e0e0';
        }
    });

    // Função que exibe o step atual e atualiza o progresso
    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle("active", i === index);
        });

        stepDots.forEach((dot, i) => {
            dot.classList.remove('active', 'completed');
            if (i < index) dot.classList.add('completed'); // Marcados como concluídos
            else if (i === index) dot.classList.add('active'); // Step atual
        });

        // Calcula e atualiza barra de progresso
        const progress = ((index + 1) / steps.length) * 100;
        progressFill.style.width = progress + '%';

        // Alterna visibilidade dos botões
        prevBtn.style.display = index === 0 ? "none" : "inline-block";
        nextBtn.style.display = index === steps.length - 1 ? "none" : "inline-block";
        submitBtn.style.display = index === steps.length - 1 ? "inline-block" : "none";
    }

    // Validação dos campos obrigatórios de cada etapa
    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const inputs = currentStepElement.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            const errorMsg = input.nextElementSibling;

            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    showError(input, errorMsg);
                    isValid = false;
                } else {
                    hideError(input, errorMsg);
                }
            } else if (input.type === 'password' && input.id === 'confirmPassword') {
                const password = document.getElementById('password').value;
                if (input.value !== password) {
                    showError(input, errorMsg);
                    isValid = false;
                } else {
                    hideError(input, errorMsg);
                }
            } else if (!input.value.trim()) { // Campo vazio
                showError(input, errorMsg);
                isValid = false;
            } else {
                hideError(input, errorMsg);
            }
        });

        return isValid;
    }

    // Exibe erro visual no input
    function showError(input, errorMsg) {
        input.style.borderColor = '#f44336'; // Vermelho
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.classList.add('show');
        }
    }

    // Remove erro visual no input
    function hideError(input, errorMsg) {
        input.style.borderColor = '#4CAF50'; // Verde
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.classList.remove('show');
        }
    }

    // Busca endereço na API ViaCEP com base no CEP digitado
    function fetchAddressByCEP(cep) {
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('publicPlace').value = data.logradouro || '';
                        document.getElementById('street').value = data.bairro || '';
                        document.getElementById('city').value = data.localidade || '';
                        document.getElementById('uf').value = data.uf || '';
                    }
                })
                .catch(error => console.log('Erro ao buscar CEP:', error));
        }
    }

    //  Botão "Próximo"
    nextBtn.addEventListener("click", () => {
        if (validateStep(currentStep)) {
            currentStep++;
            if (currentStep >= steps.length) currentStep = steps.length - 1;
            showStep(currentStep);
        }
    });

    // Botão "Anterior"
    prevBtn.addEventListener("click", () => {
        currentStep--;
        if (currentStep < 0) currentStep = 0;
        showStep(currentStep);
    });

    //  Envio do formulário
    form.addEventListener("submit", function(e) {
        e.preventDefault(); // Impede envio padrão do form

        if (!validateStep(currentStep)) {
            return; // Cancela se tiver erro
        }

        // Estado de carregamento
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        submitBtn.disabled = true;

        // Requisição ao backend
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const payload = {
            username: data.username,
            password: data.password,
            email: data.email,
            phone: data.phone,
            address: {
                publicPlace: data.publicPlace,
                street: data.street,
                number: data.number,
                complement: data.complement,
                city: data.city,
                uf: data.uf,
                zipCode: data.zipCode
            }
        };
        
        fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro no cadastro');
            }
            return response.json();
        })
        .then(data => {
            console.log('Cadastro realizado com sucesso:', data);
        
            form.style.display = 'none';
            successMessage.style.display = 'block';
        
            setTimeout(() => {
                form.reset();
                currentStep = 0;
                showStep(currentStep);
                form.style.display = 'block';
                successMessage.style.display = 'none';
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Finalizar Cadastro';
                submitBtn.disabled = false;
            }, 3000);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro no cadastro. Tente novamente.');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Finalizar Cadastro';
            submitBtn.disabled = false;
        });
});

    // Inicializa o formulário na primeira etapa
    showStep(currentStep);

}); // Fim do DOMContentLoaded
