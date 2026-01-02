import { authStore } from '../stores/authStore';
import { router } from '../lib/router';

export function Header() {
  const isAuth = authStore.isAuthenticated();
  const profile = authStore.profile;

  const handleSignOut = async () => {
    try {
      await authStore.signOut();
      router.navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <a href="/" data-link class="logo">
            <img src="https://i.postimg.cc/7ZWdGrQc/Screenshot_2025_12_24_21_32_24_removebg_preview.png" alt="MAKMUS" />
          </a>

          <nav class="nav">
            <a href="/" data-link class="nav-link">Accueil</a>
            ${isAuth ? `
              <a href="/bookmarks" data-link class="nav-link">Favoris</a>
              <a href="/profile" data-link class="nav-link">
                ${profile?.username || 'Profil'}
              </a>
              <button class="btn btn-secondary btn-sm" id="signOutBtn">Déconnexion</button>
            ` : `
              <a href="/login" data-link class="btn btn-primary btn-sm">Connexion</a>
            `}
          </nav>

          <button class="menu-toggle" id="menuToggle">☰</button>
        </div>
      </div>

      <style>
        .header {
          background: #fff;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: var(--shadow);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }

        .logo img {
          height: 40px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          font-weight: 500;
          transition: color var(--transition);
        }

        .nav-link:hover {
          color: var(--accent);
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }

        .menu-toggle {
          display: none;
          font-size: 1.5rem;
          color: var(--text);
        }

        @media (max-width: 768px) {
          .nav {
            display: none;
          }

          .menu-toggle {
            display: block;
          }
        }
      </style>
    </header>
  `;
}

export function initHeader() {
  const signOutBtn = document.getElementById('signOutBtn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      try {
        await authStore.signOut();
        router.navigate('/');
      } catch (error) {
        console.error('Sign out error:', error);
      }
    });
  }

  authStore.subscribe(() => {
    const app = document.getElementById('app');
    if (app && app.innerHTML) {
      router.resolve();
    }
  });
}
