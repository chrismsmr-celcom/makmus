export function ArticleCard(article) {
  const imageUrl = article.image_url || 'https://via.placeholder.com/400x250?text=MAKMUS';
  const date = new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <article class="article-card card">
      <a href="/article/${article.id}" data-link class="article-link">
        <div class="article-image">
          <img src="${imageUrl}" alt="${article.title}" loading="lazy" />
          <span class="article-category">${article.category}</span>
        </div>
        <div class="article-content">
          <h3 class="article-title">${article.title}</h3>
          <p class="article-description">${article.description || ''}</p>
          <div class="article-meta">
            <span class="article-author">${article.author}</span>
            <span class="article-date">${date}</span>
          </div>
        </div>
      </a>

      <style>
        .article-card {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .article-link {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .article-image {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .article-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition);
        }

        .article-card:hover .article-image img {
          transform: scale(1.05);
        }

        .article-category {
          position: absolute;
          top: var(--spacing-sm);
          left: var(--spacing-sm);
          background: rgba(17, 17, 17, 0.9);
          color: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .article-content {
          padding: var(--spacing-md);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .article-title {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .article-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: auto;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .article-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--spacing-sm);
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .article-author {
          font-weight: 500;
        }

        .article-date {
          font-style: italic;
        }
      </style>
    </article>
  `;
}
