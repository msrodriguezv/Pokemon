import { loginUser, isAuthenticated } from '../api/api.js';

export class LoginView {
  constructor() {
    this.container = null;
  }

  /**
   * Renderizar la vista de login
   * @returns {string} HTML del login
   */
  render() {
    return `
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" 
                 alt="Pikachu" 
                 class="login-logo">
            <h1>PokéFav</h1>
            <p>Inicia sesión para guardar tus pokémon favoritos</p>
          </div>

          <form id="loginForm" class="login-form">
            <div class="form-group">
              <label for="email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Email
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="ash@pokemon.com"
                required
                autocomplete="email"
              >
            </div>

            <div class="form-group">
              <label for="password">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Contraseña
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="••••••••"
                required
                autocomplete="current-password"
              >
            </div>

            <div class="form-group-checkbox">
              <input type="checkbox" id="remember" name="remember">
              <label for="remember">Recordarme</label>
            </div>

            <button type="submit" class="btn-primary" id="loginButton">
              <span class="btn-text">Iniciar Sesión</span>
              <span class="btn-loader" style="display: none;">
                <svg class="spinner" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                </svg>
              </span>
            </button>

            <div class="error-message" id="errorMessage" style="display: none;"></div>
          </form>

          <div class="login-footer">
            <p>Usuarios de prueba:</p>
            <div class="test-users">
              <button class="test-user-btn" data-email="ash@pokemon.com" data-password="pikachu123">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="Ash">
                <span>Ash</span>
              </button>
              <button class="test-user-btn" data-email="misty@pokemon.com" data-password="starmie456">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png" alt="Misty">
                <span>Misty</span>
              </button>
              <button class="test-user-btn" data-email="brock@pokemon.com" data-password="onix789">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png" alt="Brock">
                <span>Brock</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .login-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 450px;
          width: 100%;
          padding: 40px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .login-logo {
          width: 100px;
          height: 100px;
          margin-bottom: 10px;
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .login-header h1 {
          font-size: 32px;
          color: #333;
          margin: 10px 0;
          font-weight: 700;
        }

        .login-header p {
          color: #666;
          font-size: 14px;
        }

        .login-form {
          margin-top: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .form-group label svg {
          color: #667eea;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .form-group-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .form-group-checkbox label {
          font-size: 14px;
          color: #666;
          cursor: pointer;
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          animation: rotate 1s linear infinite;
          width: 20px;
          height: 20px;
        }

        .spinner circle {
          stroke: white;
          stroke-linecap: round;
          animation: dash 1.5s ease-in-out infinite;
        }

        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }

        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          margin-top: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .error-message::before {
          content: "⚠️";
        }

        .login-footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .login-footer p {
          text-align: center;
          color: #666;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .test-users {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .test-user-btn {
          background: #f5f5f5;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .test-user-btn:hover {
          border-color: #667eea;
          background: #f0f0ff;
          transform: translateY(-2px);
        }

        .test-user-btn img {
          width: 40px;
          height: 40px;
        }

        .test-user-btn span {
          font-size: 12px;
          color: #333;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
          }

          .login-header h1 {
            font-size: 24px;
          }

          .test-users {
            flex-direction: column;
          }
        }
      </style>
    `;
  }

  /**
   * Inicializar eventos después de renderizar
   */
  afterRender() {
    // Verificar si ya está autenticado (prevenir bucle)
    const isAuth = isAuthenticated();
    if (isAuth) {
      // Usar replace para evitar agregar al historial
      window.location.replace('/home');
      return;
    }

    this.attachEventListeners();
  }

  /**
   * Adjuntar event listeners
   */
  attachEventListeners() {
    const form = document.getElementById('loginForm');
    const testUserButtons = document.querySelectorAll('.test-user-btn');

    // Manejar submit del formulario
    if (form) {
      form.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Manejar click en usuarios de prueba
    testUserButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleTestUserLogin(e));
    });
  }

  /**
   * Manejar el login
   * @param {Event} event - Evento del formulario
   */
  async handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');

    // Validación básica
    if (!email || !password) {
      this.showError('Por favor completa todos los campos');
      return;
    }

    // Mostrar loading
    this.setLoading(true);
    this.hideError();

    try {
      // Intentar login
      const user = await loginUser(email, password);
      
      console.log('Login exitoso:', user);

      // Mostrar mensaje de éxito
      this.showSuccess(`¡Bienvenido, ${user.name}!`);

      // Redirigir después de 1 segundo usando replace
      setTimeout(() => {
        window.location.replace('/home');
      }, 1000);

    } catch (error) {
      console.error('Error en login:', error);
      this.showError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      this.setLoading(false);
    }
  }

  /**
   * Manejar login con usuario de prueba
   * @param {Event} event - Evento del botón
   */
  async handleTestUserLogin(event) {
    const button = event.currentTarget;
    const email = button.dataset.email;
    const password = button.dataset.password;

    // Llenar el formulario
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;

    // Efecto visual
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 200);

    // Enviar el formulario automáticamente
    setTimeout(() => {
      document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }, 300);
  }

  /**
   * Mostrar estado de carga
   * @param {boolean} loading - Estado de carga
   */
  setLoading(loading) {
    const button = document.getElementById('loginButton');
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');

    if (loading) {
      button.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'block';
    } else {
      button.disabled = false;
      btnText.style.display = 'block';
      btnLoader.style.display = 'none';
    }
  }

  /**
   * Mostrar mensaje de error
   * @param {string} message - Mensaje de error
   */
  showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'flex';
    }
  }

  /**
   * Ocultar mensaje de error
   */
  hideError() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
      errorMessage.style.display = 'none';
    }
  }

  /**
   * Mostrar mensaje de éxito
   * @param {string} message - Mensaje de éxito
   */
  showSuccess(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
      errorMessage.style.background = '#d4edda';
      errorMessage.style.color = '#155724';
      errorMessage.textContent = message;
      errorMessage.style.display = 'flex';
    }
  }

  /**
   * Limpiar la vista
   */
  destroy() {
    // Limpiar event listeners si es necesario
    const form = document.getElementById('loginForm');
    if (form) {
      form.removeEventListener('submit', this.handleLogin);
    }
  }
}