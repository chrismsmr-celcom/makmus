import { Header, initHeader } from '../components/Header';
import { supabase } from '../lib/supabase';
import { authStore } from '../stores/authStore';
import { router } from '../lib/router';

export async function renderArticle(app, articleId) {
  app.innerHTML = `
    ${Header()}
    <div id="articleContent" class="loading">
      <div class="spinner"></div>
    </div>
  `;

  initHeader();

  try {
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .maybeSingle();

    if (error) throw error;

    if (!article) {
      app.innerHTML = `
        ${Header()}
        <div class="container">
          <p style="text-align:center;padding:2rem;">Article non trouvé.</p>
        </div>
      `;
      return;
    }

    await supabase
      .from('articles')
      .update({ views_count: (article.views_count || 0) + 1 })
      .eq('id', articleId);

    const isAuth = authStore.isAuthenticated();
    let isBookmarked = false;

    if (isAuth) {
      const { data: bookmark } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', authStore.user.id)
        .maybeSingle();

      isBookmarked = !!bookmark;
    }

    const { data: comments } = await supabase
      .from('comments')
      .select(`
        *,
        user_profiles (username, avatar_url)
      `)
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });

    const date = new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    app.innerHTML = `
      ${Header()}
      <article class="article-page">
        <div class="container">
          <div class="article-header">
            <span class="article-category">${article.category}</span>
            <h1>${article.title}</h1>
            <div class="article-meta">
              <span>${article.author}</span>
              <span>${date}</span>
              <span>${article.views_count || 0} vues</span>
            </div>
          </div>

          ${article.image_url ? `
            <div class="article-hero-image">
              <img src="${article.image_url}" alt="${article.title}" />
            </div>
          ` : ''}

          <div class="article-content">
            <div class="article-actions">
              ${isAuth ? `
                <button id="bookmarkBtn" class="btn btn-secondary">
                  ${isBookmarked ? '★ Enregistré' : '☆ Enregistrer'}
                </button>
              ` : ''}
              ${article.source_url ? `
                <a href="${article.source_url}" target="_blank" class="btn btn-secondary">
                  Lire la source
                </a>
              ` : ''}
            </div>

            <div class="article-body">
              ${article.description ? `<p class="lead">${article.description}</p>` : ''}
              ${article.content}
            </div>
          </div>

          <div class="comments-section">
            <h2>Commentaires (${comments?.length || 0})</h2>

            ${isAuth ? `
              <form id="commentForm" class="comment-form">
                <textarea
                  id="commentInput"
                  class="input"
                  placeholder="Votre commentaire..."
                  rows="3"
                  required
                ></textarea>
                <button type="submit" class="btn btn-primary">
                  Publier
                </button>
              </form>
            ` : `
              <p class="login-prompt">
                <a href="/login" data-link>Connectez-vous</a> pour commenter
              </p>
            `}

            <div class="comments-list">
              ${comments && comments.length > 0 ? comments.map(comment => `
                <div class="comment">
                  <div class="comment-header">
                    <strong>${comment.user_profiles?.username || 'Utilisateur'}</strong>
                    <span>${new Date(comment.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p>${comment.content}</p>
                  ${authStore.user?.id === comment.user_id ? `
                    <button class="delete-comment" data-id="${comment.id}">Supprimer</button>
                  ` : ''}
                </div>
              `).join('') : '<p class="no-comments">Aucun commentaire pour le moment.</p>'}
            </div>
          </div>
        </div>
      </article>

      <style>
        .article-page {
          padding: var(--spacing-xl) 0;
        }

        .article-header {
          margin-bottom: var(--spacing-lg);
          text-align: center;
        }

        .article-category {
          display: inline-block;
          background: var(--primary);
          color: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: var(--spacing-sm);
        }

        .article-meta {
          display: flex;
          justify-content: center;
          gap: 1rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: var(--spacing-sm);
        }

        .article-hero-image {
          margin-bottom: var(--spacing-lg);
          border-radius: var(--radius);
          overflow: hidden;
        }

        .article-hero-image img {
          width: 100%;
          height: auto;
          max-height: 500px;
          object-fit: cover;
        }

        .article-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .article-actions {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
          justify-content: center;
        }

        .article-body {
          line-height: 1.8;
        }

        .article-body .lead {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: var(--spacing-lg);
        }

        .article-body p {
          margin-bottom: var(--spacing-md);
        }

        .comments-section {
          max-width: 800px;
          margin: var(--spacing-xl) auto 0;
          padding-top: var(--spacing-xl);
          border-top: 1px solid var(--border);
        }

        .comment-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
        }

        .comment-form button {
          align-self: flex-end;
        }

        .login-prompt {
          text-align: center;
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-lg);
        }

        .login-prompt a {
          color: var(--accent);
          font-weight: 500;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .comment {
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius);
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .comment-header span {
          color: var(--text-secondary);
        }

        .delete-comment {
          color: var(--accent);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .no-comments {
          text-align: center;
          color: var(--text-secondary);
          padding: var(--spacing-lg);
        }
      </style>
    `;

    initHeader();
    initArticleActions(articleId, isBookmarked);
  } catch (error) {
    console.error('Error loading article:', error);
    app.innerHTML = `
      ${Header()}
      <div class="container">
        <p class="error">Erreur lors du chargement de l'article.</p>
      </div>
    `;
  }
}

function initArticleActions(articleId, isBookmarked) {
  const bookmarkBtn = document.getElementById('bookmarkBtn');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', async () => {
      try {
        if (isBookmarked) {
          await supabase
            .from('bookmarks')
            .delete()
            .eq('article_id', articleId)
            .eq('user_id', authStore.user.id);

          bookmarkBtn.textContent = '☆ Enregistrer';
          isBookmarked = false;
        } else {
          await supabase
            .from('bookmarks')
            .insert({
              article_id: articleId,
              user_id: authStore.user.id
            });

          bookmarkBtn.textContent = '★ Enregistré';
          isBookmarked = true;
        }
      } catch (error) {
        console.error('Bookmark error:', error);
      }
    });
  }

  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const content = document.getElementById('commentInput').value;

      try {
        await supabase.from('comments').insert({
          article_id: articleId,
          user_id: authStore.user.id,
          content
        });

        router.resolve();
      } catch (error) {
        console.error('Comment error:', error);
      }
    });
  }

  document.querySelectorAll('.delete-comment').forEach(btn => {
    btn.addEventListener('click', async () => {
      const commentId = btn.dataset.id;
      try {
        await supabase.from('comments').delete().eq('id', commentId);
        router.resolve();
      } catch (error) {
        console.error('Delete comment error:', error);
      }
    });
  });
}
