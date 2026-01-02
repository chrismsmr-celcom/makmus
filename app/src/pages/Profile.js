import { Header, initHeader } from '../components/Header';
import { authStore } from '../stores/authStore';
import { router } from '../lib/router';

export async function renderProfile(app) {
  if (!authStore.isAuthenticated()) {
    router.navigate('/login');
    return;
  }

  const profile = authStore.profile;

  app.innerHTML = `
    ${Header()}
    <div class="profile-page">
      <div class="container">
        <div class="profile-container">
          <h1>Mon Profil</h1>

          <form id="profileForm" class="profile-form">
            <div class="form-group">
              <label for="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                class="input"
                value="${profile?.username || ''}"
                required
              />
            </div>

            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea
                id="bio"
                class="input"
                rows="4"
                placeholder="Parlez-nous de vous..."
              >${profile?.bio || ''}</textarea>
            </div>

            <div class="form-group">
              <label for="avatar_url">URL de l'avatar</label>
              <input
                type="url"
                id="avatar_url"
                class="input"
                value="${profile?.avatar_url || ''}"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                class="input"
                value="${authStore.user?.email || ''}"
                disabled
              />
              <small>L'email ne peut pas être modifié</small>
            </div>

            <div id="errorMessage" class="error" style="display:none;"></div>
            <div id="successMessage" class="success" style="display:none;"></div>

            <button type="submit" class="btn btn-primary">
              Enregistrer les modifications
            </button>
          </form>

          <div class="profile-stats">
            <h2>Statistiques</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-value" id="bookmarksCount">-</span>
                <span class="stat-label">Articles enregistrés</span>
              </div>
              <div class="stat-card">
                <span class="stat-value" id="commentsCount">-</span>
                <span class="stat-label">Commentaires</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .profile-page {
        min-height: calc(100vh - 73px);
        padding: var(--spacing-xl) 0;
        background: var(--bg-secondary);
      }

      .profile-container {
        max-width: 600px;
        margin: 0 auto;
        background: #fff;
        padding: var(--spacing-xl);
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
      }

      .profile-container h1 {
        text-align: center;
        margin-bottom: var(--spacing-lg);
      }

      .profile-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
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

      .form-group small {
        font-size: 0.85rem;
        color: var(--text-secondary);
      }

      .profile-stats {
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--border);
      }

      .profile-stats h2 {
        font-size: 1.3rem;
        margin-bottom: var(--spacing-md);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-md);
      }

      .stat-card {
        text-align: center;
        padding: var(--spacing-md);
        background: var(--bg-secondary);
        border-radius: var(--radius);
      }

      .stat-value {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 0.25rem;
      }

      .stat-label {
        font-size: 0.85rem;
        color: var(--text-secondary);
      }
    </style>
  `;

  initHeader();
  await loadStats();

  const form = document.getElementById('profileForm');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    const updates = {
      username: document.getElementById('username').value,
      bio: document.getElementById('bio').value,
      avatar_url: document.getElementById('avatar_url').value || null,
    };

    try {
      await authStore.updateProfile(updates);
      successMessage.textContent = 'Profil mis à jour avec succès !';
      successMessage.style.display = 'block';
    } catch (error) {
      errorMessage.textContent = error.message || 'Erreur lors de la mise à jour';
      errorMessage.style.display = 'block';
    }
  });
}

async function loadStats() {
  try {
    const { supabase } = await import('../lib/supabase');

    const { count: bookmarksCount } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authStore.user.id);

    const { count: commentsCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authStore.user.id);

    document.getElementById('bookmarksCount').textContent = bookmarksCount || 0;
    document.getElementById('commentsCount').textContent = commentsCount || 0;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}
