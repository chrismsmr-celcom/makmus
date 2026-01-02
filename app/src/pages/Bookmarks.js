import { Header, initHeader } from '../components/Header';
import { ArticleCard } from '../components/ArticleCard';
import { supabase } from '../lib/supabase';
import { authStore } from '../stores/authStore';
import { router } from '../lib/router';

export async function renderBookmarks(app) {
  if (!authStore.isAuthenticated()) {
    router.navigate('/login');
    return;
  }

  app.innerHTML = `
    ${Header()}
    <div class="bookmarks-page">
      <div class="container">
        <h1>Mes articles enregistrés</h1>
        <div id="bookmarksContainer" class="loading">
          <div class="spinner"></div>
        </div>
      </div>
    </div>

    <style>
      .bookmarks-page {
        min-height: calc(100vh - 73px);
        padding: var(--spacing-xl) 0;
      }

      .bookmarks-page h1 {
        text-align: center;
        margin-bottom: var(--spacing-xl);
      }

      #bookmarksContainer {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--spacing-lg);
      }

      @media (max-width: 768px) {
        #bookmarksContainer {
          grid-template-columns: 1fr;
        }
      }

      .empty-state {
        text-align: center;
        padding: var(--spacing-xl);
      }

      .empty-state p {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-md);
      }
    </style>
  `;

  initHeader();
  await loadBookmarks();
}

async function loadBookmarks() {
  const container = document.getElementById('bookmarksContainer');

  try {
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select(`
        *,
        articles (*)
      `)
      .eq('user_id', authStore.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (bookmarks && bookmarks.length > 0) {
      const articles = bookmarks.map(b => b.articles).filter(Boolean);
      container.innerHTML = articles.map(article => ArticleCard(article)).join('');
    } else {
      container.innerHTML = `
        <div class="empty-state">
          <p>Vous n'avez pas encore d'articles enregistrés.</p>
          <a href="/" data-link class="btn btn-primary">Découvrir des articles</a>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    container.innerHTML = '<p class="error">Erreur lors du chargement des favoris.</p>';
  }
}
