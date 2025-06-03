document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('authForm');
  const submitButton = document.getElementById('submitButton');
  const buttonText = document.getElementById('buttonText');
  const loadingSpinner = document.getElementById('loadingSpinner');

  form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!email || !password) {
          alert('Por favor, preencha todos os campos.');
          return;
      }

      buttonText.style.display = 'none';
      loadingSpinner.style.display = 'block';

      try {
          const response = await fetch('http://localhost:8080/api/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (response.ok) {
              alert('Login bem-sucedido!');
                /* TODO: add localStorage para token  */
                /* TODO: fazer a correção de redirecionamento */

              // Redireciona para o dashboard ou página principal
              window.location.href = 'dashboard.html';
          } else {
              alert(data.message || 'Email ou senha incorretos.');
          }
      } catch (error) {
          console.error('Erro durante o login:', error);
          alert('Ocorreu um erro na conexão. Verifique o backend e tente novamente.');
      } finally {
          buttonText.style.display = 'block';
          loadingSpinner.style.display = 'none';
      }
  });
});
