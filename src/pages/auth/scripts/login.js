document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('authForm');
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.getElementById('buttonText');
    const loadingSpinner = document.getElementById('loadingSpinner');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
  
      if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
  
      toggleLoadingState(true);
  
      try {
        const response = await fetch('http://localhost:8080/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          alert(data.message || 'Email ou senha incorretos.');
          return;
        }
  
        // Armazena credenciais no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
  
        // Redirecionamento com base no papel
        redirectUserByRole(data.role);
      } catch (error) {
        console.error('Erro durante o login:', error);
        alert('Erro de conexão. Verifique o servidor e tente novamente.');
      } finally {
        toggleLoadingState(false);
      }
    });
  
    function toggleLoadingState(isLoading) {
      buttonText.style.display = isLoading ? 'none' : 'inline';
      loadingSpinner.style.display = isLoading ? 'inline-block' : 'none';
      submitButton.disabled = isLoading;
    }
  
    function redirectUserByRole(role) {
      const routes = {
        CITIZEN: '../citizen/citizen.html',
        EMPLOYEE: '../../../../funcionario.html',
        ADMIN: '../../../adm/adm.html',
      };
  
      const target = routes[role];
      if (!target) {
        alert('Tipo de usuário desconhecido.');
        return;
      }
  
      window.location.href = target;
    }
  });
  