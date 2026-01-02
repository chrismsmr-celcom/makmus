export function CategoryNav(activeCategory = 'all') {
  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'politics', label: 'Politique' },
    { id: 'business', label: 'Économie' },
    { id: 'sports', label: 'Sport' },
    { id: 'entertainment', label: 'Culture' },
    { id: 'technology', label: 'Tech' },
    { id: 'world', label: 'Monde' }
  ];

  return `
    <nav class="category-nav">
      <div class="category-nav-scroll">
        ${categories.map(cat => `
          <button
            class="category-btn ${activeCategory === cat.id ? 'active' : ''}"
            data-category="${cat.id}"
          >
            ${cat.label}
          </button>
        `).join('')}
      </div>

      <style>
        .category-nav {
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          padding: var(--spacing-sm) 0;
          position: sticky;
          top: 73px;
          z-index: 90;
        }

        .category-nav-scroll {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0 var(--spacing-sm);
          -webkit-overflow-scrolling: touch;
        }

        .category-nav-scroll::-webkit-scrollbar {
          display: none;
        }

        .category-btn {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 500;
          white-space: nowrap;
          transition: var(--transition);
          border: 1px solid var(--border);
          background: #fff;
          color: var(--text);
        }

        .category-btn:hover {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
        }

        .category-btn.active {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
        }
      </style>
    </nav>
  `;
}
