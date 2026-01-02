import { Header, initHeader } from '../components/Header';
import { authStore } from '../stores/authStore';
import { router } from '../lib/router';

export function renderLogin(app) {
  app.innerHTML = `
    ${Header()}
    <div class="auth-page">
      <div class="container">
        <div class="auth-container">
          <h1>Connexion</h1>
          <form id="loginForm" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                class="input"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                class="input"
                placeholder="••••••••"
                required
              />
            </div>

            <div id="errorMessage" class="error" style="display:none;"></div>

            <button type="submit" class="btn btn-primary btn-full">
              Se connecter
            </button>
          </form>

          <p class="auth-switch">
            Pas encore de compte ?
            <a href="/signup" data-link>Créer un compte</a>
          </p>
        </div>
      </div>
    </div>

    <style>
      .auth-page {
        min-height: calc(100vh - 73px);
        display: flex;
        align-items: center;
        padding: var(--spacing-xl) 0;
        background: var(--bg-secondary);
      }

      .auth-container {
        max-width: 450px;
        margin: 0 auto;
        background: #fff;
        padding: var(--spacing-xl);
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
      }

      .auth-container h1 {
        text-align: center;
        margin-bottom: var(--spacing-lg);
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group label {
        font-weight: 500;
        font-size: 0.9rem;
      }

      .btn-full {
        width: 100%;
      }

      .auth-switch {
        text-align: center;
        margin-top: var(--spacing-md);
        color: var(--text-secondary);
      }

      .auth-switch a {
        color: var(--accent);
        font-weight: 500;
      }

      .auth-switch a:hover {
        text-decoration: underline;
      }
    </style>
  `;

  initHeader();

  const form = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.style.display = 'none';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      await authStore.signIn(email, password);
      router.navigate('/');
    } catch (error) {
      errorMessage.textContent = error.message || 'Erreur de connexion';
      errorMessage.style.display = 'block';
    }
  });
}

export function renderSignup(app) {
  app.innerHTML = `
    ${Header()}
    <div class="auth-page">
      <div class="container">
        <div class="auth-container">
          <h1>Créer un compte</h1>
          <form id="signupForm" class="auth-form">
            <div class="form-group">
              <label for="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                class="input"
                placeholder="johndoe"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                class="input"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                class="input"
                placeholder="••••••••"
                minlength="6"
                required
              />
            </div>

            <div id="errorMessage" class="error" style="display:none;"></div>
            <div id="successMessage" class="success" style="display:none;"></div>

            <button type="submit" class="btn btn-primary btn-full">
              Créer mon compte
            </button>
          </form>

          <p class="auth-switch">
            Déjà un compte ?
            <a href="/login" data-link>Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  `;

  initHeader();

  const form = document.getElementById('signupForm');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      await authStore.signUp(email, password, username);
      successMessage.textContent = 'Compte créé avec succès !';
      successMessage.style.display = 'block';

      setTimeout(() => {
        router.navigate('/');
      }, 2000);
    } catch (error) {
      errorMessage.textContent = error.message || 'Erreur lors de la création du compte';
      errorMessage.style.display = 'block';
    }
  });
}
